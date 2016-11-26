"use strict";

(function () {
    angular
        .module("components.news")
        .factory("newsService", newsService);

    newsService.$inject = ["$http", "$q", "sessionService"];
    function newsService($http, $q, sessionService) {
        var latest = [],
            service = {
                getNews: getNews
            };

        return service;

        function getNews() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/calendar", {
                    environment: credentials.environment,
                    token: credentials.token
                }).then(function (news) {
                    latest = news.data;
                    deferred.resolve(latest);
                });
            });

            return deferred.promise;
        }
    }

}());
