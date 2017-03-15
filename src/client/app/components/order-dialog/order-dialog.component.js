import { OrderDialogController } from "./order-dialog.controller";

export const orderDialogComponent = {
    templateUrl: "app/components/order-dialog/order-dialog.html",
    controller: OrderDialogController,
    bindings: {
        closeModal: "&",
        params: "<"
    }
};
