"use strict";

{
    angular
        .module("components.session")
        .factory("sessionService", sessionService);

    sessionService.$inject = ["$q"];
    function sessionService($q) {
        const deferred = $q.defer(),
            credentials = {
                environment: null,
                token: null,
                accountId: null
            },
            service = {
                setCredentials,
                isLogged
            };

        return service;

        function setCredentials(session) {
            credentials.environment = session.environment;
            credentials.token = session.token;
            credentials.accountId = session.accountId;

            deferred.resolve(credentials);
        }

        function isLogged() {
            return deferred.promise;
        }
    }

}
