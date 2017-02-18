import angular from "angular";

import { newsComponent } from "./news.component";
import { NewsService } from "./news.service";

export const news = angular
    .module("components.news", [])
    .component("news", newsComponent)
    .service("NewsService", NewsService)
    .name;
