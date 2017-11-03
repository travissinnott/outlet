'use strict';

const EventEmitter = require('events');
const log = require('./logger.js').child({module:'Server'});
const WebSocket = require('ws');
const Outlet = require('./outlet.js');


class Server extends EventEmitter {
	constructor() {
		super();
	}

	listen(port=17273) {
		this.wss = new WebSocket.Server({port, clientTracking: true});
		this.wss.on('connection', (ws, req) => {

			log.debug({addr: req.connection.remoteAddress}, 'New connection');

			let outlet = new Outlet(ws, req);
			outlet.on('ready', function(){
				log.trace({outlet}, 'Outlet is ready!');
				this.emit('connection', outlet);
			})
		});
		this.wss.on('error', function(err){
			log.error({err}, 'Server encountered error!')
		});
		log.info('Server is listening.')
	}

	stop() {
		this.wss.close(() => {
			log.trace('Server has stopped.')
		})
	}

}

module.exports = Server;