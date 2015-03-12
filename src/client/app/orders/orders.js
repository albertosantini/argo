"use strict";

(function () {
    angular
        .module("argo")
        .controller("Orders", Orders);

    Orders.$inject = ["$mdDialog", "toastService", "ordersService"];
    function Orders($mdDialog, toastService, ordersService) {
        var vm = this;

        vm.getOrders = getOrders;
        vm.closeOrder = closeOrder;

        ordersService.getOrders().then(getOrders);

        function getOrders(orders) {
            vm.orders = orders;
        }

        function closeOrder(event, id) {
            var confirm = $mdDialog.confirm()
                  .content("Are you sure to close the order?")
                  .ariaLabel("Order closing confirmation")
                  .ok("Ok")
                  .cancel("Cancel")
                  .targetEvent(event);

            $mdDialog.show(confirm).then(function () {
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
            });
        }
    }

}());
