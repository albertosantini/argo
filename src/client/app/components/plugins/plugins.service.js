export class PluginsService {
    constructor($http, SessionService, AccountsService) {
        this.$http = $http;
        this.SessionService = SessionService;
        this.AccountsService = AccountsService;

        this.plugins = {};
        this.pluginsInfo = {
            count: 0
        };
    }

    getPlugins() {
        return this.plugins;
    }

    getPluginsInfo() {
        return this.pluginsInfo;
    }

    refresh() {
        this.SessionService.isLogged().then(credentials => {
            this.$http.post("/api/plugins", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            }).then(res => {
                let name;

                for (name in this.plugins) {
                    if (this.plugins.hasOwnProperty(name)) {
                        delete this.plugins[name];
                    }
                }
                angular.extend(this.plugins, res.data);
                this.pluginsInfo.count = Object.keys(this.plugins).length;

                Object.keys(this.plugins).forEach(key => {
                    if (this.plugins[key] === "enabled") {
                        this.plugins[key] = true;
                    } else {
                        this.plugins[key] = false;
                    }
                });
            });
        });
    }

    engagePlugins(plugs) {
        this.SessionService.isLogged().then(credentials => {
            const account = this.AccountsService.getAccount();

            this.$http.post("/api/engageplugins", {
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                plugins: plugs,
                config: {
                    pips: account.pips
                }
            });
        });
    }
}
PluginsService.$inject = ["$http", "SessionService", "AccountsService"];
