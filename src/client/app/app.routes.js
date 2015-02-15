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
                templateUrl: "app/layout/default.html",
                controller: "Default",
                controllerAs: "default"
            })
            .state("default.subs", {
                views: {
                    "header": {
                        templateUrl: "app/layout/header.html"
                    },
                    "trades": {
                        templateUrl: "app/trades/trades.html"
                    },
                    "orders": {
                        templateUrl: "app/orders/orders.html"
                    },
                    "positions": {
                        templateUrl: "app/positions/positions.html"
                    },
                    "exposure": {
                        templateUrl: "app/exposure/exposure.html"
                    },
                    "activity": {
                        templateUrl: "app/activity/activity.html"
                    },
                    "news": {
                        templateUrl: "app/news/news.html"
                    },
                    "account": {
                        templateUrl: "app/account/account.html",
                        controller: "Account",
                        controllerAs: "ctrl"
                    },
                    "quotes": {
                        templateUrl: "app/quotes/quotes.html"
                    },
                    "charts": {
                        templateUrl: "app/charts/charts.html"
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
