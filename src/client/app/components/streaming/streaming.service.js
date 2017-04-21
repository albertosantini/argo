import angular from "angular";

export class StreamingService {
    constructor($timeout, $http, ToastsService,
        QuotesService, ActivityService, TradesService,
        OrdersService, AccountsService, PluginsService) {

        this.$timeout = $timeout;
        this.$http = $http;
        this.ToastsService = ToastsService;
        this.QuotesService = QuotesService;
        this.ActivityService = ActivityService;
        this.TradesService = TradesService;
        this.OrdersService = OrdersService;
        this.AccountsService = AccountsService;
        this.PluginsService = PluginsService;
    }

    startStream(data) {
        this.$http.post("/api/startstream", {
            environment: data.environment,
            accessToken: data.accessToken,
            accountId: data.accountId,
            instruments: data.instruments
        }).then(() => {
            this.getStream();
        }).catch(err => {
            this.ToastsService.addToast(err);
        });
    }

    getStream() {
        const ws = new WebSocket("ws://localhost:8000/stream");

        ws.onmessage = event => {
            let data,
                isTick,
                tick,
                isTransaction,
                transaction,
                refreshPlugins;

            this.$timeout(() => {
                try {
                    data = angular.fromJson(event.data);

                    isTick = data.closeoutAsk && data.closeoutBid;
                    isTransaction = data.accountID;
                    refreshPlugins = data.refreshPlugins;

                    if (isTick) {
                        tick = {
                            time: data.time,
                            instrument: data.instrument,
                            ask: data.asks[0] && data.asks[0].price ||
                                data.closeoutAsk,
                            bid: data.bids[0] && data.bids[0].price ||
                                data.closeoutBid
                        };

                        this.QuotesService.updateTick(tick);
                        this.TradesService.updateTrades(tick);
                        this.OrdersService.updateOrders(tick);
                    }

                    if (isTransaction) {
                        transaction = data;
                        this.ActivityService.addActivity(transaction);

                        this.TradesService.refresh();
                        this.OrdersService.refresh();
                        this.AccountsService.refresh();
                    }

                    if (refreshPlugins) {
                        this.PluginsService.refresh();
                    }
                } catch (e) {

                    // Discard "incomplete" json
                    // console.log(e.name + ": " + e.message);
                }
            });
        };
    }
}
StreamingService.$inject = [
    "$timeout", "$http", "ToastsService",
    "QuotesService", "ActivityService", "TradesService",
    "OrdersService", "AccountsService", "PluginsService"
];
