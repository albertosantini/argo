export class ChartsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getHistQuotes({
        instrument = "EUR_USD",
        granularity = "M5",
        count = 251,
        dailyAlignment = "0"
    } = {}) {
        return this.SessionService.isLogged().then(credentials =>
            this.$http.post("/api/candles", {
                environment: credentials.environment,
                token: credentials.token,
                instrument,
                granularity,
                count,
                dailyAlignment
            }).then(candles => candles.data)
                .catch(err => err.data));
    }
}
ChartsService.$inject = ["$http", "SessionService"];
