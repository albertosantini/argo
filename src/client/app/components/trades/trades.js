"use strict";

{
    angular
        .module("components.trades")
        .component("trades", {
            controller: Trades,
            templateUrl: "app/components/trades/trades.html"
        });

    Trades.$inject = ["$mdDialog", "toastService", "tradesService"];
    function Trades($mdDialog, toastService, tradesService) {
        const vm = this;

        vm.closeTrade = closeTrade;
        vm.trades = tradesService.getTrades();

        activate();

        function activate() {
            tradesService.refresh();
        }

        function closeTrade(event, id) {
            const confirm = $mdDialog.confirm()
                .textContent("Are you sure to close the trade?")
                .ariaLabel("Trade closing confirmation")
                .ok("Ok")
                .cancel("Cancel")
                .targetEvent(event);

            $mdDialog.show(confirm).then(() => {
                tradesService.closeTrade(id).then(trade => {
                    const message = "Closed " +
                        `${(trade.units > 0 ? "sell" : "buy")} ` +
                        `${trade.instrument} ` +
                        `#${trade.id} ` +
                        `@${trade.price} ` +
                        `P&L ${trade.pl}`;

                    toastService.show(message);
                }).catch(err => {
                    const message = `ERROR ${err.code} ${err.message}`;

                    toastService.show(message);
                });

            });
        }
    }

}
