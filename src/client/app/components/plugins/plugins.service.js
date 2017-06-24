import { Util } from "../../util";
import { SessionService } from "../session/session.service";
import { AccountsService } from "../account/accounts.service";

export class PluginsService {
    constructor(pluginsState) {
        if (!PluginsService.plugins) {
            PluginsService.plugins = pluginsState.plugins;
            PluginsService.pluginsInfo = pluginsState.pluginsInfo;
        }
    }

    static getPlugins() {
        return PluginsService.plugins;
    }

    static getPluginsInfo() {
        return PluginsService.pluginsInfo;
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return null;
        }

        return Util.fetch("/api/plugins", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId
            })
        }).then(res => res.json()).then(data => {
            for (const name in PluginsService.plugins) {
                if (PluginsService.plugins[name].toString()) {
                    delete PluginsService.plugins[name];
                }
            }

            Object.assign(PluginsService.plugins, data);

            PluginsService.pluginsInfo.count = Object.keys(
                PluginsService.plugins
            ).length;

            Object.keys(PluginsService.plugins).forEach(key => {
                if (PluginsService.plugins[key] === "enabled") {
                    PluginsService.plugins[key] = true;
                } else {
                    PluginsService.plugins[key] = false;
                }
            });
        });
    }

    static engagePlugins(plugs) {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return;
        }

        const account = AccountsService.getAccount();

        Util.fetch("/api/engageplugins", {
            method: "post",
            body: JSON.stringify({
                environment: credentials.environment,
                token: credentials.token,
                accountId: credentials.accountId,
                plugins: plugs,
                config: {
                    pips: account.pips
                }
            })
        });
    }
}

PluginsService.plugins = null;
PluginsService.pluginsInfo = null;
