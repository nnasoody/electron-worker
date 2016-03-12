'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const worker = require('./workers/storage/index');

// ------------
// Globals
// ------------

let mainWindow = null;

// ------------
// Functions
// ------------

function handleOnAllWindowsClosed() {
    if (process.platform != 'darwin') 
        app.quit();
}

function handleOnAppReady() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null);

    worker();
}

// ------------
// Program
// ------------

app.on('window-all-closed', handleOnAllWindowsClosed);
app.on('ready', handleOnAppReady);
