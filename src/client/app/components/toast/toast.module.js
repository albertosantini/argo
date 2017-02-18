import angular from "angular";

import { ToastService } from "./toast.service";

export const toast = angular
    .module("components.toast", [])
    .service("ToastService", ToastService)
    .name;
