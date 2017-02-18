export class QuotesController {
    constructor(QuotesService) {
        this.QuotesService = QuotesService;
    }

    $onInit() {
        this.quotes = this.QuotesService.getQuotes();
    }
}
QuotesController.$inject = ["QuotesService"];
