"use strict";

{
    angular
        .module("components.orders")
        .component("orders", {
            controller: Orders,
            templateUrl: "app/components/orders/orders.html"
        });

    Orders.$inject = ["$mdDialog", "toastService", "ordersService"];
    function Orders($mdDialog, toastService, ordersService) {
        const vm = this;

        vm.closeOrder = closeOrder;
        vm.orders = ordersService.getOrders();

        activate();

        function activate() {
            ordersService.refresh();
        }

        function closeOrder(event, id) {
            const confirm = $mdDialog.confirm()
                .textContent("Are you sure to close the order?")
                .ariaLabel("Order closing confirmation")
                .ok("Ok")
                .cancel("Cancel")
                .targetEvent(event);

            $mdDialog.show(confirm).then(() => {
                ordersService.closeOrder(id).then(order => {
                    const message = "Closed " +
                        `#${order.orderCancelTransaction.orderID}`;

                    toastService.show(message);
                });
            });
        }
    }

}
