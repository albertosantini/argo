"use strict";

(function () {
    angular
        .module("argo")
        .config(config);

    config.$inject = ["$httpProvider", "$locationProvider",
                    "localStorageServiceProvider"];
    /*eslint-disable max-len */
    function config($httpProvider, $locationProvider, localStorageServiceProvider) {
   /*eslint-enable */
        var interceptors = $httpProvider.interceptors;

        interceptors.push(["$q", "$rootScope", function ($q, $rootScope) {
            var nLoadings = 0;

            return {
                request: function (request) {
                    nLoadings += 1;

                    $rootScope.isLoadingView = true;

                    return request;
                },

                "response": function (response) {
                    nLoadings -= 1;
                    if (nLoadings === 0) {
                        $rootScope.isLoadingView = false;
                    }

                    return response;
                },

                "responseError": function (response) {
                    nLoadings -= 1;
                    if (!nLoadings) {
                        $rootScope.isLoadingView = false;
                    }

                    return $q.reject(response);
                }
            };
        }]);

        $locationProvider.html5Mode(true);

        localStorageServiceProvider.setPrefix("argo");
    }

}());
