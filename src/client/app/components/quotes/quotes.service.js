import { AccountsService } from "../account/accounts.service";

export class QuotesService {
    constructor(quotes) {
        if (!QuotesService.quotes) {
            QuotesService.quotes = quotes;
        }
    }

    static getQuotes() {
        return QuotesService.quotes;
    }

    static updateTick(tick) {
        const account = AccountsService.getAccount(),
            streamingInstruments = account.streamingInstruments,
            pips = account.pips,
            instrument = tick.instrument,
            lenStreamingInstruments = Object.keys(streamingInstruments).length,
            lenQuotesInstruments = Object.keys(QuotesService.quotes).length;

        if (lenStreamingInstruments !== lenQuotesInstruments) {
            streamingInstruments.forEach(instr => {
                QuotesService.quotes[instr].instrument = instr;
            });
        }

        QuotesService.quotes[instrument].time = tick.time;
        QuotesService.quotes[instrument].ask = tick.ask;
        QuotesService.quotes[instrument].bid = tick.bid;
        QuotesService.quotes[instrument].spread =
            ((tick.ask - tick.bid) / pips[instrument]).toFixed(1);
    }

    static reset() {
        for (const instr in QuotesService.quotes) {
            if (QuotesService.quotes[instr].instrument === instr) {
                delete QuotesService.quotes[instr];
            }
        }
    }
}

QuotesService.quotes = null;
