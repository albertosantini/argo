import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { NewsTemplate } from "./news.template";
import { NewsController } from "./news.controller";

export class NewsComponent {
    static bootstrap() {
        const render = hyperHTML.bind(Util.query("news"));

        this.newsController = new NewsController(render, NewsTemplate);
    }
}
