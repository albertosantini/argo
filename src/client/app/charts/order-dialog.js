"use strict";

(function () {
    angular
        .module("argo")
        .controller("OrderDialog", OrderDialog);

    OrderDialog.$inject = ["$mdDialog", "toastService", "params",
                        "quotesService", "ordersService", "accountsService"];
    function OrderDialog($mdDialog, toastService, params,
                        quotesService, ordersService, accountsService) {
        var vm = this;

        var account = accountsService.getAccount(),
            pips = account.pips;

        vm.changeMarket = changeMarket;
        vm.changeMeasure = changeMeasure;

        vm.type = "market";
        vm.side = params.side;
        vm.instruments = params.instruments;
        vm.selectedInstrument = params.selectedInstrument;
        vm.changeMarket(vm.selectedInstrument);
        vm.expires = [
            {label: "1 Hour", value: 60 * 60 * 1000},
            {label: "2 Hours", value: 2 * 60 * 60 * 1000},
            {label: "3 Hours", value: 3 * 60 * 60 * 1000},
            {label: "4 Hours", value: 4 * 60 * 60 * 1000},
            {label: "5 Hours", value: 5 * 60 * 60 * 1000},
            {label: "6 Hours", value: 6 * 60 * 60 * 1000},
            {label: "8 Hours", value: 8 * 60 * 60 * 1000},
            {label: "12 Hours", value: 12 * 60 * 60 * 1000},
            {label: "18 Hours", value: 18 * 60 * 60 * 1000},
            {label: "1 Day", value: 60 * 60 * 24 * 1000},
            {label: "2 Days", value: 2 * 60 * 60 * 24 * 1000},
            {label: "1 Week", value: 7 * 60 * 60 * 24 * 1000},
            {label: "1 Month", value: 30 * 60 * 60 * 24 * 1000},
            {label: "2 Months", value: 60 * 60 * 60 * 24 * 1000},
            {label: "3 Months", value: 90 * 60 * 60 * 24 * 1000}
        ];
        vm.selectedExpire = 604800000; // 1 week
        vm.measure = "price";
        vm.isLowerBound = false;
        vm.isUpperBound = false;
        vm.isTakeProfit = false;
        vm.isStopLoss = false;
        vm.isTrailingStop = false;

        function changeMarket(instrument) {
            var price = quotesService.getQuotes()[instrument],
                fixed = (pips[vm.selectedInstrument].match(/0/g) || []).length;

            vm.measure = "price";
            vm.step = parseFloat(pips[vm.selectedInstrument]);
            if (vm.side === "buy") {
                vm.quote = price && price.ask;
                vm.takeProfit = parseFloat((vm.quote + vm.step * 10)
                    .toFixed(fixed));
                vm.stopLoss = parseFloat((vm.quote - vm.step * 10)
                    .toFixed(fixed));
            } else {
                vm.quote = price && price.bid;
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

        vm.hide = function () {
            $mdDialog.hide();
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.answer = function (action) {
            var order = {},
                isBuy = vm.side === "buy",
                isMeasurePips = vm.measure === "pips";


            $mdDialog.hide(action);

            vm.step = parseFloat(pips[vm.selectedInstrument]);

            order.instrument = vm.selectedInstrument;
            order.units = vm.units;
            order.side = vm.side;
            order.type = vm.type;

            if (order.type === "limit") {
                order.price = vm.quote;
                order.expiry = new Date(Date.now() + vm.selectedExpire);
            }

            if (isMeasurePips) {
                if (vm.isLowerBound) {
                    order.lowerBound = parseFloat(vm.quote -
                        vm.step * vm.lowerBound);
                }
                if (vm.isUpperBound) {
                    order.upperBound = parseFloat(vm.quote +
                        vm.step * vm.lowerBound);
                }
                if (isBuy) {
                    if (vm.isTakeProfit) {
                        order.takeProfit = parseFloat(vm.quote +
                            vm.step * vm.takeProfit);
                    }
                    if (vm.isStopLoss) {
                        order.stopLoss = parseFloat(vm.quote -
                            vm.step * vm.stopLoss);
                    }
                } else {
                    order.takeProfit = parseFloat(vm.quote -
                        vm.step * vm.takeProfit);
                    order.stopLoss = parseFloat(vm.quote +
                        vm.step * vm.stopLoss);
                }
            } else {
                if (vm.isLowerBound) {
                    order.lowerBound = vm.lowerBound;
                }
                if (vm.isUpperBound) {
                    order.upperBound = vm.upperBound;
                }
                if (vm.isTakeProfit) {
                    order.takeProfit = vm.takeProfit;
                }
                if (vm.isStopLoss) {
                    order.stopLoss = vm.stopLoss;
                }
            }
            if (vm.isTrailingStop) {
                order.trailingStop = vm.trailingStop;
            }

            if (action === "submit") {
                ordersService.putOrder(order).then(function (transaction) {
                    var opened,
                        message;

                    if (transaction.code && transaction.message) {
                        message = "ERROR " +
                            transaction.code + " " +
                            transaction.message;

                        toastService.show(message);
                    } else {
                        opened = transaction.tradeOpened ||
                            transaction.orderOpened;
                        message = opened.side + " " +
                            transaction.instrument +
                            " #" + opened.id +
                            " @" + transaction.price +
                            " for " + opened.units;

                        toastService.show(message);
                    }
                });
            }
        };
    }

}());
