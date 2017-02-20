export class ActivityService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.activities = [];
    }

    getActivities() {
        const account = this.AccountsService.getAccount(),
            lastTransactionID = account.lastTransactionID;

        return this.SessionService.isLogged().then(
            credentials => this.$http.post("/api/transactions", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                lastTransactionID
            }).then(transactions => {
                this.activities = transactions.data.reverse();

                return this.activities;
            }).catch(err => err.data)
        );
    }

    addActivity(activity) {
        this.activities.splice(0, 0, {
            id: activity.id,
            type: activity.type,
            instrument: activity.instrument,
            units: activity.units,
            price: activity.price,
            pl: activity.pl,
            accountBalance: activity.accountBalance,
            time: activity.time
        });
    }
}
ActivityService.$inject = ["$http", "SessionService", "AccountsService"];
