"use strict";

{
    angular
        .module("components.positions")
        .component("positions", {
            controller: Positions,
            templateUrl: "app/components/positions/positions.html"
        });

    Positions.$inject = ["positionsService"];
    function Positions(positionsService) {
        const vm = this;

        positionsService.getPositions().then(positions => {
            vm.positions = positions;
        });
    }

}
