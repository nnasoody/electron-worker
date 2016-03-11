'use strict';

const ipc = require('ipc');

// ------------
// Module
// ------------

function {{PROCESS}}() {
	{{PROCESS}}.setup.call(this);
}

{{PROCESS}}.setup = function() {
    console.log('Initialize {{process}}.');
    ipc.on('{{process}}.statusUpdate', this.handleOnStatusUpdate.bind(this));
    ipc.on('{{process}}.ready', this.handleOnReady.bind(this));
    ipc.on('{{process}}.completed', this.handleOnComplete.bind(this));
    ipc.send('{{process}}.init');
};

{{PROCESS}}.prototype.start = function(payload) {
    ipc.send('{{process}}.start', payload);
};

{{PROCESS}}.prototype.handleOnStatusUpdate = function(parcel) {
    this.print(parcel);
};

{{PROCESS}}.prototype.handleOnReady = function() {
    this.start({
        fname: 'John',
        lname: 'Smith'
    });
};

{{PROCESS}}.prototype.handleOnComplete = function() {
	console.log('{{process}} completed!');
};

{{PROCESS}}.prototype.print = function(parcel) {
    if (parcel.msg && parcel.msg.indexOf('{') === 0)            
        return console.log('[Incoming]', JSON.parse(parcel.msg));        
    console.log(`[Incoming] ${parcel.msg}`);
};

let {{process}}Instance = new {{PROCESS}}();