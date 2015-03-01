"use strict";

(function () {
    angular
        .module("argo")
        .controller("Activity", Activity);

    Activity.$inject = ["$scope", "sessionService", "activityService"];
    function Activity($scope, sessionService, activityService) {
        var vm = this;

        $scope.$watch(function () {
            return sessionService;
        }, function (session) {
            if (session.token) {
                activate();
            }
        }, true);

        function activate() {
            vm.activities = activityService.getActivities();
        }
    }

}());
