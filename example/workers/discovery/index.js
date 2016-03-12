'use strict';

const BrowserWindow = require('browser-window');
const ipc = require('ipc-main');

// ------------
// Module
// ------------

module.exports = setup;

// ------------
// Globals
// ------------

var rendererEventRef = null;
var selfEventRef     = null;
var dataParcel       = null;
var browserWindow    = null;

// ------------
// functions
// ------------

function setup() {
    browserWindow = new BrowserWindow({ show: false });
    browserWindow.on('closed', () => browserWindow = null);
    // Event bindings
    ipc.on('discovery.init', init);
    ipc.on('discovery.start', start);
    ipc.on('discovery.terminate', terminate);
    ipc.on('discovery.self.ready', handleOnSelfReadyComplete);
    ipc.on('discovery.self.update', update);
    ipc.on('discovery.self.fetchParcel', handleFetchParcel);
    ipc.on('discovery.self.complete', handleOnProcessComplete);    
}

function init(event) {
    console.log('Initializing discovery process.');
    browserWindow.loadURL('file://' + __dirname + '/index.html');
    browserWindow.webContents.openDevTools();
    browserWindow.show();
    rendererEventRef = event;
}

function handleOnSelfReadyComplete(event) {
    console.log('Cache reference to self\'s event.');
    selfEventRef = event;
    update(null, { msg: 'discovery is ready!' });
    rendererEventRef.sender.send('discovery.ready');
}

function start(event, parcel) {
    dataParcel = parcel;
    selfEventRef.sender.send('discovery.self.start');
    update(null, { msg: 'discovery stared!' });
}

function update(event, arg) {
    console.log(arg);
    rendererEventRef.sender.send('discovery.statusUpdate', arg);
}

function handleFetchParcel(event) {
    selfEventRef.sender.send('discovery.self.parcelReceive', dataParcel);
}

function handleOnProcessComplete(event, arg) {
    rendererEventRef.sender.send('discovery.completed', arg);
}

function terminate() {
    browserWindow.close();
    
    ipc.removeAllListeners('discovery.init');
    ipc.removeAllListeners('discovery.start');
    ipc.removeAllListeners('discovery.terminate');
    ipc.removeAllListeners('discovery.self.ready');
    ipc.removeAllListeners('discovery.self.update');
    ipc.removeAllListeners('discovery.self.fetchParcel');
    ipc.removeAllListeners('discovery.self.complete');    
}