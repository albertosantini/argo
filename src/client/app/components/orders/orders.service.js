import angular from "angular";

export class OrdersService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.orders = [];
    }

    getOrders() {
        return this.orders;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/orders", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                this.orders.length = 0;
                angular.extend(this.orders, res.data);
            });
        });
    }

    putOrder(order) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/order", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                instrument: order.instrument,
                units: order.units,
                side: order.side,
                type: order.type,
                expiry: order.expiry,
                price: order.price,
                priceBound: order.lowerBound || order.upperBound,
                stopLossOnFill: order.stopLossOnFill,
                takeProfitOnFill: order.takeProfitOnFill,
                trailingStopLossOnFill: order.trailingStopLossOnFill
            }).then(trade => trade.data)
                .catch(err => err.data)
        );
    }

    closeOrder(id) {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/closeorder", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                id
            }).then(order => order.data)
                .catch(err => err.data)
        );
    }

    updateOrders(tick) {
        const account = this.AccountsService.getAccount(),
            pips = account.pips;

        this.orders.forEach((order, index) => {
            let current;

            if (order.instrument === tick.instrument) {

                if (order.units > 0) {
                    current = tick.ask;
                }
                if (order.units < 0) {
                    current = tick.bid;
                }

                this.orders[index].current = current;
                this.orders[index].distance = (Math.abs(current - order.price) /
                    pips[order.instrument]);
            }
        });
    }
}
OrdersService.$inject = ["$http", "SessionService", "AccountsService"];
