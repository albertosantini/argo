"use strict";

(function () {
    angular
        .module("components.activity")
        .component("activity", {
            controller: Activity,
            templateUrl: "app/components/activity/activity.html"
        });

    Activity.$inject = ["activityService"];
    function Activity(activityService) {
        var vm = this;

        activityService.getActivities().then(function (activities) {
            vm.activities = activities;
        });
    }

}());
