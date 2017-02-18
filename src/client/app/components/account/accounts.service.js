import angular from "angular";

export class AccountsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;

        this.account = {};
    }

    getAccount() {
        return this.account;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.getAccounts({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            });
        });
    }

    getAccounts(data) {
        const environment = data.environment || "practice",
            token = data.token,
            accountId = data.accountId,
            api = accountId ? "/api/account" : "/api/accounts";

        return this.$http.post(api, {
            environment,
            token,
            accountId
        }).then(response => {
            const accounts = response.data.accounts || response.data;

            if (response.data.message) {
                throw response.data.message;
            }

            if (!accounts.length) {
                angular.merge(this.account, response.data.account);

                this.account.timestamp = new Date();

                this.account.unrealizedPLPercent =
                    this.account.unrealizedPL / this.account.balance * 100;

                if (!this.account.instruments) {
                    this.$http.post("/api/instruments", {
                        environment,
                        token,
                        accountId
                    }).then(instruments => {
                        this.account.instruments = instruments.data;
                        this.account.pips = {};
                        angular.forEach(this.account.instruments, i => {
                            this.account.pips[i.name] =
                                Math.pow(10, i.pipLocation);
                        });
                    });
                }
            }

            return accounts;
        });
    }

    setStreamingInstruments(settings) {
        this.account.streamingInstruments = Object.keys(settings)
            .filter(el => !!settings[el]);

        return this.account.streamingInstruments;
    }
}
AccountsService.$inject = ["$http", "SessionService"];
