import Introspected from "introspected";

import { AccountsService } from "../account/accounts.service";
import { ActivityService } from "../activity/activity.service";
import { ChartsComponent } from "../charts/charts.component";
import { ExposureService } from "../exposure/exposure.service";
import { NewsService } from "../news/news.service";
import { OrdersService } from "../orders/orders.service";
import { PositionsService } from "../positions/positions.service";
import { SessionService } from "../session/session.service";
import { StreamingService } from "../streaming/streaming.service";
import { ToastsService } from "../toasts/toasts.service";
import { TradesService } from "../trades/trades.service";
import { Util } from "../../util";


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
