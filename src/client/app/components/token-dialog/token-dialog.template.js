import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class TokenDialogTemplate {
    static update(render, state, events) {
        if (!state.tokenModalIsOpen) {
            Util.renderEmpty(render);
            return;
        }

        if (!state.accounts.length) {
            TokenDialogTemplate.renderTokenModal(render, state, events);
        } else {
            TokenDialogTemplate.renderAccountsListModal(render, state, events);
        }
    }

    static renderTokenModal(render, state, events) {
        /* eslint-disable indent */
        render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Token Dialog</legend>

                        <div class="flex flex-row items-center mb2 justify-between">
                            <label for="practice" class="lh-copy">Practice</label>
                            <input class="mr2" type="radio" name="environment" value="practice"
                                checked="${state.tokenInfo.environment === "practice"}"
                                onchange="${e => {
                                    state.tokenInfo.environment = e.target.value.trim();
                                }}">

                        </div>
                        <div class="flex flex-row items-center justify-between mb2">
                            <label for="live" class="lh-copy">Live</label>
                            <input class="mr2" type="radio" name="environment" value="live"
                                checked="${state.tokenInfo.environment === "live"}"
                                onchange="${e => {
                                    state.tokenInfo.environment = e.target.value.trim();
                                }}">
                        </div>

                        <div class="mv3">
                            <input class="b pa2 ba bg-transparent w-100"
                                placeholder="Token" name="token" id="token"
                                oninput="${e => {
                                    state.tokenInfo.token = e.target.value.trim();
                                }}">
                        </div>
                    </fieldset>

                    <div class="flex flex-row items-center justify-around">
                        <input id="loginCancel" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Cancel"
                            onclick="${() => {
                                state.tokenModalIsOpen = false;
                            }}">

                        <input id="loginOk" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Ok"
                            onclick="${events}">
                    </div>
                </form>
            </main>

            </div>
            </div>
        `;
        /* eslint-enable indent */
    }

    static renderAccountsListModal(render, state, events) {
        /* eslint-disable indent */
        render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Accounts List</legend>
                    </fieldset>

                    <div class="flex flex-row items-center justify-around">${
                        state.accounts.map((account, index) => hyperHTML.wire(account, ":li")`
                            <input id="${`selectAccount-${index}`}"
                                class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="button" value="${account.id}"
                                onclick="${e => events(e, index)}">
                    `)}</div>
                </form>
            </main>

            </div>
            </div>
        `;
        /* eslint-enable indent */
    }
}
