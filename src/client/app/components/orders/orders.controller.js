export class OrdersController {
    constructor(modalService, ToastsService, OrdersService) {
        this.modalService = modalService;
        this.ToastsService = ToastsService;
        this.OrdersService = OrdersService;
    }

    $onInit() {
        this.orders = this.OrdersService.getOrders();

        this.OrdersService.refresh();
    }

    closeOrder(id) {
        this.modalService.open({
            template: `
                <main class="pa4 black-80 bg-white">
                    <form class="measure center">
                        <fieldset id="login" class="ba b--transparent ph0 mh0">
                            <legend class="f4 fw6 ph0 mh0 center">Are you sure to close the order?</legend>
                        </fieldset>
                    </form>
                    <div class="flex flex-row items-center justify-around">
                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit" value="Cancel"
                            ng-click="closeModal()">

                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit" value="Ok"
                            ng-click="closeModal(id)">
                    </div>
                    </form>
                </main>
            `,
            scope: {
                id
            },
            onClose: orderId => {
                if (!orderId) {
                    return;
                }

                this.OrdersService.closeOrder(orderId).then(order => {
                    let message = `Closed #${order.orderCancelTransaction.orderID}`;

                    if (order.errorMessage || order.message) {
                        message = `ERROR ${order.errorMessage || order.message}`;
                    }

                    this.ToastsService.addToast(message);
                }).catch(err => {
                    const message = `ERROR ${err.code} ${err.message}`;

                    this.ToastsService.addToast(message);
                });
            }
        });
    }
}
OrdersController.$inject = ["modalService", "ToastsService", "OrdersService"];
