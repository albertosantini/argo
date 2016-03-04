"use strict";

module.exports = function (config) {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        /*eslint-disable max-len */
        files: [
            "node_modules/angular/angular.min.js",
            "node_modules/angular-animate/angular-animate.min.js",
            "node_modules/angular-aria/angular-aria.min.js",
            "node_modules/angular-ui-router/release/angular-ui-router.min.js",
            "node_modules/angular-material/angular-material.min.js",
            "node_modules/angular-local-storage/dist/angular-local-storage.min.js",
            "node_modules/d3/d3.min.js",
            "node_modules/techan/dist/techan.min.js",

            "node_modules/angular-mocks/angular-mocks.js",

            "src/client/app/app.module.js",
            "src/client/app/**/*.js",

            "src/client/test/**/*.spec.js"
        ],
        /*eslint-enable max-len */

        exclude: [
        ],

        reporters: ["dots"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        browsers: ["PhantomJS"],

        autoWatch: true,

        captureTimeout: 60000,
        // to avoid DISCONNECTED messages
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 60000, //default 10000

        singleRun: false
    });
};
