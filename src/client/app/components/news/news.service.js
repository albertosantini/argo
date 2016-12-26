"use strict";

{
    angular
        .module("components.news")
        .factory("newsService", newsService);

    newsService.$inject = ["$http", "sessionService"];
    function newsService($http, sessionService) {
        const service = {
            getNews
        };

        return service;

        function getNews() {
            return sessionService.isLogged().then(
                credentials => $http.post("/api/calendar", {
                    environment: credentials.environment,
                    token: credentials.token
                }).then(news => news.data)
                .catch(err => err.data)
            );
        }
    }

}
