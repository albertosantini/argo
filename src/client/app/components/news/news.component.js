import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { NewsTemplate } from "./news.template.js";
import { NewsController } from "./news.controller.js";

export class NewsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("news"));

        this.newsController = new NewsController(render, NewsTemplate);
    }
}
