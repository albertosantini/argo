import angular from "angular";

import { positionsComponent } from "./positions.component";
import { PositionsService } from "./positions.service";

export const positions = angular
    .module("components.positions", [])
    .component("positions", positionsComponent)
    .service("PositionsService", PositionsService)
    .name;
