"use strict";

(function () {
    angular
        .module("argo")
        .factory("pricesService", pricesService);

    pricesService.$inject = ["ngSocket"];
    function pricesService(ngSocket) {
        var service = {
            prices: {},
            getPricesStream: getPricesStream
        };

        return service;

        function getPricesStream() {
            var ws = ngSocket("ws://localhost:8000/stream");

            ws.onMessage(function (event) {
                console.log(event);
            });

            console.log("Initialized prices streaming");
            ws.send("go");
        }
    }

}());
