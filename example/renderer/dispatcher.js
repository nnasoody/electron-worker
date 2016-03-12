'use strict';

const ipc = require('ipc');
const uuid = require('uuid');

// ------------
// Globals
// ------------

const CHANNEL = 'storage'; 
const CALLBACK_CHANNEL = 'renderer.storage';

// ------------
// Functions
// ------------

function Dispatcher() {
	Dispatcher.setup.call(this);
}

Dispatcher.setup = function() {
	this.lookup = {};
    ipc.on(CALLBACK_CHANNEL, this.reply.bind(this));
}

// @params >> 	{ defer, query, context }
Dispatcher.prototype.enqueue = function(params) {
	let id = uuid.v1();
	let job = Object.assign({ 
		id: id,
		callbackChannel: CALLBACK_CHANNEL 
	}, params);

	this.lookup[id] = job;
	console.log(job);
	this.dispatch(job);
};

Dispatcher.prototype.dispatch = function(job) {
  	console.log('dispatching now!');
    ipc.send(CHANNEL, job, () => {
    	console.log('yoyo');
    });
};

Dispatcher.prototype.reply = function(resp) {
	let parcel = JSON.parse(resp);
	let job = this.lookup[parcel.id];
	console.log(job);
	// TODO: Revisit this!
	// job.defer.resolve(data); 
}

// module.exports = new Dispatcher();
var storage = new Dispatcher();

/*

storage.enqueue({
	context: {},
	defer: null,
	query: 'sql_query'
});

storage.enqueue({
	context: {},
	defer: null,
	query: 'sql_query'
})

*/