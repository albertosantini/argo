"use strict";

(function () {
    angular
        .module("components.charts")
        .component("charts", {
            controller: Charts,
            templateUrl: "app/components/charts/charts.html"
        });

    Charts.$inject = ["$rootScope", "$mdDialog", "accountsService",
        "chartsService", "quotesService", "tradesService"];
    function Charts($rootScope, $mdDialog, accountsService,
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
            var scope = angular.extend($rootScope.$new(true), {
                params: {
                    side: side,
                    selectedInstrument: vm.selectedInstrument,
                    instruments: vm.account.streamingInstruments
                }
            });

            $mdDialog.show({
                template: "<order-dialog aria-label='Order Dialog' params='params'></order-dialog>",
                scope: scope,
                preserveScope: true,
                targetEvent: event
            });
        };

    }

}());
