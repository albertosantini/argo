import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { PositionsTemplate } from "./positions.template";
import { PositionsController } from "./positions.controller";

export class PositionsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("positions"));

        this.positionsController = new PositionsController(render, PositionsTemplate);
    }
}
