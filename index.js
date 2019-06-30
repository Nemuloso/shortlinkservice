const url = require('url');
const uuidv4 = require('uuid/v4');

const express = require("express");
const app = express();

const monk = require("monk");
const db = monk("localhost:27017/shortlinkdb");

app.use(express.static(__dirname + "/styles"));

app.get("/test", function (req, res) {
    res.sendFile(__dirname + "/test.html");
})

app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.get("/shorturl", function (req, res) {
    const db = req.db;
    const collection = db.get("urls");
    
    const shortURLid = uuidv4(); // get Guid based on timestamp
    const urlParts = url.parse(req.url, true);
    const query = urlParts.query;

    const entry = {
        "shorturl": shortURLid,
        "longurl": JSON.stringify(query)
    };

    console.log(entry);

    collection.insert(
        entry,
        function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // res.send({
            //     "shorturl": shortURL
            // });
        }
    });
});

app.post("/longurl", function (req, res) {
    const db = req.db;

    const shortURL = req.body.data;

    const collection = db.get("urls");

    collection.find({ shorturl: shortURL }, {}, function (e, entry) {
        res.send({
            "longurl": entry
        });
    });
});

const server = app.listen(3000, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Listening at http://%s:%s", host, port)
})