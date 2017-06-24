import { Util } from "../../util";
import { SessionService } from "../session/session.service";
import { ToastsService } from "../toasts/toasts.service";

export class ChartsService {
    constructor(candles) {
        if (!ChartsService.candles) {
            ChartsService.candles = candles;
        }
    }

    static getHistQuotes({
        instrument = "EUR_USD",
        granularity = "M5",
        count = 251,
        dailyAlignment = "0"
    } = {}) {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/candles", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                instrument,
                granularity,
                count,
                dailyAlignment
            })
        }).then(res => res.text()).then(data => {
            ChartsService.candles.csv = data;
        }).catch(err => {
            ToastsService.addToast(err.data);
        });
    }
}

ChartsService.candles = null;
