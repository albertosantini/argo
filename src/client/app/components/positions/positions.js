"use strict";

(function () {
    angular
        .module("components.positions")
        .component("positions", {
            controller: Positions,
            templateUrl: "app/components/positions/positions.html"
        });

    Positions.$inject = ["positionsService"];
    function Positions(positionsService) {
        var vm = this;

        positionsService.getPositions().then(function (positions) {
            vm.positions = positions;
        });
    }

}());
