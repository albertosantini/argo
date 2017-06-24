export class SessionService {
    static setCredentials(session) {
        SessionService.credentials.environment = session.environment;
        SessionService.credentials.token = session.token;
        SessionService.credentials.accountId = session.accountId;
    }

    static isLogged() {
        if (SessionService.credentials.token) {
            return SessionService.credentials;
        }

        return null;
    }
}

SessionService.credentials = {
    environment: null,
    token: null,
    accountId: null
};
