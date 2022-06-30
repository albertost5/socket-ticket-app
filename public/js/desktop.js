console.log('Desktop HTML');

const socket = io();

// HTML references
const LBL_PENDING = document.querySelector('#lblPending');
const LBL_DESKTOP = document.querySelector('h1');
const BTN_ATTEND = document.querySelector('.btn');
const LBL_TICKET_ATTENDING = document.querySelector('small');
const DIV_ALERT =  document.querySelector('.alert');
DIV_ALERT.style.display = 'none';

const queryParam = new URLSearchParams( window.location.search );

if( !queryParam.has( 'desktop' ) ) {

    window.location = 'index.html';
    throw new Error('Desktop field is required!');
}

const DESKTOP = queryParam.get( 'desktop' );


socket.on( 'current-tickets', ( pendingTicketsLength ) => {
    
   console.log( 'current-tickets => ', pendingTicketsLength );
   
   LBL_PENDING.innerHTML = pendingTicketsLength;

   if( pendingTicketsLength === 0 ) DIV_ALERT.style.display = '';
});

socket.on( 'pending-tickets', ( currentPendingTickets ) => {

    console.log( 'pending-ticekts => ', currentPendingTickets );

    LBL_PENDING.innerHTML = currentPendingTickets;

    if( currentPendingTickets === 0 ){
        DIV_ALERT.style.display = '';
    } else {
        DIV_ALERT.style.display = 'none';
    } 
});

socket.on( 'connect', () => {
    LBL_DESKTOP.innerHTML = DESKTOP;
    BTN_ATTEND.disabled = false;
});

socket.on( 'disconnect', () => {
    BTN_ATTEND.disabled = true;
});
 
BTN_ATTEND.addEventListener( 'click', () => {  

    socket.emit( 'attend-ticket', { desktop: DESKTOP }, ( response ) => {

        if( response.number ) {
            LBL_TICKET_ATTENDING.innerHTML = `Ticket ${ response.number }`;
          
        } else {
            DIV_ALERT.style.display = '';
            LBL_TICKET_ATTENDING.innerHTML = 'nobody.';
            return;
        }

    });
});
