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
    ipc.on('{{process}}.init', init);
    ipc.on('{{process}}.start', start);
    ipc.on('{{process}}.self.ready', handleOnSelfReadyComplete);
    ipc.on('{{process}}.self.update', update);
    ipc.on('{{process}}.self.fetchParcel', handleFetchParcel);
    ipc.on('{{process}}.self.complete', handleOnProcessComplete);
}

function init(event) {
    console.log('Initializing {{process}} process.');
    browserWindow.loadURL('file://' + __dirname + '/index.html');
    browserWindow.webContents.openDevTools();
    browserWindow.show();
    rendererEventRef = event;
}

function handleOnSelfReadyComplete(event) {
    console.log('Cache reference to self\'s event.');
    selfEventRef = event;
    update(null, { msg: '{{process}} is ready!' });
    rendererEventRef.sender.send('{{process}}.ready');
}

function start(event, parcel) {
    dataParcel = parcel;
    selfEventRef.sender.send('{{process}}.self.start');
    update(null, { msg: '{{process}} stared!' });
}

function update(event, arg) {
    console.log(arg);
    rendererEventRef.sender.send('{{process}}.statusUpdate', arg);
}

function handleFetchParcel(event) {
    selfEventRef.sender.send('{{process}}.self.parcelReceive', dataParcel);
}

function handleOnProcessComplete(event, arg) {
    rendererEventRef.sender.send('{{process}}.completed', arg);
}
