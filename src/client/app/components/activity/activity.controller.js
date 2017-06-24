import Introspected from "introspected";

import { ActivityService } from "../activity/activity.service";

export class ActivityController {
    constructor(render, template) {

        this.state = Introspected({
            activities: []
        }, state => template.update(render, state));

        this.activityService = new ActivityService(this.state.activities);
    }
}
