const url = require('url');
const uuidv4 = require('uuid/v4');

const express = require("express");
const app = express();

const dockerIp = "192.168.99.100";
const mongoPort = "27017";
const dbName = "shortlinkdb";

const monk = require("monk");
const db = monk(dockerIp+":"+mongoPort+"/"+dbName);

db.then(() => {
    console.log('Connected correctly to server')
});

app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use(express.static(__dirname + "/styles"));

app.get("/test", function (req, res) {
    res.sendFile(__dirname + "/test.html");
})

/* Test db connection... Should respond {"testentry":"testvalue"} */
app.get('/testdb', function (req, res) {
    var db = req.db;
    var collection = db.get('urls');
    collection.find({}, {}, function (e, docs) {
        console.log(docs)
        res.send(JSON.stringify(docs));
    });
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

    collection.insert(
        entry,
        function (err, doc) {
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