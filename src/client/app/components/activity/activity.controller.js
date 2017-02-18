export class ActivityController {
    constructor(ActivityService) {
        this.ActivityService = ActivityService;
    }

    $onInit() {
        this.ActivityService.getActivities().then(activities => {
            this.activities = activities;
        });
    }
}
ActivityController.$inject = ["ActivityService"];
