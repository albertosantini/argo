import angular from "angular";

import { accountsBottomsheetComponent } from "./accounts-bottomsheet.component";

export const accountsBottomsheet = angular
    .module("components.accounts-bottomsheet", [])
    .component("accountsBottomsheet", accountsBottomsheetComponent)
    .name;

