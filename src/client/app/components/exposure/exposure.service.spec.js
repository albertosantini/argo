import "mocha";
import { assert } from "chai";

import { ExposureService } from "./exposure.service";
import { TradesService } from "../trades/trades.service";

const { beforeEach, describe, it } = window;

describe("Exposure", () => {

    beforeEach(() => {
        TradesService.trades = {
            value: [
                {
                    instrument: "EUR_USD",
                    currentUnits: 100,
                    price: 1.2345
                },
                {
                    instrument: "GPB_USD",
                    currentUnits: 200,
                    price: 1.4678
                }
            ]
        };

        ExposureService.exposure = [];
        ExposureService.refresh();
    });

    it("test", () => {
        const exposures = ExposureService.exposure;

        assert.lengthOf(exposures, 3);

        assert.strictEqual("EUR", exposures[0].market);
        assert.strictEqual(100, exposures[0].units);
        assert.strictEqual("Long", exposures[0].type);

        assert.strictEqual("USD", exposures[1].market);
        assert.strictEqual(417.01, exposures[1].units);
        assert.strictEqual("Short", exposures[1].type);

        assert.strictEqual("GPB", exposures[2].market);
        assert.strictEqual(200, exposures[2].units);
        assert.strictEqual("Long", exposures[2].type);
    });
});
