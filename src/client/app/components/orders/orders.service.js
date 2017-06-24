import { Util } from "../../util";
import { SessionService } from "../session/session.service";
import { AccountsService } from "../account/accounts.service";

export class OrdersService {
    constructor(orders) {
        if (!OrdersService.orders) {
            OrdersService.orders = orders;
        }
    }


    static getOrders() {
        return OrdersService.orders;
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/orders", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            })
        }).then(res => res.json()).then(data => {
            OrdersService.orders.splice(0, OrdersService.orders.length);

            data.forEach(trade => {
                OrdersService.orders.push(trade);
            });

            return OrdersService.orders;
        });
    }

    static putOrder(order) {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/order", {
            method: "post",
            body: JSON.stringify({
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
            })
        }).then(res => res.json()).then(data => data)
            .catch(err => err.data);
    }

    static closeOrder(id) {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/closeorder", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                id
            })
        }).then(res => res.json()).then(data => data)
            .catch(err => err.data);
    }

    static updateOrders(tick) {
        const account = AccountsService.getAccount(),
            pips = account.pips;

        OrdersService.orders.forEach((order, index) => {
            let current;

            if (order.instrument === tick.instrument) {

                if (order.units > 0) {
                    current = tick.ask;
                }
                if (order.units < 0) {
                    current = tick.bid;
                }

                OrdersService.orders[index].current = current;
                OrdersService.orders[index].distance = (Math.abs(current - order.price) /
                    pips[order.instrument]);
            }
        });
    }
}

OrdersService.orders = null;
