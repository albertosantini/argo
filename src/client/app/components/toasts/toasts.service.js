export class ToastsService {
    constructor(toasts) {
        if (!ToastsService.toasts) {
            ToastsService.toasts = toasts;
        }
    }

    static getToasts() {
        return ToastsService.toasts;
    }

    static addToast(message) {
        ToastsService.toasts.splice(0, 0, {
            date: (new Date()),
            message
        });

        if (ToastsService.timeout) {
            clearTimeout(ToastsService.timeout);
        }
        ToastsService.timeout = ToastsService.reset();
    }

    static reset() {
        return setTimeout(() => {
            while (ToastsService.toasts.length) {
                ToastsService.toasts.pop();
            }
        }, 10000);
    }
}

ToastsService.toasts = null;
ToastsService.timeout = null;
