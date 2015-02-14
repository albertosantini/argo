"use strict";

var express = require("express");

var app = express(),
    port = process.env.PORT || 8000,
    staticFiles = express.static;

app.use(staticFiles("./src/client/"));

app.get("/ping", function(req, res) {
    res.send("pong");
});

app.listen(port, function () {
    console.log("Argo listening on http://localhost:" + port);
});
