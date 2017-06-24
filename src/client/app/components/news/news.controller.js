import Introspected from "introspected";

import { NewsService } from "../news/news.service";

export class NewsController {
    constructor(render, template) {

        this.state = Introspected({
            news: []
        }, state => template.update(render, state));

        this.newsService = new NewsService(this.state.news);
    }
}
