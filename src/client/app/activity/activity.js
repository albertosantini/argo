"use strict";

(function () {
    angular
        .module("argo")
        .component("activity", {
            controller: Activity,
            templateUrl: "app/activity/activity.html"
        });

    Activity.$inject = ["activityService"];
    function Activity(activityService) {
        var vm = this;

        activityService.getActivities().then(function (activities) {
            vm.activities = activities;
        });
    }

}());
