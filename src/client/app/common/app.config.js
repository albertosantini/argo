"use strict";

{
    angular
        .module("common")
        .config(config);

    config.$inject = ["$httpProvider", "$locationProvider"];
    function config($httpProvider, $locationProvider) {
        const interceptors = $httpProvider.interceptors;

        interceptors.push(["$q", "$rootScope", ($q, $rootScope) => {
            let nLoadings = 0;

            return {
                request(request) {
                    nLoadings += 1;

                    $rootScope.isLoadingView = true;

                    return request;
                },

                response(response) {
                    nLoadings -= 1;
                    if (nLoadings === 0) {
                        $rootScope.isLoadingView = false;
                    }

                    return response;
                },

                responseError(response) {
                    nLoadings -= 1;
                    if (!nLoadings) {
                        $rootScope.isLoadingView = false;
                    }

                    return $q.reject(response);
                }
            };
        }]);

        $locationProvider.html5Mode(true);
    }

}
