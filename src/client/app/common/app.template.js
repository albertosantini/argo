import { Util } from "../util";

export class AppTemplate {
    static update(render, state) {
        const tabClasses = "f6 f5-l pointer bg-animate black-80 hover-bg-light-blue dib pa3 ph4-l";
        const selectedTabClasses = `${tabClasses} bg-blue`;
        const isTradesTab = state.tabSelectedIndex === 0;
        const isOrdersTab = state.tabSelectedIndex === 1;
        const isPositionsTab = state.tabSelectedIndex === 2;
        const isExposureTab = state.tabSelectedIndex === 3;
        const isActivityTab = state.tabSelectedIndex === 4;
        const isNewsTab = state.tabSelectedIndex === 5;
        const isPluginsTab = state.tabSelectedIndex === 6;

        /* eslint-disable indent */
        render`
            <header></header>

            <nav class="bt bb tc mw9 center shadow-2 tracked">
                <a class="${isTradesTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 0;
                    }}">Trades</a>
                <a class="${isOrdersTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 1;
                    }}">Orders</a>
                <a class="${isPositionsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 2;
                    }}">Positions</a>
                <a class="${isExposureTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 3;
                    }}">Exposures</a>
                <a class="${isActivityTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 4;
                    }}">Activity</a>
                <a class="${isNewsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 5;
                    }}">News</a>
                <a class="${isPluginsTab ? selectedTabClasses : tabClasses}"
                    onclick="${() => {
                        state.tabSelectedIndex = 6;
                    }}">Plugins</a>
            </nav>

            <div class="flex flex-wrap-s flex-wrap-m ma2 pa2">
                <div class="flex flex-wrap flex-column min-w-25">
                    <account class="mb4"></account>
                    <quotes class="mb4"></quotes>
                    <toasts></toasts>
                </div>
                <div class="flex flex-wrap flex-column min-w-75">
                    <div class="ma2 pa2">
                        <trades style="${Util.show(isTradesTab)}"></trades>
                        <orders style="${Util.show(isOrdersTab)}"></orders>
                        <positions style="${Util.show(isPositionsTab)}"></positions>
                        <exposure style="${Util.show(isExposureTab)}"></exposure>
                        <activity style="${Util.show(isActivityTab)}"></activity>
                        <news style="${Util.show(isNewsTab)}"></news>
                        <plugins style="${Util.show(isPluginsTab)}"></plugins>
                    </div>
                    <charts></charts>
                </div>
            </div>
        `;
        /* eslint-enable indent */
    }
}
