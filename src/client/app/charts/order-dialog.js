"use strict";

(function () {
    angular
        .module("argo")
        .controller("OrderDialog", OrderDialog);

    OrderDialog.$inject = ["$mdDialog", "params", "quotesService"];
    function OrderDialog($mdDialog, params, quotesService) {
        var vm = this;

        vm.changeMarket = changeMarket;
        vm.changeMeasure = changeMeasure;

        vm.type = "market";
        vm.side = params.side;
        vm.instruments = params.instruments;
        vm.selectedInstrument = params.selectedInstrument;
        vm.changeMarket(vm.selectedInstrument);
        vm.expires = [
            "1 Hour",
            "2 Hours",
            "3 Hours",
            "4 Hours",
            "5 Hours",
            "6 Hours",
            "8 Hours",
            "12 Hours",
            "18 Hours",
            "1 Day",
            "2 Days",
            "1 Week",
            "1 Month",
            "2 Months",
            "3 Months"
        ];
        vm.selectedExpire = params.selectedExpire;
        vm.measure = "price";
        vm.isLowerBound = false;
        vm.isUpperBound = false;
        vm.isTakeProfit = false;
        vm.isStopLoss = false;
        vm.isTralingStop = false;

        function changeMarket(instrument) {
            var price = quotesService.getQuotes()[instrument];

            vm.step = 0.0001;
            if (vm.side === "buy") {
                vm.quote = price && price.ask;
                vm.takeProfit = vm.quote + vm.step * 10;
                vm.stopLoss = vm.quote - vm.step * 10;
                vm.trailingStop = vm.quote - vm.step * 25;
            } else {
                vm.quote = price && price.bid;
                vm.takeProfit = vm.quote - vm.step * 10;
                vm.stopLoss = vm.quote + vm.step * 10;
                vm.trailingStop = vm.quote + vm.step * 25;
            }
            vm.lowerBound = vm.quote - vm.step;
            vm.upperBound = vm.quote + vm.step;
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

        vm.answer = function (token) {
            $mdDialog.hide(token);
        };
    }

}());
