"use strict";

(function () {
    angular
        .module("argo")
        .factory("streamService", streamService);

    streamService.$inject = ["$timeout", "$http",
                        "quotesService", "activityService", "tradesService",
                        "ordersService", "accountsService", "pluginsService"];
    function streamService($timeout, $http,
            quotesService, activityService, tradesService,
            ordersService, accountsService, pluginsService) {
        var service = {
            startStream: startStream
        };

        return service;

        function startStream(data) {
            $http.post("/api/startstream", {
                environment: data.environment,
                accessToken: data.accessToken,
                accountId: data.accountId,
                instruments: data.instruments
            }).success(function () {
                getStream();
            });
        }

        function getStream() {
            var ws = new WebSocket("ws://localhost:8000/stream");

            ws.onmessage = function (event) {
                var data,
                    tick,
                    transaction,
                    refreshPlugins;

                $timeout(function () {
                    try {
                        data = angular.fromJson(event.data);

                        tick = data.tick;
                        transaction = data.transaction;
                        refreshPlugins = data.refreshPlugins;

                        if (tick) {
                            quotesService.updateTick(tick);
                            tradesService.updateTrades(tick);
                            ordersService.updateOrders(tick);
                        }

                        if (transaction) {
                            activityService.addActivity(transaction);

                            tradesService.refresh();
                            ordersService.refresh();
                            accountsService.refresh();
                        }

                        if (refreshPlugins) {
                            pluginsService.refresh();
                        }
                    } catch (e) {
                        // Discard "incomplete" json
                        console.log(e.name + ": " + e.message);
                    }
                });
            };
        }
    }

}());
