export class OrdersController {
    constructor($mdDialog, ToastService, OrdersService) {
        this.$mdDialog = $mdDialog;
        this.ToastService = ToastService;
        this.OrdersService = OrdersService;
    }

    $onInit() {
        this.orders = this.OrdersService.getOrders();

        this.OrdersService.refresh();
    }

    closeOrder(event, id) {
        const confirm = this.$mdDialog.confirm()
            .textContent("Are you sure to close the order?")
            .ariaLabel("Order closing confirmation")
            .ok("Ok")
            .cancel("Cancel")
            .targetEvent(event);

        this.$mdDialog.show(confirm).then(() => {
            this.OrdersService.closeOrder(id).then(order => {
                const message = "Closed " +
                    `#${order.orderCancelTransaction.orderID}`;

                this.ToastService.show(message);
            });
        });
    }
}
OrdersController.$inject = ["$mdDialog", "ToastService", "OrdersService"];
