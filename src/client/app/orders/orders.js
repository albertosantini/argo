"use strict";

(function () {
    angular
        .module("argo")
        .controller("Orders", Orders);

    Orders.$inject = ["toastService", "ordersService"];
    function Orders(toastService, ordersService) {
        var vm = this;

        vm.getOrders = getOrders;
        vm.closeOrder = closeOrder;

        ordersService.getOrders().then(getOrders);

        function getOrders(orders) {
            vm.orders = orders;
        }

        function closeOrder(id) {
            ordersService.closeOrder(id).then(function (order) {
                var message = "Closed " +
                    order.side + " " +
                    order.instrument +
                    " #" + order.id +
                    " @" + order.price +
                    " for " + order.units;

                toastService.show(message);
                ordersService.getOrders().then(getOrders);
            });
        }
    }

}());
