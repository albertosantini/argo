"use strict";

(function () {
    angular
        .module("argo")
        .component("positions", {
            controller: Positions,
            templateUrl: "app/positions/positions.html"
        });

    Positions.$inject = ["positionsService"];
    function Positions(positionsService) {
        var vm = this;

        positionsService.getPositions().then(function (positions) {
            vm.positions = positions;
        });
    }

}());
