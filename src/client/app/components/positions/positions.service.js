export class PositionsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getPositions() {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/positions", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(positions => {
                const data = [];

                positions.data.forEach(position => {
                    const longUnits = position.long &&
                        parseInt(position.long.units, 10);
                    const shortUnits = position.short &&
                        parseInt(position.short.units, 10);
                    const units = longUnits || shortUnits;
                    const side = units > 0 ? "buy" : "sell";
                    const avgPrice = (longUnits && position.long.averagePrice) ||
                        (shortUnits && position.short.averagePrice);

                    data.push({
                        side,
                        instrument: position.instrument,
                        units,
                        avgPrice
                    });
                });

                return data;
            }).catch(err => err.data)
        );
    }
}
PositionsService.$inject = ["$http", "SessionService"];
