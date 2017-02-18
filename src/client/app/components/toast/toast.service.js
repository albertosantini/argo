export class ToastService {
    constructor($mdToast) {
        this.$mdToast = $mdToast;
    }

    show(message) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .textContent(message)
                .action("CLOSE")
                .position("right bottom")
                .hideDelay(10000)
        );
    }
}
ToastService.$inject = ["$mdToast"];
