'use strict';


const log = require('./lib/logger.js');
const Server = require('./lib/server.js');
const server = new Server();

server.listen();


server.on('connection', function(outlet){
	log.info('Outlet connected.');

	outlet.on('change', function() {
		log.info({outlet}, 'Outlet changed!')
	});

	setTimeout(function() {
		outlet.switch();
	}, 3000);

	setTimeout(function() {
		outlet.switch();
	}, 3000);
})

