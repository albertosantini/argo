export class OrderDialogController {
    constructor(ToastsService, QuotesService, OrdersService, AccountsService) {
        this.ToastsService = ToastsService;
        this.QuotesService = QuotesService;
        this.OrdersService = OrdersService;
        this.AccountsService = AccountsService;
    }

    $onInit() {
        const account = this.AccountsService.getAccount();

        this.pips = account.pips;

        this.type = "MARKET";
        this.side = this.params.side;
        this.instruments = this.params.instruments;
        this.selectedInstrument = this.params.selectedInstrument;
        this.changeMarket(this.selectedInstrument);
        this.expires = [
            { label: "1 Hour", value: 60 * 60 * 1000 },
            { label: "2 Hours", value: 2 * 60 * 60 * 1000 },
            { label: "3 Hours", value: 3 * 60 * 60 * 1000 },
            { label: "4 Hours", value: 4 * 60 * 60 * 1000 },
            { label: "5 Hours", value: 5 * 60 * 60 * 1000 },
            { label: "6 Hours", value: 6 * 60 * 60 * 1000 },
            { label: "8 Hours", value: 8 * 60 * 60 * 1000 },
            { label: "12 Hours", value: 12 * 60 * 60 * 1000 },
            { label: "18 Hours", value: 18 * 60 * 60 * 1000 },
            { label: "1 Day", value: 60 * 60 * 24 * 1000 },
            { label: "2 Days", value: 2 * 60 * 60 * 24 * 1000 },
            { label: "1 Week", value: 7 * 60 * 60 * 24 * 1000 },
            { label: "1 Month", value: 30 * 60 * 60 * 24 * 1000 },
            { label: "2 Months", value: 60 * 60 * 60 * 24 * 1000 },
            { label: "3 Months", value: 90 * 60 * 60 * 24 * 1000 }
        ];
        this.selectedExpire = 604800000; // 1 week
        this.measure = "price";
        this.isLowerBound = false;
        this.isUpperBound = false;
        this.isTakeProfit = false;
        this.isStopLoss = false;
        this.isTrailingStop = false;
    }

    changeMarket(instrument) {
        if (!this.pips) {
            return;
        }

        const price = this.QuotesService.getQuotes()[instrument],
            fixed = ((this.pips[this.selectedInstrument].toString())
                .match(/0/g) || []).length;

        this.measure = "price";
        this.step = parseFloat(this.pips[this.selectedInstrument]);
        if (this.side === "buy") {
            this.quote = parseFloat(price && price.ask);
            this.takeProfit = parseFloat((this.quote + this.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.quote - this.step * 10)
                .toFixed(fixed));
        } else {
            this.quote = parseFloat(price && price.bid);
            this.takeProfit = parseFloat((this.quote - this.step * 10)
                .toFixed(fixed));
            this.stopLoss = parseFloat((this.quote + this.step * 10)
                .toFixed(fixed));
        }
        this.lowerBound = parseFloat((this.quote - this.step).toFixed(fixed));
        this.upperBound = parseFloat((this.quote + this.step).toFixed(fixed));
        this.trailingStop = 25;
    }

    changeMeasure(measure) {
        if (measure === "price") {
            this.changeMarket(this.selectedInstrument);
        } else {
            this.lowerBound = 1;
            this.upperBound = 1;
            this.takeProfit = 10;
            this.stopLoss = 10;
            this.trailingStop = 25;
            this.step = 1;
        }
    }

    answer(action) {
        if (action === "close") {
            this.openModal = false;

            return;
        }

        if (!this.pips) {
            this.ToastsService.addToast(`Pips info for ${this.selectedInstrument} not yet available. Retry.`);
            this.openModal = false;

            return;
        }

        this.openModal = false;

        const order = {},
            isBuy = this.side === "buy",
            isMeasurePips = this.measure === "pips";

        this.step = parseFloat(this.pips[this.selectedInstrument]);

        order.instrument = this.selectedInstrument;
        order.units = this.units;
        if (this.units && !isBuy) {
            order.units = `-${order.units}`;
        }

        order.side = this.side;
        order.type = this.type;

        if (order.type === "LIMIT") {
            order.price = this.quote && this.quote.toString();
            order.gtdTime = new Date(Date.now() + this.selectedExpire);
        }

        if (isMeasurePips) {
            if (this.isLowerBound) {
                order.priceBound =
                    parseFloat(this.quote - this.step * this.lowerBound)
                        .toString();
            }
            if (this.isUpperBound) {
                order.priceBound =
                    parseFloat(this.quote + this.step * this.upperBound)
                        .toString();
            }
            if (isBuy) {
                if (this.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat(this.quote + this.step * this.takeProfit)
                            .toString();
                }
                if (this.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat(this.quote - this.step * this.stopLoss)
                            .toString();
                }
            } else {
                if (this.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price =
                        parseFloat(this.quote - this.step * this.takeProfit)
                            .toString();
                }
                if (this.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.order.takeProfitOnFill.price =
                        parseFloat(this.quote + this.step * this.stopLoss)
                            .toString();
                }
            }
        } else {
            if (this.isLowerBound) {
                order.priceBound = this.lowerBound.toString();
            }
            if (this.isUpperBound) {
                order.priceBound = this.upperBound.toString();
            }
            if (this.isTakeProfit) {
                order.takeProfitOnFill = {};
                order.takeProfitOnFill.price = this.takeProfit.toString();
            }
            if (this.isStopLoss) {
                order.stopLossOnFill = {};
                order.stopLossOnFill.price = this.stopLoss.toString();
            }
        }
        if (this.isTrailingStop) {
            order.trailingStopLossOnFill = {};
            order.trailingStopLossOnFill.distance =
                (this.step * this.trailingStop).toString();
        }

        this.OrdersService.putOrder(order).then(transaction => {
            let opened,
                canceled,
                side,
                message;

            if (transaction.message) {
                message = `ERROR ${transaction.message}`;

                this.ToastsService.addToast(message);
            } else if (transaction.errorMessage) {
                message = `ERROR ${transaction.errorMessage}`;

                this.ToastsService.addToast(message);
            } else if (transaction.orderCancelTransaction) {
                canceled = transaction.orderCancelTransaction;

                message = `ERROR ${canceled.reason}`;

                this.ToastsService.addToast(message);
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

                this.ToastsService.addToast(message);
            }
        });
    }
}
OrderDialogController.$inject = ["ToastsService", "QuotesService", "OrdersService", "AccountsService"];
