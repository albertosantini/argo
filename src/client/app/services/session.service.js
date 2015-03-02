"use strict";

(function () {
    angular
        .module("argo")
        .factory("sessionService", sessionService);

    sessionService.$inject = ["$q"];
    function sessionService($q) {
        var deferred = $q.defer(),
            credentials = {
                environment: null,
                token: null,
                accountId: null
            },
            service = {
                getCredentials: getCredentials,
                setCredentials: setCredentials,
                isLogged: isLogged
            };

        return service;

        function getCredentials() {
            return credentials;
        }

        function setCredentials(session) {
            credentials.environment = session.environment;
            credentials.token = session.token;
            credentials.accountId = session.accountId;

            deferred.resolve();
        }

        function isLogged() {
            return deferred.promise;
        }
    }

}());
