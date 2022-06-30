const path = require('path');
const fs = require('fs');
const { dirname } = require('path');

class TicketControl {

    #dbPath = path.join( __dirname, '../../../db/data.json' );

    constructor( ) {
        this.last = 0;
        this.currentDate = new Date().getDate();
        this.tickets = [];
        this.lastFourTickets = [];

        this.init();
    }

    get toJson() {
        return {
            last: this.last,
            currentDate: this.currentDate,
            tickets: this.tickets,
            lastFourTickets: this.lastFourTickets
        }
    }

    init() {
        if( fs.existsSync( this.#dbPath ) ) {

            const { last, currentDate, tickets, lastFourTickets } = require('../../../db/data.json');
            
            // Current day 
            if( currentDate == this.currentDate ) {
                this.last = last
                this.tickets = tickets;
                this.lastFourTickets = lastFourTickets;
            // Different day
            } else {
                this.saveDb();
            }
        } else {
            const DB_FOLDER = path.join( __dirname, '../../../db');

            if( !fs.existsSync( DB_FOLDER ) ) {
                fs.mkdirSync( DB_FOLDER );
                fs.writeFileSync('db/data.json', JSON.stringify( this.toJson ) );
            } else {
                fs.writeFileSync('db/data.json', JSON.stringify( this.toJson ) );
            }
        }

    }

    saveDb() {
        // Restart the properties or load the ones from the JSON if it's the same day
        fs.writeFileSync( this.#dbPath, JSON.stringify( this.toJson ) );
    }

    nextTicket() {
        this.last += 1;
        const ticket = new Ticket( this.last, null );
        this.tickets.push( ticket );
        
        // persist the new ticket
        this.saveDb();

        return `Ticket: ${ ticket.number }`;
    }

    attendTicket( desktop ) {
        if( this.tickets.length == 0 ) {
            return null;
        }

        // First ticket to be attended. Removed from the array. => this.tickets[0]
        const ticket = this.tickets.shift();

        // Assign a desktop where it will be attended
        ticket.desktop = desktop;

        // Put the ticket at the start of the array
        this.lastFourTickets.unshift( ticket );
       
        // Delete the last position of the array
        if( this.lastFourTickets.length > 4 ) {
            this.lastFourTickets.splice( -1, 1 );
        }

        this.saveDb();

        return ticket;
    }
}

class Ticket {
    constructor( ticketNumber, desktop ) {
        this.number = ticketNumber;
        this.desktop = desktop;
    }
}

module.exports = TicketControl;
