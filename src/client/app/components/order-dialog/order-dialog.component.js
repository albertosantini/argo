import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { OrderDialogTemplate } from "./order-dialog.template.js";
import { OrderDialogController } from "./order-dialog.controller.js";

export class OrderDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("order-dialog"));

        this.orderDialogController = new OrderDialogController(render, OrderDialogTemplate, state);
    }
}
