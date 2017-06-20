import angular from "angular";

import { settingsDialogComponent } from "./settings-dialog.component";

export const settingsDialog = angular
    .module("components.settings-dialog", [])
    .component("settingsDialog", settingsDialogComponent)
    .name;
