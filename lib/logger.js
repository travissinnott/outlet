'use strict';

const fs = require('fs-extra');
const path = require('path');
const bunyan = require('bunyan');
const bformat = require('bunyan-format');
//const config = require('./config.js');

const LOGDIR = path.resolve(process.cwd(), 'logs');
const LOGPATH = path.resolve(LOGDIR, 'outlet.log.json');


//Initialize Bunyan
const log = bunyan.createLogger({
  name: 'outlet',
  serializers: {err: bunyan.stdSerializers.err}, // bunyan.stdSerializers,
  streams: []
});


try {
  fs.mkdirsSync(path.dirname(LOGPATH));
} catch (err) {
  log.error({err}, 'Could not create log directory!');
}


log.addStream({
  name: 'jsonfile',
  type: 'rotating-file',
  level: 'trace', //config.get("config:log:level"),
  path: LOGPATH,
  period: '1d', //config.get('config:log:period'),
  count: 3 // config.get('config:log:keep')
});


const formatConsole = bformat({ outputMode: 'short' });
//If log flag spacified, pipe Bunyan logs to stdout
//if (config.get('log')) {
  log.addStream({
    name: 'console',
    stream: formatConsole,
    level: 'trace' //(typeof config.get('log') === 'string') ? config.get('log') : config.get("config:log:level")
  })
//}


//TODO: Add file out method for debugging PowerShell and other IO operations
/*
log.file = function(level, filename, data) {
  //If level is >= config:log:level then write data to file under LOGDIR
}
*/

module.exports = log;