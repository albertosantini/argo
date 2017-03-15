export class ChartsController {
    constructor(ToastsService, modalService, AccountsService,
            ChartsService, QuotesService, TradesService) {
        this.ToastsService = ToastsService;
        this.modalService = modalService;
        this.AccountsService = AccountsService;
        this.ChartsService = ChartsService;
        this.QuotesService = QuotesService;
        this.TradesService = TradesService;
    }

    $onInit() {
        this.account = this.AccountsService.getAccount();

        this.selectedInstrument = "EUR_USD";

        this.granularities = [
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
        this.selectedGranularity = "M5";

        this.feed = this.QuotesService.getQuotes();

        this.trades = this.TradesService.getTrades();

        this.changeChart(this.selectedInstrument, this.selectedGranularity);
    }

    changeChart(instrument, granularity) {
        this.ChartsService.getHistQuotes({
            instrument,
            granularity
        }).then(candles => {
            this.data = candles;
        }).catch(err => {
            this.ToastsService.addToast(err);
        });
    }


    openOrderDialog(side) {
        this.modalService.open({
            template: "<order-dialog close-modal='closeModal()' params='params'></order-dialog>",
            scope: {
                params: {
                    side,
                    selectedInstrument: this.selectedInstrument,
                    instruments: this.account.streamingInstruments
                }
            }
        });
    }
}
ChartsController.$inject = [
    "ToastsService", "modalService", "AccountsService",
    "ChartsService", "QuotesService", "TradesService"
];
