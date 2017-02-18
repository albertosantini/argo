export class SessionService {
    constructor($q) {
        this.deferred = $q.defer();
        this.credentials = {
            environment: null,
            token: null,
            accountId: null
        };
    }

    setCredentials(session) {
        this.credentials.environment = session.environment;
        this.credentials.token = session.token;
        this.credentials.accountId = session.accountId;

        this.deferred.resolve(this.credentials);
    }

    isLogged() {
        return this.deferred.promise;
    }
}
SessionService.$inject = ["$q"];
