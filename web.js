#!/usr/bin/env node

var http = require('http');
var rest = require('restler');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

/*app.get('/', function (req, res) {
    console.log("Request received!");
    var from = {"lat" : req.query.from_lat, "lon" : req.query.from_lon};
    var to = {"lat" : req.query.to_lat, "lon" : req.query.to_lon};
    
    var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=false";
    var instructions = "";
    res.writeHead(200, {'Content-Type' : 'text/html'});
    rest.get(reqURL).on('complete', function (result) {
	console.log(result);
	var map = result;
	var directions = map.routes[0].legs[0].steps;
	
	for(var i = 0;i < directions.length;i++) {
	    instructions += directions[i].html_instructions + "<br><br>";
	}
	res.write(instructions);
	res.end();
	console.log(res.headersSent);
    });
}); */

app.get('/socket', function (req, res) {
    res.sendfile('index.html');
});

io.sockets.on('connection', function (socket) {
    socket.emit("hello", {});
    socket.on('hello', function(data) {
	socket.emit("hello", {});
    });
});

server.listen(8080);
