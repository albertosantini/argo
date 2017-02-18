import angular from "angular";

import { ordersComponent } from "./orders.component";
import { OrdersService } from "./orders.service";

export const orders = angular
    .module("components.orders", [])
    .component("orders", ordersComponent)
    .service("OrdersService", OrdersService)
    .name;
