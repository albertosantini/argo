"use strict";

module.exports = config => {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        files: [
            "node_modules/angular/angular.min.js",
            "build/d3-techan.min.js",
            "node_modules/techan/dist/techan.min.js",

            "node_modules/angular-mocks/angular-mocks.js",

            "build/app.bundle.js",
            "src/client/app/**/*.spec.js"
        ],

        exclude: [
        ],

        reporters: ["dots"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        customLaunchers: {
            Chrome_travis_ci: {
                base: "ChromeHeadless"
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
