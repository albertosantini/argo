"use strict";

(function () {
    angular
        .module("argo")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "environmentService", "sessionService"];
    function accountsService($http, environmentService, sessionService) {
        var account = {},
            service = {
                getAccount: getAccount,
                getAccounts: getAccounts,
                refresh: refresh
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
                url = accountId ?
                    "/v1/accounts" + "/" + accountId : "/v1/accounts",
                request = environmentService.getRequest(environment, "api",
                    token, url);

            return $http(request).then(function (response) {
                var accounts = response.data.accounts || response.data;

                if (!accounts.length) {
                    angular.extend(account, response.data);

                    account.unrealizedPlPerc =
                        account.unrealizedPl / account.balance * 100;
                    account.netAssetValue =
                        account.balance + account.unrealizedPl;

                    $http.post("/api/instruments", {
                        environment: environment,
                        token: token,
                        accountId: accountId
                    }).then(function (instruments) {
                        account.instruments = instruments.data;
                    });
                }

                return accounts;
            }, function (response) {
                throw response.data.message;
            });
        }

    }

}());
