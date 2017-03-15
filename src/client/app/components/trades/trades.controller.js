export class TradesController {
    constructor(modalService, ToastsService, TradesService) {
        this.modalService = modalService;
        this.ToastsService = ToastsService;
        this.TradesService = TradesService;
    }

    $onInit() {
        this.trades = this.TradesService.getTrades();

        this.TradesService.refresh();
    }

    closeTrade(id) {
        this.modalService.open({
            template: `
                <main class="pa4 black-80 bg-white">
                    <form class="measure center">
                        <fieldset id="login" class="ba b--transparent ph0 mh0">
                            <legend class="f4 fw6 ph0 mh0 center">Are you sure to close the trade?</legend>
                        </fieldset>
                    </form>
                    <div class="flex flex-row items-center justify-around">
                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit" value="Cancel"
                            ng-click="closeModal()">

                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit" value="Ok"
                            ng-click="closeModal(id)">
                    </div>
                    </form>
                </main>
            `,
            scope: {
                id
            },
            onClose: tradeId => {
                if (!tradeId) {
                    return;
                }

                this.TradesService.closeTrade(tradeId).then(trade => {
                    let message = "Closed " +
                            `${(trade.units > 0 ? "sell" : "buy")} ` +
                            `${trade.instrument} ` +
                            `#${trade.id} ` +
                            `@${trade.price} ` +
                            `P&L ${trade.pl}`;

                    if (trade.errorMessage || trade.message) {
                        message = `ERROR ${trade.errorMessage || trade.message}`;
                    }


                    this.ToastsService.addToast(message);
                }).catch(err => {
                    const message = `ERROR ${err.code} ${err.message}`;

                    this.ToastsService.addToast(message);
                });
            }
        });
    }
}
TradesController.$inject = ["modalService", "ToastsService", "TradesService"];
