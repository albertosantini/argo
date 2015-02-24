"use strict";

(function () {
    angular
        .module("argo")
        .controller("Quotes", Quotes);

    Quotes.$inject = ["quotesService"];
    function Quotes(quotesService) {
        var vm = this;

        vm.quotes = quotesService.getQuotes();
    }

}());
