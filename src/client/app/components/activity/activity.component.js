import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { ActivityTemplate } from "./activity.template.js";
import { ActivityController } from "./activity.controller.js";

export class ActivityComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("activity"));

        this.activityController = new ActivityController(render, ActivityTemplate);
    }
}
