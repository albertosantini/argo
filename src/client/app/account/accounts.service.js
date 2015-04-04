"use strict";

(function () {
    angular
        .module("argo")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "sessionService"];
    function accountsService($http, sessionService) {
        var account = {},
            service = {
                getAccount: getAccount,
                getAccounts: getAccounts,
                refresh: refresh,
                setStreamingInstruments: setStreamingInstruments
            };

        return service;

        function getAccount() {
            return account;
        }

        function refresh() {
            sessionService.isLogged().then(function (credentials) {
                getAccounts({
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                });
            });
        }

        function getAccounts(data) {
            var environment = data.environment || "practice",
                token = data.token,
                accountId = data.accountId,
                api = accountId ? "/api/account" : "/api/accounts";

            return $http.post(api, {
                environment: environment,
                token: token,
                accountId: accountId
            }).then(function (response) {
                var accounts = response.data.accounts || response.data;

                if (response.data.message) {
                    throw response.data.message;
                }

                if (!accounts.length) {
                    angular.merge(account, response.data);

                    account.timestamp = new Date();

                    account.unrealizedPlPerc =
                        account.unrealizedPl / account.balance * 100;
                    account.netAssetValue =
                        account.balance + account.unrealizedPl;

                    if (!account.instruments) {
                        $http.post("/api/instruments", {
                            environment: environment,
                            token: token,
                            accountId: accountId
                        }).then(function (instruments) {
                            account.instruments = instruments.data;
                            account.pips = {};
                            angular.forEach(account.instruments, function (i) {
                                account.pips[i.instrument] = i.pip;
                            });
                        });
                    }
                }

                return accounts;
            });
        }

        function setStreamingInstruments(settings) {
            account.streamingInstruments = Object.keys(settings)
                .filter(function (el) {
                    if (settings[el]) {
                        return true;
                    } else {
                        return false;
                    }
                });

            return account.streamingInstruments;
        }

    }

}());
