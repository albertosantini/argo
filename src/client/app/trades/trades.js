"use strict";

(function () {
    angular
        .module("argo")
        .component("trades", {
            controller: Trades,
            templateUrl: "app/trades/trades.html"
        });

    Trades.$inject = ["$mdDialog", "toastService", "tradesService"];
    function Trades($mdDialog, toastService, tradesService) {
        var vm = this;

        vm.closeTrade = closeTrade;
        vm.trades = tradesService.getTrades();

        activate();

        function activate() {
            tradesService.refresh();
        }

        function closeTrade(event, id) {
            var confirm = $mdDialog.confirm()
                .textContent("Are you sure to close the trade?")
                .ariaLabel("Trade closing confirmation")
                .ok("Ok")
                .cancel("Cancel")
                .targetEvent(event);

            $mdDialog.show(confirm).then(function () {
                tradesService.closeTrade(id).then(function (trade) {
                    var message = "Closed " +
                        trade.side + " " +
                        trade.instrument +
                        " #" + trade.id +
                        " @" + trade.price +
                        " P&L " + trade.profit;

                    toastService.show(message);
                }, function (err) {
                    var message = "ERROR " +
                        err.code + " " +
                        err.message;

                    toastService.show(message);
                });

            });
        }
    }

}());
