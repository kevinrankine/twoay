var socket = io.connect("http://kevinrankine.com:8080/");
updateLocation();
var j = 0;
socket.on("directions", function(data) {
    document.body.innerHTML = "";
    var content = "";
    for(var i = 0;i < data.length;i++) {
	content += data[i].html_instructions + "<br><br>";
    }
    document.body.innerHTML = content + j;
    j++;
    updateLocation();
});
function updateLocation() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        socket.emit("coordinates", {"lat" : lat, "lon" : lon});
    });
}