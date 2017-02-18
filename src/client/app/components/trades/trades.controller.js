export class TradesController {
    constructor($mdDialog, ToastService, TradesService) {
        this.$mdDialog = $mdDialog;
        this.ToastService = ToastService;
        this.TradesService = TradesService;
    }

    $onInit() {
        this.trades = this.TradesService.getTrades();

        this.TradesService.refresh();
    }

    closeTrade(event, id) {
        const confirm = this.$mdDialog.confirm()
            .textContent("Are you sure to close the trade?")
            .ariaLabel("Trade closing confirmation")
            .ok("Ok")
            .cancel("Cancel")
            .targetEvent(event);

        this.$mdDialog.show(confirm).then(() => {
            this.TradesService.closeTrade(id).then(trade => {
                const message = "Closed " +
                    `${(trade.units > 0 ? "sell" : "buy")} ` +
                    `${trade.instrument} ` +
                    `#${trade.id} ` +
                    `@${trade.price} ` +
                    `P&L ${trade.pl}`;

                this.ToastService.show(message);
            }).catch(err => {
                const message = `ERROR ${err.code} ${err.message}`;

                this.ToastService.show(message);
            });

        });
    }
}
TradesController.$inject = ["$mdDialog", "ToastService", "TradesService"];
