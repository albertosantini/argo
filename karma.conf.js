"use strict";

module.exports = function (config) {
    config.set({

        basePath: "",

        frameworks: ["mocha", "chai"],

        /*eslint-disable max-len */
        files: [
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js",
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.min.js",
            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-aria.min.js",
            "https://cdn.rawgit.com/angular-ui/ui-router/0.2.15/release/angular-ui-router.min.js",
            "https://cdn.rawgit.com/angular/bower-material/v0.10.1-rc1/angular-material.min.js",
            "https://cdn.rawgit.com/angular/ngSocket/master/dist/ngSocket.js",
            "https://cdn.rawgit.com/grevory/angular-local-storage/master/dist/angular-local-storage.min.js",
            "https://cdn.rawgit.com/mbostock/d3/master/d3.min.js",
            "https://cdn.rawgit.com/andredumas/techan.js/master/dist/techan.min.js",

            "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-mocks.js",

            "src/client/app/app.module.js",
            "src/client/app/app.routes.js",
            "src/client/app/services/session.service.js",
            "src/client/app/account/accounts.service.js",
            "src/client/app/quotes/quotes.service.js",
            "src/client/app/trades/trades.service.js",
            "src/client/app/orders/orders.service.js",
            "src/client/app/positions/positions.service.js",
            "src/client/app/exposure/exposure.js",
            "src/client/app/activity/activity.service.js",

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

        singleRun: false
  });
};
