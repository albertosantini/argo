import Introspected from "introspected";

import { ExposureService } from "./exposure.service";

export class ExposureController {
    constructor(render, template) {

        this.state = Introspected({
            exposure: []
        }, state => template.update(render, state));

        this.exposureService = new ExposureService(this.state.exposure);
    }
}
