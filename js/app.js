/*jshint devel: true, node: true, bitwise: false, camelcase: true, curly: true,
eqeqeq: true, forin: true, freeze: true, immed: true, newcap: true,
noarg: true, noempty: true, nonbsp: false, nonew: true, plusplus: true,
quotmark: single, undef: true, unused: vars, strict: true, trailing: true,
white: true, onevar: true, indent: 2, maxparams: 3, maxdepth: 3, maxlen: 80 */

'use strict';

// Imported modules.

var path = require('path');
var express = require('express');
var compression = require('compression');
var enigmaServer = require('./enigmaServer.js');

// Module scoped variables.

var PORT = 8080;

// Express server app.

var app = express();

// Use compression.

app.use(compression());

// Enigma Machine App.

app.use(enigmaServer.middleware);

// Static content

app.use(express.static(path.join(__dirname, '../static')));

// Start listening.

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
