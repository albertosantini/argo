import angular from "angular";

export class ChartsController {
    constructor($rootScope, $mdDialog, AccountsService,
            ChartsService, QuotesService, TradesService) {
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
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
        });
    }


    openOrderDialog(event, side) {
        const scope = angular.extend(this.$rootScope.$new(true), {
            params: {
                side,
                selectedInstrument: this.selectedInstrument,
                instruments: this.account.streamingInstruments
            }
        });

        this.$mdDialog.show({
            template: "<order-dialog aria-label='Order Dialog' params='params'></order-dialog>",
            scope,
            preserveScope: true,
            targetEvent: event
        });
    }
}
ChartsController.$inject = ["$rootScope", "$mdDialog", "AccountsService",
    "ChartsService", "QuotesService", "TradesService"];
