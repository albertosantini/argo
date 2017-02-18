export class NewsService {
    constructor($http, SessionService) {
        this.$http = $http;
        this.SessionService = SessionService;
    }

    getNews() {
        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/calendar", {
                environment: credentials.environment,
                token: credentials.token
            }).then(news => news.data)
            .catch(err => err.data)
        );
    }
}
NewsService.$inject = ["$http", "SessionService"];
