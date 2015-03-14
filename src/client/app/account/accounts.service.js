"use strict";

(function () {
    angular
        .module("argo")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "$q",
        "environmentService", "streamService"];
    function accountsService($http, $q, environmentService, streamService) {
        var service = {
            getAccounts: getAccounts,
            getActiveAccount: getActiveAccount
        }, deferredAccount = $q.defer();


        return service;

        function getAccounts(data) {
            var environment = data.environment || "practice",
                token = data.token,
                accountId = data.accountId,
                url = accountId ?
                    "/v1/accounts" + "/" + accountId : "/v1/accounts",
                request = environmentService.getRequest(environment, "api",
                    token, url);

            return $http(request).then(function (response) {
                var accounts = response.data.accounts || response.data,
                    activeAccount = {};

                if (!accounts.length) {
                    angular.extend(activeAccount, response.data);

                    $http.post("/api/startstream", {
                        environment: environment,
                        accessToken: token,
                        accountId: accountId
                    }).success(function (instruments) {
                        activeAccount.instruments = instruments;
                        streamService.getStream();

                        deferredAccount.resolve(activeAccount);
                    });
                }

                return accounts;
            }, function (response) {
                throw response.data.message;
            });
        }

        function getActiveAccount() {
            return deferredAccount.promise;
        }
    }

}());
