export class ToastsService {
    constructor($timeout) {
        this.$timeout = $timeout;

        this.toasts = [];
        this.timeout = null;
    }

    getToasts() {
        return this.toasts;
    }

    addToast(message) {
        this.toasts.splice(0, 0, {
            date: new Date(),
            message
        });

        if (this.timeout) {
            this.$timeout.cancel(this.timeout);
        }
        this.timeout = this.reset();
    }

    reset() {
        return this.$timeout(() => {
            this.toasts.length = 0;
        }, 10000);
    }
}
ToastsService.$inject = ["$timeout"];
