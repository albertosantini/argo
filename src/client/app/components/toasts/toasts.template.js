import { Util } from "../../util";

export class ToastsTemplate {
    static update(render, state) {
        if (!state.toasts.length) {
            Util.renderEmpty(render);
            return;
        }

        /* eslint-disable indent */
        render`
            <table class="f6 ba" cellspacing="0">
                <tbody>${
                    state.toasts.map(toast => `<tr>
                        <td class="b--black-20 pr2"> ${Util.getHHMMSSfromDate(toast.date)} </td>
                        <td class="b--black-20 pl2"> ${toast.message} </td>
                    </tr>`)}</tbody>
            </table>
        `;
        /* eslint-enable indent */
    }
}
