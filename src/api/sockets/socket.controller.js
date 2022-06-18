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
}


module.exports = {
    socketController
}
