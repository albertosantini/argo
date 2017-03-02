import angular from "angular";

export class HeaderController {
    constructor($window, $rootScope, $mdDialog, $mdBottomSheet,
            ToastsService, AccountsService, SessionService,
            QuotesService, StreamingService) {
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.ToastsService = ToastsService;
        this.AccountsService = AccountsService;
        this.SessionService = SessionService;
        this.QuotesService = QuotesService;
        this.StreamingService = StreamingService;
    }

    $onInit() {
        const instrsStorage = this.$window.localStorage.getItem("argo.instruments");

        this.instrs = angular.fromJson(instrsStorage) || {
            EUR_USD: true,
            USD_JPY: true,
            GBP_USD: true,
            EUR_GBP: true,
            USD_CHF: true,
            EUR_JPY: true,
            EUR_CHF: true,
            USD_CAD: true,
            AUD_USD: true,
            GBP_JPY: true
        };

        this.isLoadingViewWatcher = this.$rootScope.$watch("isLoadingView", () => {
            this.isLoadingView = this.$rootScope.isLoadingView;
        });
    }

    openTokenDialog(event) {
        this.$mdDialog.show({
            template: "<token-dialog aria-label='Token Dialog'></token-dialog>",
            targetEvent: event
        }).then(tokenInfo => {
            if (tokenInfo) {
                this.environment = tokenInfo.environment;
                this.token = tokenInfo.token;
            } else {
                this.environment = "";
                this.token = "";
                this.accountId = "";
            }

            this.AccountsService.getAccounts({
                environment: this.environment,
                token: this.token
            }).then(accounts => {
                const scope = angular.extend(this.$rootScope.$new(true), {
                    accounts
                });

                this.$mdBottomSheet.show({
                    template: "<accounts-bottomsheet accounts='accounts'></accounts-bottomsheet>",
                    scope,
                    preserveScope: true,
                    targetEvent: event
                }).then(accountSelected => {
                    this.accountId = accountSelected.id;

                    this.SessionService.setCredentials({
                        environment: this.environment,
                        token: this.token,
                        accountId: this.accountId
                    });

                    this.AccountsService.getAccounts({
                        environment: this.environment,
                        token: this.token,
                        accountId: this.accountId
                    }).then(() => {
                        const instruments = this.AccountsService
                            .setStreamingInstruments(this.instrs);

                        this.StreamingService.startStream({
                            environment: this.environment,
                            accessToken: this.token,
                            accountId: this.accountId,
                            instruments
                        });
                    });
                });
            }, err => {
                this.ToastsService.addToast(err);
            });
        })
        .catch(err => {
            if (err) {
                this.ToastsService.addToast(err);
            }
        });
    }

    openSettingsDialog(event) {
        this.SessionService.isLogged().then(credentials => {
            const allInstrs = this.AccountsService.getAccount().instruments;

            angular.forEach(allInstrs, instrument => {
                if (!this.instrs.hasOwnProperty(instrument.name)) {
                    this.instrs[instrument.name] = false;
                }
            });

            const scope = angular.extend(this.$rootScope.$new(true), {
                instruments: this.instrs
            });

            this.$mdDialog.show({
                template: "<settings-dialog aria-label='Settings Dialog' instruments='instruments'></settings-dialog>",
                scope,
                preserveScope: true,
                targetEvent: event
            }).then(settingsInfo => {
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
            })
            .catch(err => {
                if (err) {
                    this.ToastsService.addToast(err);
                }
            });
        });
    }
}
HeaderController.$inject = [
    "$window", "$rootScope", "$mdDialog", "$mdBottomSheet",
    "ToastsService", "AccountsService", "SessionService",
    "QuotesService", "StreamingService"
];
