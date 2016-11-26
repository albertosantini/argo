"use strict";

(function () {
    var app = {
        templateUrl: "app/common/app.html",
        controller: "AppController"
    };

    angular
        .module("common")
        .component("app", app);
}());
