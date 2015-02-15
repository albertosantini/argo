"use strict";

(function () {
    angular
        .module("argo")
        .factory("environmentService", environmentService);

    function environmentService() {
        return {
            getRequest: function(environment, token, type, url) {
                var endpoints = {
                    live: {
                        stream: "https://stream-fxtrade.oanda.com",
                        api: "https://api-fxtrade.oanda.com"
                    },
                    practice: {
                        stream: "http://stream-fxpractice.oanda.com",
                        api: "https://api-fxpractice.oanda.com"
                    },
                    sandbox: {
                        stream: "http://stream-sandbox.oanda.com",
                        api: "https://api-sandbox.oanda.com"
                    }
                };

                return {
                    url: endpoints[environment][type] + url,
                    "headers": {
                        "Authorization": "Bearer " + token
                    }
                };
            }
        };
    }

}());
