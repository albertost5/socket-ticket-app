const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = socket => { 

    console.log(`Client ${ socket.id } connected..`);

    /** When a new client is connected:
     *  - last-ticket
     *  - current-status ( last four tickets)
     *  - current-tickets ( pending tickets to be attended) 
     * */ 
    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'current-status', ticketControl.lastFourTickets );
    socket.emit( 'current-tickets', ticketControl.tickets.length );


    socket.on( 'next-ticket', ( payload, callback ) => {
       
        // Return string: Ticket: 10.
        const next = ticketControl.nextTicket();
        callback( next );

        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );
    });

    // Payload: { desktop: 'Desktop 1' }
    socket.on( 'attend-ticket', ({ desktop }, callback ) => {
   
        if( !desktop ) {
            return callback({
                error: 'The desktop field is required!'
            });
        }

        // Get the ticket after update the array of the last 4 tickets.
        const TICKET = ticketControl.attendTicket( desktop );

        // Notify change to the desktop.html broadcasting the event to send emit it from new-ticket.html to desktop.html
        socket.broadcast.emit( 'current-status', ticketControl.lastFourTickets );
        
        // Pending tickets
        socket.emit( 'pending-tickets', ticketControl.tickets.length );
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

        if( !TICKET ) {
            return callback({
                error: 'There is not tickets to attend.'
            });
        } else {
            callback( TICKET );
        }
    });
}


module.exports = {
    socketController
}
