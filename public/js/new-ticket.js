console.log('New ticket HTML');

// HTML references
const LBL_NEW_TICKET = document.querySelector('#lblNewTicket');
const BTN_CREATE = document.querySelector('button');

const socket = io();


socket.on('connect', () => {
    BTN_CREATE.disabled = false;
});

socket.on('disconnect', () => {
    BTN_CREATE.disabled = true;
});

socket.on('last-ticket', lastTicketNumber => {
    LBL_NEW_TICKET.innerHTML = `Ticket: ${ lastTicketNumber }`;
});


// socket.emit
BTN_CREATE.addEventListener( 'click', () => {

    socket.emit('next-ticket', null, ( ticket ) => {
        LBL_NEW_TICKET.innerHTML = ticket;
    });

});