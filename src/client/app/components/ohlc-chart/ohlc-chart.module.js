import angular from "angular";

import { ohlcChartDirective } from "./ohlc-chart.directive";

export const ohlcChart = angular
    .module("components.ohlc-chart", [])
    .directive("ohlcChart", ohlcChartDirective)
    .name;
