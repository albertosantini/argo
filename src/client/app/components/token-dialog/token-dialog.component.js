import { TokenDialogController } from "./token-dialog.controller";

export const tokenDialogComponent = {
    templateUrl: "app/components/token-dialog/token-dialog.html",
    controller: TokenDialogController,
    bindings: {
        openModal: "=",
        closeModal: "&"
    }
};
