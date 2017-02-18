import angular from "angular";

import { tradesComponent } from "./trades.component";
import { TradesService } from "./trades.service";

export const trades = angular
    .module("components.trades", [])
    .component("trades", tradesComponent)
    .service("TradesService", TradesService)
    .name;
