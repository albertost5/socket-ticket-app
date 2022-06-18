const socketController = socket => { 

    console.log(`Client ${ socket.id } connected..`);

    socket.on( 'disconnect', () => {
       
    });

    socket.on( 'send-message', ( payload ) => {
       
    });

}


module.exports = {
    socketController
}
