"use strict";

(function () {
    angular
        .module("argo")
        .factory("quotesService", quotesService);

    quotesService.$inject = [];
    function quotesService() {
        var service = {
            quotes: {},
            updateTick: updateTick
        };

        return service;

        function updateTick(tick) {
            var instrument = tick.instrument;

            service.quotes[instrument] = {
                time: tick.time,
                ask: tick.ask,
                bid: tick.bid
            };
        }
    }

}());
