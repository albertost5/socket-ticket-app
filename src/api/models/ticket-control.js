const path = require('path');
const fs = require('fs');

class TicketControl {

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
    }

    saveDb() {
        const dbPath = path.join( __dirname, '../../../db/data.json' );
        
        // Restart the properties or load the ones from the JSON if it's the same day
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );
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
