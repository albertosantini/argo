import angular from "angular";

import { orderDialogComponent } from "./order-dialog.component";

export const orderDialog = angular
    .module("components.order-dialog", [])
    .component("orderDialog", orderDialogComponent)
    .name;
