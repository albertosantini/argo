import angular from "angular";

export class TradesService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.trades = [];
    }

    getTrades() {
        return this.trades;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/trades", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                this.trades.length = 0;
                angular.extend(this.trades, res.data);
                this.trades.forEach(trade => {
                    trade.side = trade.currentUnits > 0 ? "buy" : "sell";
                });
            });
        });
    }

    closeTrade(id) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/closetrade", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                id
            }).then(order => order.data)
            .catch(err => err.data)
        );
    }

    updateTrades(tick) {
        const account = this.AccountsService.getAccount(),
            pips = account.pips;

        this.trades.forEach((trade, index) => {
            let current,
                side;

            if (trade.instrument === tick.instrument) {
                side = trade.currentUnits > 0 ? "buy" : "sell";

                if (side === "buy") {
                    current = tick.bid;
                    this.trades[index].profitPips =
                        ((current - trade.price) / pips[trade.instrument]);
                }
                if (side === "sell") {
                    current = tick.ask;
                    this.trades[index].profitPips =
                        ((trade.price - current) / pips[trade.instrument]);
                }

                this.trades[index].current = current;
            }
        });
    }
}
TradesService.$inject = ["$http", "SessionService", "AccountsService"];
