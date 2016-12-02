"use strict";

(function () {
    angular
        .module("components.news")
        .factory("newsService", newsService);

    newsService.$inject = ["$http", "sessionService"];
    function newsService($http, sessionService) {
        var service = {
            getNews: getNews
        };

        return service;

        function getNews() {
            return sessionService.isLogged().then(function (credentials) {
                return $http.post("/api/calendar", {
                    environment: credentials.environment,
                    token: credentials.token
                }).then(function (news) {
                    return news.data;
                }).catch(function (err) {
                    return err.data;
                });
            });
        }
    }

}());
