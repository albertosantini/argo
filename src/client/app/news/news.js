"use strict";

(function () {
    angular
        .module("argo")
        .component("news", {
            controller: News,
            templateUrl: "app/news/news.html"
        });

    News.$inject = ["newsService"];
    function News(newsService) {
        var vm = this;

        newsService.getNews().then(function (news) {
            vm.news = news;
        });
    }

}());
