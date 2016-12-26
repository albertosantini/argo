"use strict";

module.exports = config => {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        files: [
            "node_modules/angular/angular.js",

            "node_modules/angular-mocks/angular-mocks.js",

            "src/client/app/**/*.module.js",
            "src/client/app/**/*.js"
        ],

        exclude: [
        ],

        reporters: ["dots"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        customLaunchers: {
            Chrome_travis_ci: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        },
        browsers: process.env.TRAVIS ? ["Chrome_travis_ci"] : ["Chrome"],

        autoWatch: true,

        captureTimeout: 60000,

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, // default 10000

        singleRun: false
    });
};
