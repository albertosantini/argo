import "./app.css";

import angular from "angular";
import material from "angular-material";

import { appComponent } from "./app.component";
import { appConfig } from "./app.config";

export const app = angular
    .module("common.app", [
        material
    ])
    .component("app", appComponent)
    .config(appConfig)
    .name;
