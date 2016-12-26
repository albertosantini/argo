"use strict";

{
    angular
        .module("components.news")
        .component("news", {
            controller: News,
            templateUrl: "app/components/news/news.html"
        });

    News.$inject = ["newsService"];
    function News(newsService) {
        const vm = this;

        newsService.getNews().then(news => {
            vm.news = news;
        });
    }

}
