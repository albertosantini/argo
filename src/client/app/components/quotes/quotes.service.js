import angular from "angular";

export class QuotesService {
    constructor(AccountsService) {
        this.AccountsService = AccountsService;

        this.quotes = {};
    }

    getQuotes() {
        return this.quotes;
    }

    updateTick(tick) {
        const account = this.AccountsService.getAccount(),
            streamingInstruments = account.streamingInstruments,
            pips = account.pips,
            instrument = tick.instrument;

        this.quotes[instrument] = {
            time: tick.time,
            ask: tick.ask,
            bid: tick.bid,
            spread: ((tick.ask - tick.bid) / pips[instrument]).toFixed(1)
        };


        if (!angular.equals(streamingInstruments, Object.keys(this.quotes))) {
            streamingInstruments.forEach(instr => {
                let temp;

                if (this.quotes.hasOwnProperty(instr)) {
                    temp = this.quotes[instr];
                    delete this.quotes[instr];
                    this.quotes[instr] = temp;
                }
            });
        }
    }

    reset() {
        let key;

        for (key in this.quotes) {
            if (this.quotes.hasOwnProperty(key)) {
                delete this.quotes[key];
            }
        }
    }
}
QuotesService.$inject = ["AccountsService"];
