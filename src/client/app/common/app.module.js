import angular from "angular";

import { appComponent } from "./app.component";
import { appConfig } from "./app.config";

export const app = angular
    .module("common.app", [
        "ngMaterial",
        "simple-modal"
    ])
    .component("app", appComponent)
    .config(appConfig)
    .name;
