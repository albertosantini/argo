import angular from "angular";

import { quotesComponent } from "./quotes.component";
import { QuotesService } from "./quotes.service";

export const quotes = angular
    .module("components.quotes", [])
    .component("quotes", quotesComponent)
    .service("QuotesService", QuotesService)
    .name;
