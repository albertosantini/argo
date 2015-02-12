"use strict";

(function () {
    angular
        .module("argo")
        .config(config);

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("index", {
                url: "/",
                views: {
                    "default": {
                        templateUrl: "views/default.html",
                        controller: "DefaultCtrl",
                        controllerAs: "default"
                    },
                    "account@index": {
                        templateUrl: "views/account.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/");
    }
}());
