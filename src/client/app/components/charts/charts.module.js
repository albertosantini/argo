import "./charts.css";

import angular from "angular";

import { chartsComponent } from "./charts.component";
import { ChartsService } from "./charts.service";

export const charts = angular
    .module("components.charts", [])
    .component("charts", chartsComponent)
    .service("ChartsService", ChartsService)
    .name;
