import angular from "angular";

import { exposureComponent } from "./exposure.component";

export const exposure = angular
    .module("components.exposure", [])
    .component("exposure", exposureComponent)
    .name;
