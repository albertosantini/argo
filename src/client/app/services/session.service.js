"use strict";

(function () {
    angular
        .module("argo")
        .factory("sessionService", sessionService);

    sessionService.$inject = ["$q"];
    function sessionService($q) {
        var deferred = $q.defer(),
            service = {
                environment: null,
                token: null,
                accountId: null,
                setCredentials: setCredentials,
                isLogged: isLogged
            };

        return service;

        function setCredentials(session) {
            service.environment = session.environment;
            service.token = session.token;
            service.accountId = session.accountId;

            deferred.resolve();
        }

        function isLogged() {
            return deferred.promise;
        }
    }

}());
