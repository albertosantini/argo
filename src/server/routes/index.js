"use strict";

var router = require("express").Router();

module.exports = router;

router.get("/test", getTest);

function getTest(req, res) {
    var data = {
        test: "foo"
    };

    res.json(data);
}
