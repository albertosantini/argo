"use strict";

(function () {
    angular
        .module("argo")
        .controller("Toast", Toast);

    Toast.$inject = ["$mdToast", "message"];
    function Toast($mdToast, message) {
        var vm = this;

        vm. message = message;

        vm.closeToast = function () {
            $mdToast.hide();
        };
    }

}());
