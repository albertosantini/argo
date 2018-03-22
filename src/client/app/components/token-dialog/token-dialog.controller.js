import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service.js";
import { ActivityService } from "../activity/activity.service.js";
import { ChartsComponent } from "../charts/charts.component.js";
import { ExposureService } from "../exposure/exposure.service.js";
import { NewsService } from "../news/news.service.js";
import { OrdersService } from "../orders/orders.service.js";
import { PositionsService } from "../positions/positions.service.js";
import { SessionService } from "../session/session.service.js";
import { StreamingService } from "../streaming/streaming.service.js";
import { ToastsService } from "../toasts/toasts.service.js";
import { TradesService } from "../trades/trades.service.js";
import { Util } from "../../util.js";


export class TokenDialogController {
    constructor(render, template, bindings) {
        const events = (e, payload) => Util.handleEvent(this, e, payload);

        this.state = Introspected.observe(bindings,
            state => template.update(render, state, events));
    }

    onLoginOkClick() {
        AccountsService.getAccounts({
            environment: this.state.tokenInfo.environment,
            token: this.state.tokenInfo.token
        }).then(accounts => {
            const message = "If your account id contains only digits " +
                "(ie. 2534233), it is a legacy account and you should use " +
                "release 3.x. For v20 accounts use release 4.x or higher. " +
                "Check your token.";

            if (!accounts.length) {
                throw new Error(message);
            }
            accounts.forEach(item => {
                this.state.accounts.push(item);
            });
        }).catch(err => {
            this.state.tokenModalIsOpen = false;
            this.state.tokenInfo.token = "";
            ToastsService.addToast(err);
        });
    }

    onSelectAccountClick(e, accountSelected) {
        this.state.tokenInfo.accountId = this.state.accounts[accountSelected].id;

        const tokenInfo = {
            environment: this.state.tokenInfo.environment,
            token: this.state.tokenInfo.token,
            accountId: this.state.tokenInfo.accountId,
            instrs: this.state.instrs
        };

        SessionService.setCredentials(tokenInfo);

        AccountsService.getAccounts(tokenInfo).then(() => {
            const instruments = AccountsService
                .setStreamingInstruments(this.state.instrs);

            StreamingService.startStream({
                environment: tokenInfo.environment,
                accessToken: tokenInfo.token,
                accountId: tokenInfo.accountId,
                instruments
            });

            ActivityService.refresh();
            TradesService.refresh();
            OrdersService.refresh();
            PositionsService.refresh();
            ExposureService.refresh();
            NewsService.refresh();

            ChartsComponent.bootstrap();

            this.state.tokenModalIsOpen = false;
        }).catch(err => {
            ToastsService.addToast(err);
            this.state.tokenModalIsOpen = false;
        });
    }

}
