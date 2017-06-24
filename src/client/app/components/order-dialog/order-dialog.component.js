import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { OrderDialogTemplate } from "./order-dialog.template";
import { OrderDialogController } from "./order-dialog.controller";

export class OrderDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("order-dialog"));

        this.orderDialogController = new OrderDialogController(render, OrderDialogTemplate, state);
    }
}
