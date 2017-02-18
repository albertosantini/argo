import angular from "angular";

import { StreamingService } from "./streaming.service";

export const streaming = angular
    .module("components.streaming", [])
    .service("StreamingService", StreamingService)
    .name;
