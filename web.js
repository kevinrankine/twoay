var rest = require('restler');
var express = require('express');
var app = express();

function directions(from, to) {
    var reqURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + from.lat + "," + from.lon+ "&destination=" + to.lat + "," + to.lon + "&sensor=false";

    rest.get(reqURL).on('complete', function(err, data) {
	var map = JSON.parse(data.raw);
	var directions = map.routes[0].legs[0].steps;
	
	var instructions = "";
	for(var i = 0;i < directions.length;i++) {
	    instructions += directions[i].html_instructions + "<br><br>";
	}
	
	res.send(instructions);
    });
}

app.get('/', function(req, res) {
    var from = {"lat" : req.query.from_lat, "lon" : req.query.from_lon};
    var to = {"lat" : req.query.to_lat, "lon" : req.query.to_lon};
    GLOBAL.res = res;
    directions(from, to);
    
});

app.listen(8080);
