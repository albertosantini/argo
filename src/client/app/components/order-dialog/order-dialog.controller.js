import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service";
import { OrdersService } from "../orders/orders.service";
import { QuotesService } from "../quotes/quotes.service";
import { ToastsService } from "../toasts/toasts.service";
import { Util } from "../../util";

export class OrderDialogController {
    constructor(render, template, bindings) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected.observe(bindings,
            state => template.update(render, state, events));

        const account = AccountsService.getAccount();

        this.pips = account.pips;

        this.onMarketChange(null, this.state.selectedInstrument);
    }

    onMarketChange(e, instrument) {
        if (!this.pips) {
            return;
        }

        this.state.selectedInstrument = instrument;

        const price = QuotesService.getQuotes()[instrument],
            fixed = ((this.pips[this.state.selectedInstrument].toString())
                .match(/0/g) || []).length;

        this.state.measure = "price";
        this.state.step = parseFloat(this.pips[this.state.selectedInstrument]);
        if (this.state.orderInfo.side === "buy") {
            this.state.quote = parseFloat(price && price.ask);
            this.takeProfit = parseFloat((this.state.quote + this.state.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.state.quote - this.state.step * 10)
                .toFixed(fixed));
        } else {
            this.state.quote = parseFloat(price && price.bid);
            this.takeProfit = parseFloat((this.state.quote - this.state.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.state.quote + this.state.step * 10)
                .toFixed(fixed));
        }
        this.lowerBound = parseFloat((this.state.quote - this.state.step).toFixed(fixed));
        this.upperBound = parseFloat((this.state.quote + this.state.step).toFixed(fixed));
        this.trailingStop = 25;
    }

    changeMeasure(measure) {
        if (measure === "price") {
            this.onMarketChange(null, this.state.selectedInstrument);
        } else {
            this.lowerBound = 1;
            this.upperBound = 1;
            this.takeProfit = 10;
            this.stopLoss = 10;
            this.trailingStop = 25;
            this.state.step = 1;
        }
    }

    onOrderSubmitClick() {
        this.state.orderModalIsOpen = false;

        if (!this.pips) {
            ToastsService.addToast(`Pips info for ${this.state.selectedInstrument} not yet available. Retry.`);

            return;
        }

        const order = {},
            isBuy = this.state.orderInfo.side === "buy",
            isMeasurePips = this.state.measure === "pips";

        this.state.orderInfo.step = parseFloat(this.pips[this.state.selectedInstrument]);

        order.instrument = this.state.selectedInstrument;
        order.units = this.state.orderInfo.units;
        if (this.state.orderInfo.units && !isBuy) {
            order.units = `-${order.units}`;
        }

        order.side = this.state.orderInfo.side;
        order.type = this.state.orderInfo.type;

        if (order.type === "LIMIT") {
            order.price = this.state.orderInfo.quote && this.state.orderInfo.quote.toString();
            order.gtdTime = new Date(Date.now() + this.state.orderInfo.selectedExpire);
        }

        if (isMeasurePips) {
            if (this.state.orderInfo.isLowerBound) {
                order.priceBound =
                    parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.lowerBound)
                        .toString()).toString();
            }
            if (this.state.orderInfo.isUpperBound) {
                order.priceBound =
                    parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.upperBound)
                        .toString()).toString();
            }
            if (isBuy) {
                if (this.state.orderInfo.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.takeProfit)
                            .toString()).toString();
                }
                if (this.state.orderInfo.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.stopLoss)
                            .toString()).toString();
                }
            } else {
                if (this.state.orderInfo.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat((this.state.orderInfo.quote - this.state.orderInfo.step * this.takeProfit)
                            .toString()).toString();
                }
                if (this.state.orderInfo.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat((this.state.orderInfo.quote + this.state.orderInfo.step * this.stopLoss)
                            .toString()).toString();
                }
            }
        } else {
            if (this.state.orderInfo.isLowerBound) {
                order.priceBound = this.lowerBound.toString();
            }
            if (this.state.orderInfo.isUpperBound) {
                order.priceBound = this.upperBound.toString();
            }
            if (this.state.orderInfo.isTakeProfit) {
                order.takeProfitOnFill = {};
                order.takeProfitOnFill.price = this.takeProfit.toString();
            }
            if (this.state.orderInfo.isStopLoss) {
                order.stopLossOnFill = {};
                order.stopLossOnFill.price = this.stopLoss.toString();
            }
        }
        if (this.state.orderInfo.isTrailingStop) {
            order.trailingStopLossOnFill = {};
            order.trailingStopLossOnFill.distance =
                (this.state.orderInfo.step * this.trailingStop).toString();
        }

        OrdersService.putOrder(order).then(transaction => {
            let opened,
                canceled,
                side,
                message;

            if (transaction.message) {
                message = `ERROR ${transaction.message}`;

                ToastsService.addToast(message);
            } else if (transaction.errorMessage) {
                message = `ERROR ${transaction.errorMessage}`;

                ToastsService.addToast(message);
            } else if (transaction.orderCancelTransaction) {
                canceled = transaction.orderCancelTransaction;

                message = `ERROR ${canceled.reason}`;

                ToastsService.addToast(message);
            } else {
                opened = transaction.orderFillTransaction ||
                    transaction.orderFillTransaction ||
                    transaction.orderCreateTransaction;

                side = opened.units > 0 ? "buy" : "sell";
                message = `${side} ` +
                    `${opened.instrument} ` +
                    `#${opened.id} ` +
                    `@${opened.price} ` +
                    `for ${opened.units}`;

                ToastsService.addToast(message);
            }
        });
    }
}
