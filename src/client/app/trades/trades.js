"use strict";

(function () {
    angular
        .module("argo")
        .controller("Trades", Trades);

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
                  .content("Are you sure to close the trade?")
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
                    toastService.show(err);
                });

            });
        }
    }

}());
