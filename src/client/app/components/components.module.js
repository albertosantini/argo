import angular from "angular";

import { account } from "./account/account.module";
import { accountsBottomsheet } from "./accounts-bottomsheet/accounts-bottomsheet.module";
import { activity } from "./activity/activity.module";
import { charts } from "./charts/charts.module";
import { dualColor } from "./dual-color/dual-color.module";
import { exposure } from "./exposure/exposure.module";
import { header } from "./header/header.module";
import { highlighter } from "./highlighter/highlighter.module";
import { news } from "./news/news.module";
import { ohlcChart } from "./ohlc-chart/ohlc-chart.module";
import { orderDialog } from "./order-dialog/order-dialog.module";
import { orders } from "./orders/orders.module";
import { plugins } from "./plugins/plugins.module";
import { positions } from "./positions/positions.module";
import { quotes } from "./quotes/quotes.module";
import { session } from "./session/session.module";
import { settingsDialog } from "./settings-dialog/settings-dialog.module";
import { slChart } from "./sl-chart/sl-chart.module";
import { streaming } from "./streaming/streaming.module";
import { toast } from "./toast/toast.module";
import { tokenDialog } from "./token-dialog/token-dialog.module";
import { trades } from "./trades/trades.module";

export const components = angular
    .module("components", [
        account,
        accountsBottomsheet,
        activity,
        charts,
        dualColor,
        exposure,
        header,
        highlighter,
        news,
        ohlcChart,
        orderDialog,
        orders,
        plugins,
        positions,
        quotes,
        session,
        settingsDialog,
        slChart,
        streaming,
        toast,
        tokenDialog,
        trades
    ])
    .name;
