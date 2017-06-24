import { Util } from "../../util";
import { SessionService } from "../session/session.service";

export class AccountsService {
    constructor(account) {
        if (!AccountsService.account) {
            AccountsService.account = account;
        }
    }

    static getAccount() {
        return AccountsService.account;
    }

    static refresh() {
        const credentials = SessionService.isLogged();

        if (!credentials) {
            return;
        }

        AccountsService.getAccounts({
            environment: credentials.environment,
            token: credentials.token,
            accountId: credentials.accountId
        });
    }

    static getAccounts({
        environment = "practice",
        token = "abc",
        accountId = null
    } = {}) {
        const api = accountId ? "/api/account" : "/api/accounts";

        return Util.fetch(api, {
            method: "post",
            body: JSON.stringify({
                environment,
                token,
                accountId
            })
        }).then(res => res.json()).then(data => {
            const accounts = data.accounts || data;

            if (data.message) {
                throw data.message;
            }

            if (!accounts.length) {
                Object.assign(AccountsService.account, data.account);

                AccountsService.account.timestamp = new Date();

                AccountsService.account.unrealizedPLPercent =
                    AccountsService.account.unrealizedPL /
                        AccountsService.account.balance * 100;

                if (!Object.keys(AccountsService.account.instruments).length) {
                    Util.fetch("/api/instruments", {
                        method: "post",
                        body: JSON.stringify({
                            environment,
                            token,
                            accountId
                        })
                    }).then(res => res.json()).then(instruments => {
                        AccountsService.account.instruments = instruments;
                        AccountsService.account.pips = {};
                        AccountsService.account.instruments.forEach(i => {
                            AccountsService.account.pips[i.name] =
                                Math.pow(10, i.pipLocation);
                        });

                        return AccountsService.account;
                    });
                }
            }

            return accounts;
        });
    }

    static setStreamingInstruments(settings) {
        AccountsService.account.streamingInstruments = Object.keys(settings)
            .filter(el => !!settings[el]);

        return AccountsService.account.streamingInstruments;
    }
}

AccountsService.account = null;
