"use strict";

{
    angular
        .module("components.streaming")
        .factory("streamingService", streamingService);

    streamingService.$inject = ["$timeout", "$http", "toastService",
        "quotesService", "activityService", "tradesService",
        "ordersService", "accountsService", "pluginsService"];
    function streamingService($timeout, $http, toastService,
            quotesService, activityService, tradesService,
            ordersService, accountsService, pluginsService) {
        const service = {
            startStream
        };

        return service;

        function startStream(data) {
            $http.post("/api/startstream", {
                environment: data.environment,
                accessToken: data.accessToken,
                accountId: data.accountId,
                instruments: data.instruments
            }).then(() => {
                getStream();
            }).catch(err => {
                toastService.show(err);
            });
        }

        function getStream() {
            const ws = new WebSocket("ws://localhost:8000/stream");

            ws.onmessage = event => {
                let data,
                    isTick,
                    tick,
                    isTransaction,
                    transaction,
                    refreshPlugins;

                $timeout(() => {
                    try {
                        data = angular.fromJson(event.data);

                        isTick = data.closeoutAsk && data.closeoutBid;
                        isTransaction = data.accountID;
                        refreshPlugins = data.refreshPlugins;

                        if (isTick) {
                            tick = {
                                time: data.time,
                                instrument: data.instrument,
                                ask: data.closeoutAsk,
                                bid: data.closeoutBid
                            };

                            quotesService.updateTick(tick);
                            tradesService.updateTrades(tick);
                            ordersService.updateOrders(tick);
                        }

                        if (isTransaction) {
                            transaction = data;
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
                        // console.log(e.name + ": " + e.message);
                    }
                });
            };
        }
    }

}
