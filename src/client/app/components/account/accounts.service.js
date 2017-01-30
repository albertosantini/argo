"use strict";

{
    angular
        .module("components.account")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "sessionService"];
    function accountsService($http, sessionService) {
        const account = {},
            service = {
                getAccount,
                getAccounts,
                refresh,
                setStreamingInstruments
            };

        return service;

        function getAccount() {
            return account;
        }

        function refresh() {
            sessionService.isLogged().then(credentials => {
                getAccounts({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                });
            });
        }

        function getAccounts(data) {
            const environment = data.environment || "practice",
                token = data.token,
                accountId = data.accountId,
                api = accountId ? "/api/account" : "/api/accounts";

            return $http.post(api, {
                environment,
                token,
                accountId
            }).then(response => {
                const accounts = response.data.accounts || response.data;

                if (response.data.message) {
                    throw response.data.message;
                }

                if (!accounts.length) {
                    angular.merge(account, response.data.account);

                    account.timestamp = new Date();

                    account.unrealizedPLPercent =
                        account.unrealizedPL / account.balance * 100;

                    if (!account.instruments) {
                        $http.post("/api/instruments", {
                            environment,
                            token,
                            accountId
                        }).then(instruments => {
                            account.instruments = instruments.data;
                            account.pips = {};
                            angular.forEach(account.instruments, i => {
                                account.pips[i.name] =
                                    Math.pow(10, i.pipLocation);
                            });
                        });
                    }
                }

                return accounts;
            });
        }

        function setStreamingInstruments(settings) {
            account.streamingInstruments = Object.keys(settings)
                .filter(el => !!settings[el]);

            return account.streamingInstruments;
        }

    }

}
