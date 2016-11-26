"use strict";

(function () {
    angular
        .module("components.quotes")
        .component("quotes", {
            controller: Quotes,
            templateUrl: "app/components/quotes/quotes.html"
        });

    Quotes.$inject = ["quotesService"];
    function Quotes(quotesService) {
        var vm = this;

        vm.quotes = quotesService.getQuotes();
    }

}());
