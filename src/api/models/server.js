const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { socketController } = require('../sockets/socket.controller');

class Server {
    
    constructor( routes = [] ) {
        this.routes = routes;
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);


        // Middlewares
        this.middlewares();

        // Sockets config
        this.sockets();
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.static('public') );
    }
    
    sockets() {
        this.io.on( 'connection', socketController);
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log(`Socket-ticket-app listening on port ${ this.port }...`)
        });
    }
}


module.exports = Server;
