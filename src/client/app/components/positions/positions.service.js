import { Util } from "../../util";
import { SessionService } from "../session/session.service";

export class PositionsService {
    constructor(positions) {
        if (!PositionsService.positions) {
            PositionsService.positions = positions;
        }
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/positions", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            })
        }).then(res => res.json()).then(positions => {
            PositionsService.positions.splice(0, PositionsService.positions.length);

            positions.forEach(position => {
                const longUnits = position.long &&
                    parseInt(position.long.units, 10);
                const shortUnits = position.short &&
                    parseInt(position.short.units, 10);
                const units = longUnits || shortUnits;
                const side = units > 0 ? "buy" : "sell";
                const avgPrice = (longUnits && position.long.averagePrice) ||
                    (shortUnits && position.short.averagePrice);

                PositionsService.positions.push({
                    side,
                    instrument: position.instrument,
                    units,
                    avgPrice
                });
            });

            return PositionsService.positions;
        }).catch(err => err.data);
    }
}

PositionsService.positions = null;
