import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { TradesTemplate } from "./trades.template";
import { TradesController } from "./trades.controller";

export class TradesComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("trades"));

        this.tradesController = new TradesController(render, TradesTemplate);
    }
}
