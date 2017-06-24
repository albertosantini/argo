import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { ActivityTemplate } from "./activity.template";
import { ActivityController } from "./activity.controller";

export class ActivityComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("activity"));

        this.activityController = new ActivityController(render, ActivityTemplate);
    }
}
