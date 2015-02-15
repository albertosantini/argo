"use strict";

(function () {
    angular
        .module("argo")
        .controller("MyToast", MyToast);

    MyToast.$inject = ["$mdToast"];
    function MyToast($mdToast) {
        var vm = this;

        vm.closeToast = function () {
            $mdToast.hide();
        };
    }

}());
