export class NewsController {
    constructor(NewsService) {
        this.NewsService = NewsService;
    }

    $onInit() {
        this.NewsService.getNews().then(news => {
            this.news = news;
        });
    }
}
NewsController.$inject = ["NewsService"];
