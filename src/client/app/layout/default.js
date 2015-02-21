"use strict";

(function () {
    angular
        .module("argo")
        .controller("Default", Default);

    // Default.$inject = ["$mdToast"];
    function Default() {
        var vm = this;

        vm.tabSelectedIndex = 0;

        vm.next = function () {
            vm.tabSelectedIndex = Math.min(vm.tabSelectedIndex + 1, 5);
        };
        vm.previous = function () {
            vm.tabSelectedIndex = Math.max(vm.tabSelectedIndex - 1, 0);
        };

        // TODO: Commented, because it interferes with bottom sheet.
        //
        // vm.showCustomToast = function () {
        //     $mdToast.show({
        //         controller: "MyToast",
        //         controllerAs: "toast",
        //         templateUrl: "app/layout/toast.html",
        //         hideDelay: 6000,
        //         position: "bottom right"
        //     });
        // };
    }
}());
