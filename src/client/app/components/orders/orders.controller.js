import Introspected from "introspected";

import { OrdersService } from "../orders/orders.service";
import { ToastsService } from "../toasts/toasts.service";
import { Util } from "../../util";
import { YesNoDialogComponent } from "../yesno-dialog/yesno-dialog.component";

export class OrdersController {
    constructor(render, template) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected({
            orders: [],
            yesnoModalIsOpen: false,
            yesnoModalText: "Are you sure to close the order?",
            closeOrderInfo: {
                orderId: null
            }
        }, state => template.update(render, state));

        this.ordersService = new OrdersService(this.state.orders);

        YesNoDialogComponent.bootstrap(this.state, events);
    }

    onCancelYesNoDialogClick() {
        this.state.yesnoModalIsOpen = false;
    }

    onOkYesNoDialogClick() {
        this.state.yesnoModalIsOpen = false;

        OrdersService.closeOrder(this.state.closeOrderInfo.orderId).then(order => {
            let message = `Closed #${order.orderCancelTransaction.orderID}`;

            if (order.errorMessage || order.message) {
                message = `ERROR ${order.errorMessage || order.message}`;
            }

            ToastsService.addToast(message);
        }).catch(err => {
            const message = `ERROR ${err.code} ${err.message}`;

            ToastsService.addToast(message);
        });
    }
}
