"use strict";

(function () {
    angular
        .module("argo")
        .factory("streamService", streamService);

    streamService.$inject = ["$http", "$timeout", "ngSocket",
                        "quotesService", "activityService",
                        "tradesService", "ordersService", "accountsService",
                        "pluginsService"];
    function streamService($http, $timeout, ngSocket,
                        quotesService, activityService,
                        tradesService, ordersService, accountsService,
                        pluginsService) {
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
            var ws = ngSocket("ws://localhost:8000/stream");

            ws.onMessage(function (event) {
                var data,
                    tick,
                    transaction,
                    refreshPlugins;

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

                        $timeout(function () {
                            tradesService.refresh();
                            $timeout(function () {
                                ordersService.refresh();
                                $timeout(function () {
                                    accountsService.refresh();
                                }, 600);
                            }, 400);
                        }, 200);
                    }

                    if (refreshPlugins) {
                        pluginsService.refresh();
                    }
                /*eslint-disable no-empty */
                } catch (e) {
                    // Discard "incomplete" json
                }
                /*eslint-enable no-empty */
            });
        }
    }

}());
