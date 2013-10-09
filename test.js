var express = require('express'), 
app = express();
var sleep = function(t) {
    var initial = new Date();
    while(new Date() - initial < t) {

    }
};
app.get("/:a", function(req, res) {
    console.log("Request received!");
    res.send("Tell ya bish");
});

app.listen(8080);
