#!/usr/bin/env node

var rest = require('restler'),
http = require('http'),
express = require('express'),
app = express(), 
server = http.createServer(app),
io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var numConnections = 0;
var coords = {};
var users = [];

io.sockets.on('connection', function (socket) {
    numConnections++;
    console.log(numConnections);
    socket.on('coordinates', function(data) {
	if (!(socket.id in users))
	    users.push(socket.id);
	coords[socket.id] = data;
	console.log(users);
	console.log(coords);

    });
    socket.on('disconnect', function () {
	numConnections--;
	delete coords[socket.id];
	users.splice(users.indexOf(socket.id), 1);
	console.log(users);
	console.log(coords);
    });
});

function updateUsers() {
    if (numConnections == 2) {
	from = coords[users[0]];
	to = coords[users[1]];
	var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=true&mode=walking";
	rest.get(reqURL).on('complete', function (result) {
	    var map = result;
	    var directions = map.routes[0].legs[0].steps;
	    io.sockets.emit("directions", directions);
	});
    }
}
setInterval(updateUsers, 2000);


