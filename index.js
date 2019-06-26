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

    const shortURL = generateShortUrl();

    const collection = db.get("urls");

    collection.insert({
        "shorturl": shortURL,
        "longurl": userEmail
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send({
                "shorturl": shortURL
            });
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