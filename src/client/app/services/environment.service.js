"use strict";

(function () {
    angular
        .module("argo")
        .factory("environmentService", environmentService);

    function environmentService() {
        var service = {
            getRequest: getRequest
        };

        return service;

        function getRequest(environment, type, token, url) {
            var endpoints = {
                live: {
                    api: "https://api-fxtrade.oanda.com"
                },
                practice: {
                    api: "https://api-fxpractice.oanda.com"
                }
            };

            return {
                url: endpoints[environment][type] + url,
                "headers": {
                    "Authorization": "Bearer " + token
                }
            };
        }
    }

}());
