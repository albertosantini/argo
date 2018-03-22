import hyperHTML from "hyperHTML";

import { Util } from "../../util.js";
import { SettingsDialogTemplate } from "./settings-dialog.template.js";
import { SettingsDialogController } from "./settings-dialog.controller.js";

export class SettingsDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("settings-dialog"));

        this.settingsDialogController = new SettingsDialogController(render, SettingsDialogTemplate, state);
    }
}
