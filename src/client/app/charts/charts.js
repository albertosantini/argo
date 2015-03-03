"use strict";

(function () {
    angular
        .module("argo")
        .controller("Charts", Charts);

    Charts.$inject = ["chartsService", "quotesService"];
    function Charts(chartsService, quotesService) {
        var vm = this;

        chartsService.getHistQuotes().then(function (candles) {
            vm.data = candles;
        });

        vm.feed = quotesService.getQuotes();
    }

}());
