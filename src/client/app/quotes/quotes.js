"use strict";

(function () {
    angular
        .module("argo")
        .component("quotes", {
            controller: Quotes,
            templateUrl: "app/quotes/quotes.html"
        });

    Quotes.$inject = ["quotesService"];
    function Quotes(quotesService) {
        var vm = this;

        vm.quotes = quotesService.getQuotes();
    }

}());
