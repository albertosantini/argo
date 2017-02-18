import angular from "angular";

import { SessionService } from "./session.service";

export const session = angular
    .module("components.session", [])
    .service("SessionService", SessionService)
    .name;
