import { AccountsBottomsheetController } from "./accounts-bottomsheet.controller";

export const accountsBottomsheetComponent = {
    templateUrl: "app/components/accounts-bottomsheet/accounts-bottomsheet.html",
    controller: AccountsBottomsheetController,
    bindings: {
        accounts: "<"
    }
};
