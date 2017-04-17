import angular from "angular";

export class HeaderController {
    constructor($window, $rootScope, ToastsService,
        AccountsService, SessionService, QuotesService, StreamingService) {

        this.$window = $window;
        this.$rootScope = $rootScope;
        this.ToastsService = ToastsService;
        this.AccountsService = AccountsService;
        this.SessionService = SessionService;
        this.QuotesService = QuotesService;
        this.StreamingService = StreamingService;
    }

    $onInit() {
        this.$rootScope.$watch("isLoadingView", () => {
            this.isLoadingView = this.$rootScope.isLoadingView;
        });
    }

    openTokenDialog() {
        this.openTokenModal = true;
    }

    closeTokenDialog(tokenInfo) {
        this.openTokenModal = false;

        if (tokenInfo) {
            this.token = tokenInfo.token;
            this.environment = tokenInfo.environment;
            this.accountId = tokenInfo.accountId;
            this.instrs = tokenInfo.instrs;
        }
    }

    openSettingsDialog() {
        this.SessionService.isLogged().then(credentials => {
            const allInstrs = this.AccountsService.getAccount().instruments;

            angular.forEach(allInstrs, instrument => {
                if (!this.instrs.hasOwnProperty(instrument.name)) {
                    this.instrs[instrument.name] = false;
                }
            });

            this.credentials = credentials;
            this.openSettingsModal = true;
        }).catch(err => {
            if (err) {
                this.ToastsService.addToast(err);
            }
        });
    }

    closeSettingsDialog(settingsInfo) {
        let instruments;

        this.openSettingsModal = false;

        if (settingsInfo) {
            this.$window.localStorage.setItem("argo.instruments",
                angular.toJson(settingsInfo));
            instruments = this.AccountsService
                .setStreamingInstruments(settingsInfo);

            this.QuotesService.reset();

            this.StreamingService.startStream({
                environment: this.credentials.environment,
                accessToken: this.credentials.token,
                accountId: this.credentials.accountId,
                instruments
            });
        }
    }

}
HeaderController.$inject = [
    "$window", "$rootScope", "ToastsService",
    "AccountsService", "SessionService",
    "QuotesService", "StreamingService"
];
