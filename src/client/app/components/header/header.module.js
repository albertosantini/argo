import angular from "angular";

import { headerComponent } from "./header.component";

export const header = angular
    .module("components.header", [])
    .component("header", headerComponent)
    .name;
