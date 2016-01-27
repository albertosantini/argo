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
                template: "<default></default>"
            })
            .state("default.subs", {
                views: {
                    "header": {
                        template: "<header></header>"
                    },
                    "trades": {
                        template: "<trades></trades>"
                    },
                    "orders": {
                        template: "<orders></orders>"
                    },
                    "positions": {
                        template: "<positions></positions>"
                    },
                    "exposure": {
                        template: "<exposure></exposure>"
                    },
                    "activity": {
                        template: "<activity></activity>"
                    },
                    "news": {
                        template: "<news></news>"
                    },
                    "plugins": {
                        template: "<plugins></plugins>"
                    },
                    "account": {
                        template: "<account></account>"
                    },
                    "quotes": {
                        template: "<quotes></quotes>"
                    },
                    "charts": {
                        template: "<charts></charts>"
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
