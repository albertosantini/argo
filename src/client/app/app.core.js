"use strict";

(function () {
    angular
        .module("argo")
        .config(config)
        .run(setup);

    // config.$inject = ["$httpProvider", "$injector"];
    // function config($httpProvider, $injector) {
    config.$inject = ["$httpProvider", "$locationProvider"];
    function config($httpProvider, $locationProvider) {
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
                        // $mdToast.showSimple(message);
                        console.log(response);

                        return $q.reject(response);
                    }
                }
            };
        }]);

        $locationProvider.html5Mode(true);
    }

    setup.$inject = ["pricesService"];
    function setup(pricesService) {
        pricesService.getPricesStream();
    }


}());
