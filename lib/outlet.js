'use strict';

const EventEmitter = require('events');
const log = require('./logger.js').child({module:'Outlet'});
const moment = require('moment');

class Outlet extends EventEmitter {
	constructor(ws, req) {
		super();

		ws.on('message', (message) => {
			this.emit('message', message);
			this.process(message);
		});

		ws.on('error', function(err){
			log.error({err}, 'Outlet encountered error!')
		});

		this.ws = ws;
	}

	//TODO: refactor and clean up
	process(message) {
		//Detect various message types and handle them appropriately.
		message = JSON.parse(message);
		log.debug({message}, "Outlet sent message");

		let now = moment().utc();
		let start = now.clone().startOf('day');

		if (message.id) {
			Object.assign(this, message);
			this.send({
				uri:'/loginReply',
				error:0,
				wd: now.day(),
				year: now.year(),
				month: 1 + now.month(),
				day: now.date(),
				ms: moment.duration(now.diff(start)).as('milliseconds'),
				hh:0,
				hl:0,
				lh:0,
				ll:0
			})
			this.emit('ready');

		} else if (message.relay) {
			//relay has changed states. record new state
			this.relay = message.relay;
			//emit change event on any state change
			this.emit('change');
			//convenience: emit on/off event
			this.emit(('break'==message.relay) ? 'off' : 'on');
		} else if ('/ka' == message.uri) {
			//TODO: log RSSI value
			this.send({
				uri:'/kr',
				error: 0,
				wd: now.day(),
				year: now.year(),
				month: 1 + now.month(),
				day: now.date(),
				ms: moment.duration(now.diff(start)).as('milliseconds')
			})
		} else if ('/report' == message.uri) {
			//TODO: log electrical usage values
		}
	}

	send(message) {
		this.ws.send(JSON.stringify(message));
	}

	on() {
		this.send({uri: '/relay', action:'open'});
	}

	off() {
		this.send({uri: '/relay', action:'break'});
	}

	switch() {
		('break'==this.relay) ? this.on() : this.off();
	}
}

module.exports = Outlet;