"use strict";

(function () {
    angular
        .module("argo")
        .factory("activityService", activityService);

    activityService.$inject = [];
    function activityService() {
        var activities = [],
            service = {
                getActivities: getActivities,
                addActivity: addActivity
            };

        return service;

        function getActivities() {
            return activities;
        }

        function addActivity(activity) {
            activities.push({
                ticket: activity.id,
                type: activity.type,
                market: activity.instrument,
                units: activity.units,
                price: activity.price,
                profitUSD: activity.pl,
                // PROFIT (PIPS)
                // PROFIT (%)
                balance: activity.accountBalance,
                datetime: activity.time
            });
        }
    }

}());
