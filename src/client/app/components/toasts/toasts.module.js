import angular from "angular";

import { toastsComponent } from "./toasts.component";
import { ToastsService } from "./toasts.service";

export const toasts = angular
    .module("components.toasts", [])
    .component("toasts", toastsComponent)
    .service("ToastsService", ToastsService)
    .name;
