import Introspected from "introspected";

import { PositionsService } from "../positions/positions.service";

export class PositionsController {
    constructor(render, template) {

        this.state = Introspected({
            positions: []
        }, state => template.update(render, state));

        this.positionsService = new PositionsService(this.state.positions);
    }
}
