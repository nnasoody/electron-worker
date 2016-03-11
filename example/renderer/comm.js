'use strict';

const ipc = require('ipc');

// ------------
// Module
// ------------

function Discovery() {
	Discovery.setup.call(this);
}

Discovery.setup = function() {
    console.log('Initialize discovery.');
    ipc.on('discovery.statusUpdate', this.handleOnStatusUpdate.bind(this));
    ipc.on('discovery.ready', this.handleOnReady.bind(this));
    ipc.on('discovery.completed', this.handleOnComplete.bind(this));
    ipc.send('discovery.init');
};

Discovery.prototype.start = function(payload) {
    ipc.send('discovery.start', payload);
};

Discovery.prototype.handleOnStatusUpdate = function(parcel) {
    this.print(parcel);
};

Discovery.prototype.handleOnReady = function() {
    this.start({
        fname: 'John',
        lname: 'Smith'
    });
};

Discovery.prototype.handleOnComplete = function() {
	console.log('discovery completed!');
};

Discovery.prototype.print = function(parcel) {
    if (parcel.msg && parcel.msg.indexOf('{') === 0)            
        return console.log('[Incoming]', JSON.parse(parcel.msg));        
    console.log(`[Incoming] ${parcel.msg}`);
};
