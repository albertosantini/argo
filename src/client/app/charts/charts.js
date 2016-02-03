"use strict";

(function () {
    angular
        .module("argo")
        .component("charts", {
            controller: Charts,
            templateUrl: "app/charts/charts.html"
        });

    Charts.$inject = ["$mdDialog", "accountsService",
        "chartsService", "quotesService", "tradesService"];
    function Charts($mdDialog, accountsService,
        chartsService, quotesService, tradesService) {

        var vm = this;

        vm.account = accountsService.getAccount();

        vm.selectedInstrument = "EUR_USD";

        vm.granularities = [
            "S5",
            "S10",
            "S15",
            "S30",
            "M1",
            "M2",
            "M3",
            "M4",
            "M5",
            "M10",
            "M15",
            "M30",
            "H1",
            "H2",
            "H3",
            "H4",
            "H6",
            "H8",
            "H12",
            "D",
            "W",
            "M"
        ];
        vm.selectedGranularity = "M5";

        vm.feed = quotesService.getQuotes();

        vm.trades = tradesService.getTrades();

        vm.changeChart = function (instrument, granularity) {
            chartsService.getHistQuotes({
                instrument: instrument,
                granularity: granularity
            }).then(function (candles) {
                vm.data = candles;
            });
        };

        vm.changeChart(vm.selectedInstrument, vm.selectedGranularity);

        vm.openOrderDialog = function (event, side) {
            $mdDialog.show({
                controller: "OrderDialog",
                controllerAs: "vm",
                templateUrl: "app/charts/order-dialog.html",
                locals: {
                    params: {
                        side: side,
                        selectedInstrument: vm.selectedInstrument,
                        instruments: vm.account.streamingInstruments
                    }
                },
                targetEvent: event
            });
        };

    }

}());
