"use strict";

(function () {
    angular
        .module("argo")
        .config(config);

    config.$inject = ["$httpProvider", "$locationProvider"];
    function config($httpProvider, $locationProvider) {
        var interceptors = $httpProvider.interceptors;

        // Maybe later we use interceptors to inject sessionService.token
        interceptors.push(["$q", function ($q) {
            return {
                "responseError": function (response) {
                    if (response.status === 401) {
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);

        $locationProvider.html5Mode(true);
    }

}());

/*eslint-disable no-unused-vars */
function assert(condition, message) {
    if (!condition) {
        throw new TypeError(message || "assert failed");
    }
}
