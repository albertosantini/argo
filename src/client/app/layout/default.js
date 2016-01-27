"use strict";

(function () {
    angular
        .module("argo")
        .component("default", {
            controller: Default,
            templateUrl: "app/layout/default.html"
        });

    Default.$inject = [];
    function Default() {
        var vm = this;

        vm.tabSelectedIndex = 0;

        vm.next = function () {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 6);
        };
        vm.previous = function () {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };

    }
}());
