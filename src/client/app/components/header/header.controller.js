import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service";
import { SettingsDialogComponent } from "../settings-dialog/settings-dialog.component";
import { TokenDialogComponent } from "../token-dialog/token-dialog.component";
import { Util } from "../../util";

export class HeaderController {
    constructor(render, template) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        const instrsStorage = window.localStorage.getItem("argo.instruments");

        const instrs = JSON.parse(instrsStorage) || {
            EUR_USD: true,
            USD_JPY: true,
            GBP_USD: true,
            EUR_GBP: true,
            USD_CHF: true,
            EUR_JPY: true,
            EUR_CHF: true,
            USD_CAD: true,
            AUD_USD: true,
            GBP_JPY: true
        };

        this.state = Introspected({
            spinner: {
                isLoadingView: false
            },
            tokenModalIsOpen: false,
            tokenInfo: {
                environment: "practice",
                token: "",
                accountId: ""
            },
            settingsModalIsOpen: false,
            accounts: [],
            instrs
        }, state => template.update(render, state, events));

        Util.spinnerState = this.state.spinner;

        TokenDialogComponent.bootstrap(this.state);
        SettingsDialogComponent.bootstrap(this.state);
    }

    onOpenSettingsClick() {
        const allInstrs = AccountsService.getAccount().instruments;

        allInstrs.forEach(instrument => {
            if (!this.state.instrs[instrument.name].toString()) {
                this.state.instrs[instrument.name] = false;
            }
        });

        this.state.settingsModalIsOpen = true;
    }
}
