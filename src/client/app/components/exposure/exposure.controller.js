export class ExposureController {
    constructor(TradesService) {
        this.TradesService = TradesService;
    }

    $onInit() {
        this.exposures = [];

        const trades = this.TradesService.getTrades(),
            exps = {};

        trades.forEach(trade => {
            const legs = trade.instrument.split("_");

            exps[legs[0]] = exps[legs[0]] || 0;
            exps[legs[1]] = exps[legs[1]] || 0;

            exps[legs[0]] += parseInt(trade.currentUnits, 10);
            exps[legs[1]] -= trade.currentUnits * trade.price;
        });

        Object.keys(exps).forEach(exp => {
            const type = exps[exp] > 0;

            this.exposures.push({
                type: type ? "Long" : "Short",
                market: exp,
                units: Math.abs(exps[exp])
            });
        });
    }
}
ExposureController.$inject = ["TradesService"];
