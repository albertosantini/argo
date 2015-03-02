"use strict";

(function () {
    angular
        .module("argo")
        .controller("Activity", Activity);

    Activity.$inject = ["activityService"];
    function Activity(activityService) {
        var vm = this;

        activityService.getActivities().then(function (activities) {
            vm.activities = activities;
        });
    }

}());
