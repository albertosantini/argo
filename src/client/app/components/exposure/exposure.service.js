import { SessionService } from "../session/session.service";
import { TradesService } from "../trades/trades.service";

export class ExposureService {
    constructor(exposure) {
        if (!ExposureService.exposure) {
            ExposureService.exposure = exposure;
        }
    }

    static getExposure() {
        return ExposureService.exposure;
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return;
        }

        const trades = TradesService.getTrades(),
            exps = {};

        trades.value.forEach(trade => {
            const legs = trade.instrument.split("_");

            exps[legs[0]] = exps[legs[0]] || 0;
            exps[legs[1]] = exps[legs[1]] || 0;

            exps[legs[0]] += parseInt(trade.currentUnits, 10);
            exps[legs[1]] -= trade.currentUnits * trade.price;
        });

        ExposureService.exposure.splice(0, ExposureService.exposure.length);
        Object.keys(exps).forEach(exp => {
            const type = exps[exp] > 0;

            ExposureService.exposure.push({
                type: type ? "Long" : "Short",
                market: exp,
                units: Math.abs(exps[exp])
            });
        });

    }
}

ExposureService.exposure = null;
