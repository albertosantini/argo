import angular from "angular";

import { tokenDialogComponent } from "./token-dialog.component";

export const tokenDialog = angular
    .module("components.token-dialog", [])
    .component("tokenDialog", tokenDialogComponent)
    .name;
