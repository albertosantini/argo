"use strict";

(function () {
    angular
        .module("argo")
        .factory("toastService", toastService);

    toastService.$inject = ["$mdToast"];
    function toastService($mdToast) {
        var service = {
            show: show
        };

        return service;

        function show(message) {
            $mdToast.show({
                controller: "Toast",
                controllerAs: "vm",
                templateUrl: "app/toast/toast.html",
                locals: {message: message},
                hideDelay: 10000,
                position: "right bottom"
            });
        }
    }

}());
