"use strict";

(function () {
    angular
        .module("argo")
        .config(config)
        .run(setup);

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("default", {
                abstract: true,
                url: "/",
                templateUrl: "views/default.html",
                controller: "DefaultCtrl",
                controllerAs: "default"
            })
            .state("default.subs", {
                views: {
                    "header": {
                        templateUrl: "views/header.html"
                    },
                    "trades": {
                        templateUrl: "views/trades.html"
                    },
                    "orders": {
                        templateUrl: "views/orders.html"
                    },
                    "positions": {
                        templateUrl: "views/positions.html"
                    },
                    "exposure": {
                        templateUrl: "views/exposure.html"
                    },
                    "activity": {
                        templateUrl: "views/activity.html"
                    },
                    "news": {
                        templateUrl: "views/news.html"
                    },
                    "account": {
                        templateUrl: "views/account.html"
                    },
                    "quotes": {
                        templateUrl: "views/quotes.html"
                    },
                    "charts": {
                        templateUrl: "views/charts.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/");
    }

    setup.$inject = ["$state"];
    function setup($state) {
        $state.transitionTo("default.subs");
    }

}());
