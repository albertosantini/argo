"use strict";

{
    angular
        .module("components.charts")
        .component("orderDialog", {
            controller: OrderDialog,
            templateUrl: "app/components/order-dialog/order-dialog.html",
            bindings: {
                params: "<"
            }
        });

    OrderDialog.$inject = ["$mdDialog", "toastService",
        "quotesService", "ordersService", "accountsService"];
    function OrderDialog($mdDialog, toastService,
            quotesService, ordersService, accountsService) {
        const vm = this;

        const account = accountsService.getAccount(),
            pips = account.pips;

        this.$onInit = () => {
            vm.changeMarket = changeMarket;
            vm.changeMeasure = changeMeasure;

            vm.type = "MARKET";
            vm.side = vm.params.side;
            vm.instruments = vm.params.instruments;
            vm.selectedInstrument = vm.params.selectedInstrument;
            vm.changeMarket(vm.selectedInstrument);
            vm.expires = [
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
            vm.selectedExpire = 604800000; // 1 week
            vm.measure = "price";
            vm.isLowerBound = false;
            vm.isUpperBound = false;
            vm.isTakeProfit = false;
            vm.isStopLoss = false;
            vm.isTrailingStop = false;
        };

        function changeMarket(instrument) {
            if (!pips) {
                return;
            }

            const price = quotesService.getQuotes()[instrument],
                fixed = ((pips[vm.selectedInstrument].toString())
                    .match(/0/g) || []).length;

            vm.measure = "price";
            vm.step = parseFloat(pips[vm.selectedInstrument]);
            if (vm.side === "buy") {
                vm.quote = parseFloat(price && price.ask);
                vm.takeProfit = parseFloat((vm.quote + vm.step * 10)
                    .toFixed(fixed));
                vm.stopLoss = parseFloat((vm.quote - vm.step * 10)
                    .toFixed(fixed));
            } else {
                vm.quote = parseFloat(price && price.bid);
                vm.takeProfit = parseFloat((vm.quote - vm.step * 10)
                    .toFixed(fixed));
                vm.stopLoss = parseFloat((vm.quote + vm.step * 10)
                    .toFixed(fixed));
            }
            vm.lowerBound = parseFloat((vm.quote - vm.step).toFixed(fixed));
            vm.upperBound = parseFloat((vm.quote + vm.step).toFixed(fixed));
            vm.trailingStop = 25;
        }

        function changeMeasure(measure) {
            if (measure === "price") {
                changeMarket(vm.selectedInstrument);
            } else {
                vm.lowerBound = 1;
                vm.upperBound = 1;
                vm.takeProfit = 10;
                vm.stopLoss = 10;
                vm.trailingStop = 25;
                vm.step = 1;
            }
        }

        vm.hide = () => {
            $mdDialog.hide();
        };

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.answer = action => {
            const order = {},
                isBuy = vm.side === "buy",
                isMeasurePips = vm.measure === "pips";

            $mdDialog.hide(action);

            vm.step = parseFloat(pips[vm.selectedInstrument]);

            order.instrument = vm.selectedInstrument;
            order.units = vm.units;
            if (vm.units && !isBuy) {
                order.units = `-${order.units}`;
            }

            order.side = vm.side;
            order.type = vm.type;

            if (order.type === "LIMIT") {
                order.price = vm.quote && vm.quote.toString();
                order.gtdTime = new Date(Date.now() + vm.selectedExpire);
            }

            if (isMeasurePips) {
                if (vm.isLowerBound) {
                    order.priceBound =
                        parseFloat(vm.quote - vm.step * vm.lowerBound)
                            .toString();
                }
                if (vm.isUpperBound) {
                    order.priceBound =
                        parseFloat(vm.quote + vm.step * vm.upperBound)
                            .toString();
                }
                if (isBuy) {
                    if (vm.isTakeProfit) {
                        order.takeProfitOnFill = {};
                        order.takeProfitOnFill.price =
                            parseFloat(vm.quote + vm.step * vm.takeProfit)
                                .toString();
                    }
                    if (vm.isStopLoss) {
                        order.stopLossOnFill = {};
                        order.order.takeProfitOnFill.price =
                            parseFloat(vm.quote - vm.step * vm.stopLoss)
                                .toString();
                    }
                } else {
                    if (vm.isTakeProfit) {
                        order.takeProfitOnFill = {};
                        order.takeProfitOnFill.price =
                            parseFloat(vm.quote - vm.step * vm.takeProfit)
                                .toString();
                    }
                    if (vm.isStopLoss) {
                        order.stopLossOnFill = {};
                        order.order.takeProfitOnFill.price =
                            parseFloat(vm.quote + vm.step * vm.stopLoss)
                                .toString();
                    }
                }
            } else {
                if (vm.isLowerBound) {
                    order.priceBound = vm.lowerBound.toString();
                }
                if (vm.isUpperBound) {
                    order.priceBound = vm.upperBound.toString();
                }
                if (vm.isTakeProfit) {
                    order.takeProfitOnFill = {};
                    order.takeProfitOnFill.price = vm.takeProfit.toString();
                }
                if (vm.isStopLoss) {
                    order.stopLossOnFill = {};
                    order.stopLossOnFill.price = vm.stopLoss.toString();
                }
            }
            if (vm.isTrailingStop) {
                order.trailingStopLossOnFill = {};
                order.trailingStopLossOnFill.distance =
                    (vm.step * vm.trailingStop).toString();
            }

            if (action === "submit") {
                ordersService.putOrder(order).then(transaction => {
                    let opened,
                        canceled,
                        side,
                        message;

                    if (transaction.code && transaction.message) {
                        message = "ERROR " +
                            `${transaction.code} ${transaction.message}`;

                        toastService.show(message);
                    } else if (transaction.errorMessage) {
                        message = `ERROR ${transaction.errorMessage}`;

                        toastService.show(message);
                    } else if (transaction.orderCancelTransaction) {
                        canceled = transaction.orderCancelTransaction;

                        message = `ERROR ${canceled.reason}`;

                        toastService.show(message);
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

                        toastService.show(message);
                    }
                });
            }
        };
    }

}
