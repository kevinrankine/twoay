#!/usr/bin/env node

var rest = require('restler'),
path = require('path'),
http = require('http'),
express = require('express'),
app = express(), 
server = http.createServer(app),
routes = require('./routes'),
io = require('socket.io').listen(server, {log: false });


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'static')));
});

app.get('/', routes.index);
server.listen(8080);

var numConnections = 0;
var coords = {};
var users = [];

io.sockets.on('connection', function (socket) {
    socket.on('coordinates', function(data) {
	if (users.indexOf(socket.id) == -1) {
	    users.push(socket.id);
	}
	coords[socket.id] = data;
	console.log(coords);
    });
    socket.on('disconnect', function () {
	delete coords[socket.id];
	users.splice(users.indexOf(socket.id), 1);
    });
});

function updateUsers() {
    if (users.length == 2) {
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