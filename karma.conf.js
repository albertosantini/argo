"use strict";

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = config => {
    config.set({
        frameworks: ["mocha", "chai"],

        files: [
            "node_modules/hyperhtml/min.js",
            "node_modules/introspected/min.js",
            "build/d3-techan.min.js",
            "node_modules/techan/dist/techan.min.js",

            "build/app.bundle.spec.js"
        ],

        browsers: ["ChromeHeadless"]
    });
};
