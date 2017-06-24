import { Util } from "../../util";
import { SessionService } from "../session/session.service";

export class NewsService {
    constructor(news) {
        if (!NewsService.news) {
            NewsService.news = news;
        }
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return;
        }

        Util.fetch("/api/calendar", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token
            })
        }).then(res => res.json()).then(data => {
            NewsService.news.splice(0, NewsService.news.length);

            data.forEach(news => {
                news.timestamp *= 1000;
                NewsService.news.push(news);
            });
        }).catch(err => err.data);
    }
}

NewsService.news = null;
