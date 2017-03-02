export class ToastsController {
    constructor(ToastsService) {
        this.ToastsService = ToastsService;
    }

    $onInit() {
        this.toasts = this.ToastsService.getToasts();
    }
}
ToastsController.$inject = ["ToastsService"];
