#!/usr/bin/env node

var rest = require('restler');
var express = require('express');
var app = express();

function directions(from, to, res) {
    var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=false";
    rest.get(reqURL).on('complete', sendData(res));
}

function sendData(to) {
    return function(err, data) {
	var map = JSON.parse(data.raw);
	var directions = map.routes[0].legs[0].steps;
	
	var instructions = "";
	for(var i = 0;i < directions.length;i++) {
            instructions += directions[i].html_instructions + "<br><br>";
	}
	
	to.send(instructions);
	to.end();
	console.log("Response ended");
	return;
    };
}

app.get('/', function(req, res) {
    console.log("Request received!");
    var from = {"lat" : req.query.from_lat, "lon" : req.query.from_lon};
    var to = {"lat" : req.query.to_lat, "lon" : req.query.to_lon};
    directions(from, to, res);
});

app.listen(8080);
