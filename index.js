const express = require("express");
const app = express();

app.use(express.static( __dirname + "/styles" ));

app.get('/test', function (req, res) {
    res.sendFile( __dirname + "/test.html" );
 })

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })