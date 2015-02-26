"use strict";

(function () {
    angular
        .module("argo")
        .factory("sessionService", sessionService);

    sessionService.$inject = [];
    function sessionService() {
        var service = {
            environment: null,
            token: null,
            accountId: null
        };

        return service;
    }

}());
