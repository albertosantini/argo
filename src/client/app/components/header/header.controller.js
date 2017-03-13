import angular from "angular";

export class HeaderController {
    constructor($window, $rootScope, modalService, ToastsService,
            AccountsService, SessionService,
            QuotesService, StreamingService) {
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.modalService = modalService;
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
        this.modalService.open({
            template: `<token-dialog
                close-modal="closeModal(tokenInfo)"></token-dialog>`,
            onClose: tokenInfo => {
                if (tokenInfo) {
                    this.token = tokenInfo.token;
                    this.environment = tokenInfo.environment;
                    this.accountId = tokenInfo.accountId;
                    this.instrs = tokenInfo.instrs;
                }
            }
        });
    }

    openSettingsDialog() {
        this.SessionService.isLogged().then(credentials => {
            const allInstrs = this.AccountsService.getAccount().instruments;

            angular.forEach(allInstrs, instrument => {
                if (!this.instrs.hasOwnProperty(instrument.name)) {
                    this.instrs[instrument.name] = false;
                }
            });

            this.modalService.open({
                template: `<settings-dialog
                    close-modal="closeModal(settingsInfo)"
                    instruments="instruments"></settings-dialog>`,
                scope: {
                    instruments: this.instrs
                },
                onClose: settingsInfo => {
                    let instruments;

                    if (settingsInfo) {
                        this.$window.localStorage.setItem("argo.instruments",
                            angular.toJson(settingsInfo));
                        instruments = this.AccountsService
                            .setStreamingInstruments(settingsInfo);

                        this.QuotesService.reset();

                        this.StreamingService.startStream({
                            environment: credentials.environment,
                            accessToken: credentials.token,
                            accountId: credentials.accountId,
                            instruments
                        });
                    }
                }
            });
        }).catch(err => {
            if (err) {
                this.ToastsService.addToast(err);
            }
        });
    }
}
HeaderController.$inject = [
    "$window", "$rootScope", "modalService", "ToastsService",
    "AccountsService", "SessionService",
    "QuotesService", "StreamingService"
];
