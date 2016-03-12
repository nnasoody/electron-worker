'use strict';

const fs      = require("fs");
const sqlite3 = require("sqlite3").verbose();
const ipc     = require('ipc-main');

// ------------
// Module
// ------------

module.exports = setup;

// ------------
// Globals
// ------------

let db = null;
const DATA_FILE = "data.db";

// ------------
// functions
// ------------

function setup() {
    setupDatabase();
    ipc.on('storage', handleOnMessageRecieve);
}

function handleOnMessageRecieve(event, parcel) {
    db.all("SELECT rowid AS id, thing FROM Stuff", (err, records) => {
        let resp = Object.extend(parcel, { data: records });
        event.sender.send(parcel.callbackChannel, JSON.stringify(resp));
    });
}

function setupDatabase() {
    let exists = fs.existsSync(DATA_FILE);
    let db = new sqlite3.Database(DATA_FILE);

    db.serialize(function() {
        if (!exists)
            db.run("CREATE TABLE Stuff (thing TEXT)");
        var stmt = db.prepare("INSERT INTO Memorables VALUES (?)");
        var rnd;
        for (var i = 0; i < 10; i++) {
            rnd = Math.floor(Math.random() * 10000000);
            stmt.run("Thing #" + rnd);
        }
        stmt.finalize();
    });    
}