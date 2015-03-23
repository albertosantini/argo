"use strict";

(function () {
    angular
        .module("argo")
        .factory("streamService", streamService);

    streamService.$inject = ["ngSocket", "quotesService", "activityService",
                        "tradesService", "ordersService", "accountsService",
                        "$timeout"];
    function streamService(ngSocket, quotesService, activityService,
                        tradesService, ordersService, accountsService,
                        $timeout) {
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
                        tradesService.updateTrades(tick);
                        ordersService.updateOrders(tick);
                    }
                    if (transaction) {
                        activityService.addActivity(transaction);

                        $timeout(function () {
                            tradesService.refresh();
                            $timeout(function () {
                                ordersService.refresh();
                                $timeout(function () {
                                    accountsService.refresh();
                                }, 100);
                            }, 100);
                        }, 100);
                    }
                } catch (e) {
                    // Discard "incomplete" json
                }
            });
        }
    }

}());
