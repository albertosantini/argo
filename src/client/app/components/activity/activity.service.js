"use strict";

{
    angular
        .module("components.activity")
        .factory("activityService", activityService);

    activityService.$inject = ["$http", "sessionService", "accountsService"];
    function activityService($http, sessionService, accountsService) {
        let activities = [];
        const service = {
            getActivities,
            addActivity
        };

        return service;

        function getActivities() {
            const account = accountsService.getAccount(),
                lastTransactionID = account.lastTransactionID;

            return sessionService.isLogged().then(
                credentials => $http.post("/api/transactions", {
                    environment: credentials.environment,
                    token: credentials.token,
                    accountId: credentials.accountId,
                    lastTransactionID
                }).then(transactions => {
                    activities = transactions.data.reverse();

                    return activities;
                }).catch(err => err.data)
            );
        }

        function addActivity(activity) {
            activities.splice(0, 0, {
                id: activity.id,
                type: activity.type,
                instrument: activity.instrument,
                units: activity.units,
                price: activity.price,
                pl: activity.pl,
                accountBalance: activity.accountBalance,
                time: activity.time
            });
        }
    }

}
