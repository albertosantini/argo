"use strict";

(function () {
    angular
        .module("argo")
        .controller("Default", Default);

    function Default() {
        var vm = this;

        vm.name = "This is the default controller.";
        vm.tabSelectedIndex = 0;

        vm.next = function() {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 5);
        };
        vm.previous = function() {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };
    }
}());
