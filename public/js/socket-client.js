
const socket = io();

// socket.emit
btnEnviar.addEventListener( 'click', () => {

    const message = txtMessage.value;
    const payload = {
        message,
        id: '123ABC',
        date: new Date().getTime()
    }
    
    socket.emit( 'send-message', payload, ( id ) => {
        console.log('client', id );
    });

});