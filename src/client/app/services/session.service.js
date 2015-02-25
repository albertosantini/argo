"use strict";

(function () {
    angular
        .module("argo")
        .factory("sessionService", sessionService);

    sessionService.$inject = [];
    function sessionService() {
        var session = {
            environment: null,
            token: null,
            accountId: null
        }, service = {
            get: get,
            set: set
        };

        return service;

        function get() {
            return session;
        }

        function set(currentSession) {
            session.environment = currentSession && currentSession.environment;
            session.token = currentSession && currentSession.token;
            session.accountId = currentSession && currentSession.accountId;
        }
    }

}());
