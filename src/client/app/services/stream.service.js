"use strict";

(function () {
    angular
        .module("argo")
        .factory("streamService", streamService);

    streamService.$inject = ["ngSocket", "quotesService"];
    function streamService(ngSocket, quotesService) {
        var service = {
            prices: {},
            getStream: getStream
        };

        return service;

        function getStream() {
            var ws = ngSocket("ws://localhost:8000/stream");

            ws.onMessage(function (event) {
                var data = JSON.parse(event.data),
                    tick = data.tick;

                if (tick) {
                    quotesService.updateTick(tick);
                }
            });
        }
    }

}());
