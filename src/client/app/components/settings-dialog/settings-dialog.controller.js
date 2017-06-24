import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service";
import { QuotesService } from "../quotes/quotes.service";
import { SessionService } from "../session/session.service";
import { StreamingService } from "../streaming/streaming.service";
import { Util } from "../../util";

export class SettingsDialogController {
    constructor(render, template, bindings) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected.observe(bindings,
            state => template.update(render, state, events));
    }

    onSettingsOkClick() {
        const credentials = SessionService.isLogged();

        this.state.settingsModalIsOpen = false;

        if (!credentials) {
            return;
        }

        window.localStorage.setItem("argo.instruments", JSON.stringify(this.state.instrs));

        const instruments = AccountsService.setStreamingInstruments(this.state.instrs);

        QuotesService.reset();

        StreamingService.startStream({
            environment: credentials.environment,
            accessToken: credentials.token,
            accountId: credentials.accountId,
            instruments
        });
    }
}
