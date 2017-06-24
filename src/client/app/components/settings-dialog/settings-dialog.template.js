import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class SettingsDialogTemplate {
    static update(render, state, events) {
        if (!state.settingsModalIsOpen) {
            Util.renderEmpty(render);
            return;
        }

        SettingsDialogTemplate.renderSettingsModal(render, state, events);
    }

    static renderSettingsModal(render, state, events) {
        /* eslint-disable indent */
        render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white h5 overflow-y-auto">
                <form class="measure center">
                    <fieldset id="login" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Settings Dialog</legend>${
                            Object.keys(state.instrs).map(instrument => {
                                const value = !!state.instrs[instrument];

                                return hyperHTML.wire()`<span class="flex flex-row justify-center justify-around code">
                                        <input id="toggleInstrumentSettings" type="checkbox"
                                            onchange="${e => {
                                                state.instrs[instrument] = e.target.checked;
                                            }}"
                                            checked="${value}"> ${instrument}
                                        </input>
                                    </span>
                                `;
                            })
                    }</fieldset>
                </form>

                <div class="flex flex-row justify-center justify-around">
                    <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="submit" value="Cancel"
                        onclick="${() => {
                            state.settingsModalIsOpen = false;
                        }}">

                    <input id="settingsOk" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        type="submit" value="Ok"
                        onclick="${events}">
                </div>
            </main>

            </div>
            </div>
        `;
        /* eslint-enable indent */
    }

}
