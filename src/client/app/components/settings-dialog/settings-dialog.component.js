import { SettingsDialogController } from "./settings-dialog.controller";

export const settingsDialogComponent = {
    templateUrl: "app/components/settings-dialog/settings-dialog.html",
    controller: SettingsDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&",
        instruments: "<"
    }
};
