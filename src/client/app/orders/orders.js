"use strict";

(function () {
    angular
        .module("argo")
        .controller("Orders", Orders);

    Orders.$inject = ["ordersService"];
    function Orders(ordersService) {
        var vm = this;

        ordersService.getOrders().then(function (orders) {
            vm.orders = orders;
        });
    }

}());
