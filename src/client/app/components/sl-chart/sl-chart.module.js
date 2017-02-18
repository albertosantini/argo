import angular from "angular";

import { slChartDirective } from "./sl-chart.directive";

export const slChart = angular
    .module("components.sl-chart", [])
    .directive("slChart", slChartDirective)
    .name;
