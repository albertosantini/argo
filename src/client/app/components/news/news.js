"use strict";

(function () {
    angular
        .module("components.news")
        .component("news", {
            controller: News,
            templateUrl: "app/components/news/news.html"
        });

    News.$inject = ["newsService"];
    function News(newsService) {
        var vm = this;

        newsService.getNews().then(function (news) {
            vm.news = news;
        });
    }

}());
