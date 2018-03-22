import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { TradesTemplate } from "./trades.template.js";
import { TradesController } from "./trades.controller.js";

export class TradesComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("trades"));

        this.tradesController = new TradesController(render, TradesTemplate);
    }
}
