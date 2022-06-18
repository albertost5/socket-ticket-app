const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = socket => { 

    console.log(`Client ${ socket.id } connected..`);

    // Last ticket event
    socket.emit( 'last-ticket', ticketControl.last );
    
    socket.on( 'connection', () => {
        
    });

    socket.on( 'disconnect', () => {

    });

    socket.on( 'next-ticket', ( payload, callback ) => {
       
        // Return string: Ticket: 10.
        const next = ticketControl.nextTicket();
        callback( next )

        // TO DO: There is a new ticket to be attended.
    });

    // Payload: { desktop: 'Desktop 1' }
    socket.on( 'attend-ticket', ({ desktop }, callback ) => {
   
        if( !desktop ) {
            return callback({
                error: 'The desktop field is required!'
            });
        }

        const TICKET = ticketControl.attendTicket( desktop );

        // TO DO: notify change 

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
