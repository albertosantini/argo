"use strict";

module.exports = function (config) {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        /*eslint-disable max-len */
        files: [
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js",
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-animate.min.js",
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-aria.min.js",
            "https://cdn.rawgit.com/angular-ui/ui-router/0.2.15/release/angular-ui-router.min.js",
            "https://cdn.rawgit.com/angular/bower-material/v0.11.2/angular-material.min.js",
            "https://cdn.rawgit.com/angular/ngSocket/master/dist/ngSocket.js",
            "https://cdn.rawgit.com/grevory/angular-local-storage/master/dist/angular-local-storage.min.js",
            "https://cdn.rawgit.com/mbostock/d3/master/d3.min.js",
            "https://cdn.rawgit.com/andredumas/techan.js/master/dist/techan.min.js",

            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-mocks.js",

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
