#!/usr/bin/env node

var rest = require('restler'),
path = require('path'),
http = require('http'),
express = require('express'),
app = express(), 
server = http.createServer(app),
routes = require('./routes'),
io = require('socket.io').listen(server, {log : false});


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'static')));
});

app.get('/', routes.index);
server.listen(8080);

var numConnections = 0;
var users = [];
var coords = {};

io.sockets.on('connection', function (socket) {
    var requestingUser;
    var requestedUser;
    var newCoordinates;
    socket.on('directionsRequested', function(data) {
	requestingUser = data.requestingUser;
	requestedUser = data.requestedUser;
	newCoordinates = data.coordinates;
	console.log(requestingUser + " wants to know where " + requestedUser + " is. :)");
	
	if (users.indexOf(requestingUser) == -1) {
	    users.push(requestingUser);
	    setInterval(updateUser, 3000, socket, requestingUser, requestedUser);
	}
	coords[requestingUser] = newCoordinates;
    });
    socket.on('disconnect', function () {
	delete coords[requestingUser];
	users.splice(users.indexOf(requestingUser), 1);
    });
});

function updateUser(socket, requestingUser, requestedUser) {
    from = coords[requestingUser];
    to = coords[requestedUser];
    if (from == undefined) {
	clearInterval(this);
	return;
    }
    if (to == undefined) {
	console.log("Looks like we ain't sending out shit this round to " + requestingUser);
	return
    }

    var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=true&mode=walking";
    rest.get(reqURL).on('complete', function (result) {
	var map = result;
	var directions = map.routes[0].legs[0].steps;
	socket.emit("directions", directions);
	console.log("We sent out directions from " + requestingUser + " to " + requestedUser);
    });
}
