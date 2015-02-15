"use strict";

(function () {
    angular
        .module("argo")
        .config(config);

    // config.$inject = ["$httpProvider", "$injector"];
    // function config($httpProvider, $injector) {
    config.$inject = ["$httpProvider"];
    function config($httpProvider) {
        var interceptors = $httpProvider.interceptors;

        interceptors.push(["$q", function($q) {
            return {
                "responseError": function(response) {
                    // var $mdToast = $injector.get("$mdToast");

                    if (response.status === 401) {
                        // $mdToast.showSimple("Access denied");
                        console.log("Access denied");

                        return $q.reject(response);
                    } else {
                        console.log(response);

                        // $mdToast.showSimple(message);

                        return $q.reject(response);
                    }
                }
            };
        }]);
    }

}());
