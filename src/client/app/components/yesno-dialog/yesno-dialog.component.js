import { YesNoDialogController } from "./yesno-dialog.controller";

export const yesnoDialogComponent = {
    templateUrl: "app/components/yesno-dialog/yesno-dialog.html",
    controller: YesNoDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&",
        text: "@"
    }
};
