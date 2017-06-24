import hyperHTML from "hyperHTML";

import { Util } from "../../util";
import { SettingsDialogTemplate } from "./settings-dialog.template";
import { SettingsDialogController } from "./settings-dialog.controller";

export class SettingsDialogComponent {
    static bootstrap(state) {
        const render = hyperHTML.bind(Util.query("settings-dialog"));

        this.settingsDialogController = new SettingsDialogController(render, SettingsDialogTemplate, state);
    }
}
