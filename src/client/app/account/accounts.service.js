"use strict";

(function () {
    angular
        .module("argo")
        .factory("accountsService", accountsService);

    accountsService.$inject = ["$http", "environmentService"];
    function accountsService($http, environmentService) {
        return {
            getAccounts: function(data) {
                var environment = data.environment,
                    token = data.token,
                    accountId = data.accountId,
                    url = accountId ?
                        "/v1/accounts" + "/" + accountId : "/v1/accounts",
                    request = environmentService.getRequest(environment, token,
                        "api", url);

                return $http(request).then(function (response) {
                    return response.data.accounts || response.data;
                }, function (response) {
                    throw response.data.message;
                });
            }
        };
    }

}());
