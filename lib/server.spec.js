'use strict';

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
const _ = require('lodash');

const Server = require('./server.js');
const server = new Server();
const WebSocket = require('ws');
const TESTPORT = 17777;
const URL = `ws://localhost:${TESTPORT}/gnws`;

const SAMPLE_LOGIN_REQUEST={
	account:"1234567",
	id:"443c878f-f675-4c90-98e8-2f4566914d39",
	deviceName:"vesync_wifi_outlet",
	deviceVersion:"1.5",
	deviceVersionCode:5,
	type:"wifi-switch",
	apptype:"switch-measure",
	firmName:"cosytek_firm_a",
	firmVersion:"1.89",
	firmVersionCode:89,
	key:0,
	relay:"open"
};

const SAMPLE_LOGIN_RESPONSE={
	"uri":"/loginReply",
	"error":0,
	"wd":3,
	"year":2017,
	"month":11,
	"day":1,
	"ms":62125134,
	"hh":0,
	"hl":0,
	"lh":0,
	"ll":0
};

describe('Server', function(){
	let client;

	before(function(){
		server.listen(TESTPORT);
		server.on()
	});

	after(function(){
		server.stop();
	})

	describe('Initial Handshake', function(){
		it('should be connectable', function(done){	
			client = new WebSocket(URL);
			client.on('open', function(){
				done();
			})
			client.on('error', function(err){
				console.log(err);
			})
		});

		it('should take a signon message and reply with loginreply', function(done){
			function responseHandler(event){
				//event is an EventTarget object
				let data = JSON.parse(event.data);

				//data = JSON.parse(data);
				expect(data).to.have.keys(SAMPLE_LOGIN_RESPONSE)
				expect(data).to.have.property('uri', '/loginReply');
				expect(data).to.have.property('error', 0);
				client.removeEventListener('message', responseHandler);
				done();
			}

			client.addEventListener('message', responseHandler);

			client.send(JSON.stringify(SAMPLE_LOGIN_REQUEST));
		});
	});

	describe('Switch ON command', function() {
		it('should send the relay break message and get a runtimeInfo reply', function(done){
			server.
		});
	});

	describe('Switch OFF command', function(){
		it('should send the replay open message and get a runtimeInfo reply');
	})
})
