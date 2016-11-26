"use strict";

(function () {
    angular
        .module("components.toast")
        .factory("toastService", toastService);

    toastService.$inject = ["$mdToast"];
    function toastService($mdToast) {
        var service = {
            show: show
        };

        return service;

        function show(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .action("CLOSE")
                    .position("right bottom")
                    .hideDelay(10000)
            );
        }
    }

}());
