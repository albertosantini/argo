"use strict";

(function () {
    angular
        .module("argo")
        .factory("activityService", activityService);

    activityService.$inject = ["$http", "$q", "sessionService"];
    function activityService($http, $q, sessionService) {
        var activities = [],
            service = {
                getActivities: getActivities,
                addActivity: addActivity
            };

        return service;

        function getActivities() {
            var deferred = $q.defer();

            sessionService.isLogged().then(function (credentials) {
                $http.post("/api/transactions", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId
                }).then(function (transactions) {
                    activities = transactions.data;
                    deferred.resolve(activities);
                });
            });

            return deferred.promise;
        }

        function addActivity(activity) {
            activities.splice(0, 0, {
                id: activity.id,
                type: activity.type,
                instrument: activity.instrument,
                units: activity.units,
                price: activity.price,
                pl: activity.pl,
                // PROFIT (PIPS)
                // PROFIT (%)
                accountBalance: activity.accountBalance,
                time: activity.time
            });
        }
    }

}());
