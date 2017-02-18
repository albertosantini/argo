import angular from "angular";

import { accountComponent } from "./account.component";
import { AccountsService } from "./accounts.service";

export const account = angular
    .module("components.account", [])
    .component("account", accountComponent)
    .service("AccountsService", AccountsService)
    .name;
