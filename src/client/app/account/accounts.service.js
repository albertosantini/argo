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
                    request = environmentService.getRequest(environment, token,
                        "api", "/v1/accounts");

                return $http(request).then(function (response) {
                    return response.data.accounts;
                }, function (response) {
                    throw response.data.message;
                });
            }
        };
    }

}());
