import angular from "angular";

import { highlighterDirective } from "./highlighter.directive";

export const highlighter = angular
    .module("components.highlighter", [])
    .directive("highlighter", highlighterDirective)
    .name;
