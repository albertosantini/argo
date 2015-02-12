"use strict";

var path = require("path"),
    express = require("express");

var app = express(),
    port = 8000,
    pubdir = path.join(__dirname, "/app");

app.use(express.static(pubdir));

app.listen(port, function () {
    console.log("Static folder is %s", pubdir);
    console.log("Listening on http://localhost:" + port);
});
