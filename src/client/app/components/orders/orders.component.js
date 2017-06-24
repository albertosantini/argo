import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { OrdersTemplate } from "./orders.template";
import { OrdersController } from "./orders.controller";

export class OrdersComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("orders"));

        this.ordersController = new OrdersController(render, OrdersTemplate);
    }
}
