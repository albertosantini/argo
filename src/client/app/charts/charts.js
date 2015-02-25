"use strict";

(function () {
    angular
        .module("argo")
        .controller("Charts", Charts);

    Charts.$inject = ["sessionService"];
    function Charts(sessionService) {
        var vm = this;

        vm.session = sessionService.get();
    }

}());
