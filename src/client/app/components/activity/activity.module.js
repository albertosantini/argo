import angular from "angular";

import { activityComponent } from "./activity.component";
import { ActivityService } from "./activity.service";

export const activity = angular
    .module("components.activity", [])
    .component("activity", activityComponent)
    .service("ActivityService", ActivityService)
    .name;
