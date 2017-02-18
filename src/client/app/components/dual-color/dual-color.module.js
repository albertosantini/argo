import angular from "angular";

import { dualColorDirective } from "./dual-color.directive";

export const dualColor = angular
    .module("components.dual-color", [])
    .directive("dualColor", dualColorDirective)
    .name;
