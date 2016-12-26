"use strict";

{
    angular
        .module("components.quotes")
        .component("quotes", {
            controller: Quotes,
            templateUrl: "app/components/quotes/quotes.html"
        });

    Quotes.$inject = ["quotesService"];
    function Quotes(quotesService) {
        const vm = this;

        vm.quotes = quotesService.getQuotes();
    }

}
