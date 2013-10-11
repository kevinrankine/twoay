#!/usr/bin/env node

var rest = require('restler'),
express = require('express'),
app = express(), 
server = http.createServer(app),
io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var numConnections = 0;
var coords = [];
io.sockets.on('connection', function (socket) {
    numConnections++;
    console.log(coords);
    console.log(numConnections);
    socket.on('coordinates', function(data) {
	coords.push(data);

    });
    socket.on('disconnect', function () {
	numConnections--;
	coords = [];
    });
});


function updateUsers() {
    if (numConnections == 2) {
	from = coords[1];
	to = coords[0];
	var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=false";
	rest.get(reqURL).on('complete', function (result) {
	    var map = result;
	    var directions = map.routes[0].legs[0].steps;
	    io.sockets.emit("directions", directions);
	});
    }
}

setInterval(updateUsers, 2000);


