"use strict";

(function () {
    angular
        .module("argo")
        .config(config)
        .run(setup);

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("index", {
                abstract: true,
                url: "/",
                views: {
                    "default": {
                        templateUrl: "views/default.html",
                        controller: "DefaultCtrl",
                        controllerAs: "default"
                    }
                }
            })
            .state("index.subs", {
                url: "",
                views: {
                    "account@index": {
                        templateUrl: "views/account.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/");
    }

    setup.$inject = ["$state"];
    function setup($state) {
        $state.transitionTo("index.subs");
    }

}());
