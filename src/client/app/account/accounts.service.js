"use strict";

(function () {
    angular
        .module("argo")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "environmentService", "streamService"];
    function accountsService($http, environmentService, streamService) {
        var service = {
            activeAccount: {},
            getAccounts: getAccounts
        };

        return service;

        function getAccounts(data) {
            var environment = data.environment,
                token = data.token,
                accountId = data.accountId,
                url = accountId ?
                    "/v1/accounts" + "/" + accountId : "/v1/accounts",
                request = environmentService.getRequest(environment, "api",
                    token, url);

            return $http(request).then(function (response) {
                var accounts = response.data.accounts || response.data;

                if (!accounts.length) {
                    angular.extend(service.activeAccount, response.data);

                    $http.post("/api/startstream", {
                        environment: environment,
                        accessToken: token,
                        accountId: accountId
                    }).success(function (instruments) {
                        console.log(instruments);
                        streamService.getStream();
                    });
                }

                return accounts;
            }, function (response) {
                throw response.data.message;
            });
        }
    }

}());
