import "mocha";
import { assert } from "chai";

import { PositionsService } from "./positions.service";
import { SessionService } from "../session/session.service";

const { beforeEach, describe, it } = window;

describe("positionsService", () => {
    const environment = "my environment";
    const token = "my token";
    const accountId = "my account id";
    const mockedPositions = [
        {
            instrument: "EUR_USD",
            long: {
                units: 4741,
                averagePrice: 1.3626
            }
        },
        {
            instrument: "USD_CAD",
            short: {
                units: -30,
                averagePrice: 1.11563
            }
        },
        {
            instrument: "USD_JPY",
            long: {
                units: 88,
                averagePrice: 102.455
            }
        }
    ];

    beforeEach(() => {
        const apiPositions = "/api/positions";

        /* eslint no-new:off */
        new PositionsService([]);

        SessionService.setCredentials({
            environment,
            token,
            accountId
        });

        fetch.mock(apiPositions, mockedPositions);
    });

    it("getPositions", done => {
        PositionsService.refresh().then(positions => {
            assert.lengthOf(positions, 3);

            assert.strictEqual("USD_CAD", positions[1].instrument);
            assert.strictEqual(-30, positions[1].units);
            assert.strictEqual("sell", positions[1].side);
            assert.strictEqual(1.11563, positions[1].avgPrice);
        }).then(done).catch(done);
    });

});
