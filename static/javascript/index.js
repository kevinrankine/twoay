var socket = io.connect("http://kevinrankine.com:8080/");

$(document).ready(function() {
    $("input[type=submit]").click(sendRequest);
});

function sendRequest() {
    var requestingUser = $("input[name=requestingUser]").val();
    var requestedUser = $("input[name=requestedUser]").val();
    navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        socket.emit("directionsRequested", {"coordinates" : {"lat" : lat, 
							     "lon" : lon}, 
				    "requestingUser" : requestingUser, 
				    "requestedUser" : requestedUser
					   });
    });
}
/* 
   Requests directions to the user specified by the value of the text field.
   The function is fired off when the submit button is pressed.   
*/

socket.on("directions", function (directions) {
    document.body.innerHTML = "";
    var content = "";
    for(var i = 0;i < directions.length;i++) {
	content += directions[i].html_instructions + "<br><br>";
    }
    document.body.innerHTML = content;
    j++;
    updateLocation();
});
