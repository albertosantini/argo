export class ChartsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getHistQuotes(opt) {
        return this.SessionService.isLogged().then(credentials => {
            const instrument = opt && opt.instrument || "EUR_USD",
                granularity = opt && opt.granularity || "M5",
                count = opt && opt.count || 251,
                dailyAlignment = opt && opt.dailyAlignment || "0";

            return this.$http.post("/api/candles", {
                environment: credentials.environment,
                token: credentials.token,
                instrument,
                granularity,
                count,
                dailyAlignment
            }).then(candles => candles.data)
            .catch(err => err.data);
        });
    }
}
ChartsService.$inject = ["$http", "SessionService"];
