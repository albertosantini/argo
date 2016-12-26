"use strict";

{
    angular
        .module("common")
        .controller("AppController", AppController);

    AppController.$inject = [];
    function AppController() {
        const vm = this;

        vm.tabSelectedIndex = 0;

        vm.next = () => {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 6);
        };
        vm.previous = () => {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };
    }

}
