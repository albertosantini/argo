"use strict";

(function () {
    angular
        .module("argo")
        .controller("Positions", Positions);

    Positions.$inject = ["positionsService"];
    function Positions(positionsService) {
        var vm = this;

        positionsService.getPositions().then(function (positions) {
            vm.positions = positions;
        });
    }

}());
