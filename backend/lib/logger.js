/*jshint multistr: true, node: true, esversion: 6, undef: true, unused: true, varstmt: true*/
"use strict";

const winston                 = require('winston');

const logger                  = winston.createLogger({
  level:                      'info',
  format:                     winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logger.log' })
  ]
});

module.exports = logger;