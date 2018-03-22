import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { OrdersTemplate } from "./orders.template.js";
import { OrdersController } from "./orders.controller.js";

export class OrdersComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("orders"));

        this.ordersController = new OrdersController(render, OrdersTemplate);
    }
}
