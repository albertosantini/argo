"use strict";

{
    angular
        .module("components.activity")
        .component("activity", {
            controller: Activity,
            templateUrl: "app/components/activity/activity.html"
        });

    Activity.$inject = ["activityService"];
    function Activity(activityService) {
        const vm = this;

        activityService.getActivities().then(activities => {
            vm.activities = activities;
        });
    }

}
