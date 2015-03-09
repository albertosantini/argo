"use strict";

(function () {
    angular
        .module("argo")
        .controller("News", News);

    News.$inject = ["newsService"];
    function News(newsService) {
        var vm = this;

        newsService.getNews().then(function (news) {
            vm.news = news;
        });
    }

}());
