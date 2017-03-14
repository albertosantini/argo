export class OrdersController {
    constructor($mdDialog, ToastsService, OrdersService) {
        this.$mdDialog = $mdDialog;
        this.ToastsService = ToastsService;
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
                const message = `Closed #${order.orderCancelTransaction.orderID}`;

                this.ToastsService.addToast(message);
            }).catch(err => {
                const message = `ERROR ${err.code} ${err.message}`;

                this.ToastsService.addToast(message);
            });

        });
    }
}
OrdersController.$inject = ["$mdDialog", "ToastsService", "OrdersService"];
