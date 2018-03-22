import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { PositionsTemplate } from "./positions.template.js";
import { PositionsController } from "./positions.controller.js";

export class PositionsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("positions"));

        this.positionsController = new PositionsController(render, PositionsTemplate);
    }
}
