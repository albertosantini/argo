"use strict";

module.exports = config => {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        files: [
            "node_modules/hyperhtml/min.js",
            "node_modules/introspected/min.js",
            "build/d3-techan.min.js",
            "node_modules/techan/dist/techan.min.js",

            "build/app.bundle.spec.js"
        ],

        exclude: [
        ],

        reporters: ["dots"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        customLaunchers: {
            ChromeTravisCI: {
                base: "ChromeHeadless"
            }
        },
        browsers: process.env.TRAVIS ? ["ChromeTravisCI"] : ["Chrome"],

        autoWatch: true,

        captureTimeout: 60000,

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, // default 10000

        singleRun: false
    });
};
