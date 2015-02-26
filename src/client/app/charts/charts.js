"use strict";

(function () {
    angular
        .module("argo")
        .controller("Charts", Charts);

    Charts.$inject = ["$scope", "sessionService", "chartsService"];
    function Charts($scope, sessionService, chartsService) {
        var vm = this;

        vm.data = [];
        vm.feed = {};

        $scope.$watch(function () {
            return sessionService;
        }, function (session) {
            if (session.token) {
                activate();
            }
        }, true);

        function activate() {
            chartsService.getHistQuotes().then(function (res) {
                vm.data = res.data;
            });

            // vm.feed = chartsService.getQuotes();
        }
    }

}());
