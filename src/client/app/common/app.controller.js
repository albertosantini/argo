export class AppController {
    $onInit() {
        this.tabSelectedIndex = 0;
    }

    next() {
        this.tabSelectedIndex = Math.min(this.tabSelectedIndex + 1, 6);
    }

    previous() {
        this.tabSelectedIndex = Math.max(this.tabSelectedIndex - 1, 0);
    }
}
AppController.$inject = [];
