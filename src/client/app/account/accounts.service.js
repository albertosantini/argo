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
                    url = environmentService.getUrl(environment,
                            "api", "/v1/accounts");

                return $http({
                    "url": url,
                    "headers": {
                        "Authorization": "Bearer " + token
                    }
                }).then(function (response) {
                    return response.data.accounts;
                }, function (response) {
                    return response.data.message;
                });
            }
        };
    }

}());
