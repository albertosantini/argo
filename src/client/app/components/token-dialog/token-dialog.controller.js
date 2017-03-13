export class TokenDialogController {
    constructor($window, ToastsService, SessionService, AccountsService, StreamingService) {
        this.$window = $window;
        this.ToastsService = ToastsService;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;
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

        this.environment = "practice";
        this.accounts = [];
    }


    login(tokenInfo) {
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
            angular.extend(this.accounts, accounts);
        }, err => {
            this.ToastsService.addToast(err);
        });
    }

    selectAccount(accountSelected) {
        this.accountId = this.accounts[accountSelected].id;

        const tokenInfo = {
            environment: this.environment,
            token: this.token,
            accountId: this.accountId,
            instrs: this.instrs
        };

        this.SessionService.setCredentials(tokenInfo);

        this.AccountsService.getAccounts(tokenInfo).then(() => {
            const instruments = this.AccountsService
                .setStreamingInstruments(this.instrs);

            this.StreamingService.startStream({
                environment: this.environment,
                accessToken: this.token,
                accountId: this.accountId,
                instruments
            });

            this.closeModal({ tokenInfo });
        }).catch(err => {
            this.ToastsService.addToast(err);
        });
    }

}
TokenDialogController.$inject = [
    "$window", "ToastsService", "SessionService",
    "AccountsService", "StreamingService"
];
