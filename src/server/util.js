"use strict";

exports.log = log;
exports.request = request;

function log(...args) {
    console.log(new Date().toTimeString(), ...args); /* eslint no-console:off */
}

const urlParse = require("url").parse;
const https = require("https");
const querystring = require("querystring");

function request({
    url = "",
    method = "GET",
    headers = {},
    body = null,
    qs = {}
} = {}, callback) {
    const reqUrl = urlParse(url);
    const host = reqUrl.hostname;
    const port = reqUrl.port || 443;

    let path = reqUrl.path;

    if (method === "GET") {
        path += `?${querystring.stringify(qs)}`;
    }

    if (body) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = JSON.stringify(body).length;
    }

    const requestOptions = {
        host,
        port,
        path,
        method,
        headers
    };

    function requestResponse(res) {
        res.setEncoding("utf8");

        let rawData = "";

        res.on("data", chunk => {
            rawData += chunk;
        });

        res.on("end", () => callback(null, res, rawData));
    }

    const req = https.request(requestOptions, requestResponse);

    req.on("error", err => callback(err));

    if (body) {
        req.write(JSON.stringify(body));
    }

    req.end();
}
