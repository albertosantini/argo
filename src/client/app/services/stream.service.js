"use strict";

(function () {
    angular
        .module("argo")
        .factory("streamService", streamService);

    streamService.$inject = ["ngSocket", "quotesService", "activityService"];
    function streamService(ngSocket, quotesService, activityService) {
        var service = {
            getStream: getStream
        };

        return service;

        function getStream() {
            var ws = ngSocket("ws://localhost:8000/stream");

            ws.onMessage(function (event) {
                var data,
                    tick,
                    transaction;

                try {
                    data = angular.fromJson(event.data);
                    tick = data.tick;
                    transaction = data.transaction;
                    if (tick) {
                        quotesService.updateTick(tick);
                    }
                    if (transaction) {
                        activityService.addActivity(transaction);
                    }
                } catch (e) {
                    // Discard "incomplete" json
                }
            });
        }
    }

}());
