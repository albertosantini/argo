import angular from "angular";

import { yesnoDialogComponent } from "./yesno-dialog.component";

export const yesnoDialog = angular
    .module("components.yesno-dialog", [])
    .component("yesnoDialog", yesnoDialogComponent)
    .name;
