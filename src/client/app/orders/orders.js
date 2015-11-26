"use strict";

(function () {
    angular
        .module("argo")
        .controller("Orders", Orders);

    Orders.$inject = ["$mdDialog", "toastService", "ordersService"];
    function Orders($mdDialog, toastService, ordersService) {
        var vm = this;

        vm.closeOrder = closeOrder;
        vm.orders = ordersService.getOrders();

        activate();

        function activate() {
            ordersService.refresh();
        }

        function closeOrder(event, id) {
            var confirm = $mdDialog.confirm()
                  .textContent("Are you sure to close the order?")
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
                });
            });
        }
    }

}());
