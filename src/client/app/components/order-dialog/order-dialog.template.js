import hyperHTML from "hyperHTML";

import { Util } from "../../util";

export class OrderDialogTemplate {
    static update(render, state, events) {
        if (!state.orderModalIsOpen) {
            Util.renderEmpty(render);
            return;
        }

        OrderDialogTemplate.renderOrderModal(render, state, events);
    }

    static renderOrderModal(render, state, events) {
        /* eslint-disable indent */
        render`
            <div class="fixed absolute--fill bg-black-70 z5">
            <div class="fixed absolute-center z999">

            <main class="pa4 black-80 bg-white">
                <form class="measure center">
                    <fieldset id="order" class="ba b--transparent ph0 mh0">
                        <legend class="f4 fw6 ph0 mh0 center">Order Dialog</legend>

                        <div class="flex flex-row justify-between vh-50">

                            <div class="flex flex-column items-start justify-between ma2">

                                <div>
                                    <input type="radio" name="marketOrder" value="MARKET"
                                        checked="${state.orderInfo.type === "MARKET"}"
                                        onchange="${e => {
                                            state.orderInfo.type = e.target.value.trim();
                                        }}">
                                    <label for="marketOrder" class="lh-copy">Market</label>
                                    <input type="radio" name="marketOrder" value="LIMIT"
                                        checked="${state.orderInfo.type === "LIMIT"}"
                                        onchange="${e => {
                                            state.orderInfo.type = e.target.value.trim();
                                        }}">
                                    <label for="limitOrder" class="lh-copy">Limit</label>
                                </div>

                                <div>
                                    <input type="radio" name="buy" value="buy"
                                        checked="${state.orderInfo.side === "buy"}"
                                        onchange="${e => {
                                            state.orderInfo.side = e.target.value.trim();
                                        }}">
                                    <label for="buy" class="lh-copy">Buy</label>
                                    <input type="radio" name="sell" value="sell"
                                        checked="${state.orderInfo.side === "sell"}"
                                        onchange="${e => {
                                            state.orderInfo.side = e.target.value.trim();
                                        }}">
                                    <label for="sell" class="lh-copy">Sell</label>
                                </div>

                                <div>
                                    <select id="market" onchange="${e => events(e,
                                            e.target.value.trim())}">${

                                        state.orderInfo.instruments.map(instrument => hyperHTML.wire()`
                                        <option value="${instrument}" selected="${state.orderInfo.selectedInstrument === instrument}">
                                            ${instrument}
                                        </option>
                                    `)}</select>
                                </div>

                                <input class="mw4" placeholder="Units" name="units" type="number"
                                    value="${state.orderInfo.units}"
                                    oninput="${e => {
                                        state.orderInfo.units = e.target.value.trim();
                                    }}">

                                <div class="w4">
                                    <label for="quote" class="lh-copy">Quote</label>
                                    <input class="mw4" placeholder="Quote"
                                        name="quote" type="number"
                                        oninput="${e => {
                                            state.orderInfo.quote = e.target.value.trim();
                                        }}"
                                        disabled="${state.orderInfo.type === "MARKET"}"
                                        step="${state.step}">
                                </div>

                                <div style="${Util.show(state.orderInfo.type === "LIMIT")}">
                                    <select id="expire" onchange="${e => events(e,
                                            e.target.value.trim())}">${

                                        state.orderInfo.expires.map(expiry => hyperHTML.wire()`
                                        <option value="${expiry.value}" selected="${state.orderInfo.selectedExpire === expiry.value}">
                                            ${expiry.label}
                                        </option>
                                    `)}</select>
                                </div>

                            </div>

                            <div class="flex flex-column items-end justify-between ma2">

                                <div>
                                    <input type="radio" name="price" value="price"
                                        checked="${state.orderInfo.measure === "price"}"
                                        onchange="${e => {
                                            state.orderInfo.measure = e.target.value.trim();
                                        }}">
                                    <label for="price" class="lh-copy">Price</label>
                                    <input type="radio" name="pips" value="pips"
                                        checked="${state.orderInfo.measure === "pips"}"
                                        onchange="${e => {
                                            state.orderInfo.measure = e.target.value.trim();
                                        }}">
                                    <label for="pips" class="lh-copy">PIPS</label>
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isLowerBound}"
                                        onchange="${e => {
                                            state.orderInfo.isLowerBound = e.target.checked;
                                        }}">
                                    <label for="lowerBound" class="lh-copy">Lower Bound</label>
                                    <input class="mw4" placeholder="Lower Bound"
                                        name="lowerBound" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.lowerBound = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isLowerBound}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isUpperBound}"
                                        onchange="${e => {
                                            state.orderInfo.isUpperBound = e.target.checked;
                                        }}">
                                    <label for="upperBound" class="lh-copy">Upper Bound</label>
                                    <input class="mw4" placeholder="Upper Bound"
                                        name="upperBound" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.upperBound = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isUpperBound}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isTakeProfit}"
                                        onchange="${e => {
                                            state.orderInfo.isTakeProfit = e.target.checked;
                                        }}">
                                    <label for="takeProfit" class="lh-copy">Take Profit</label>
                                    <input class="mw4" placeholder="Take Profit"
                                        name="takeProfit" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.takeProfit = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isTakeProfit}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isStopLoss}"
                                        onchange="${e => {
                                            state.orderInfo.isStopLoss = e.target.checked;
                                        }}">
                                    <label for="stopLoss" class="lh-copy">Stop Loss</label>
                                    <input class="mw4" placeholder="Stop Loss"
                                        name="stopLoss" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.stopLoss = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isStopLoss}"
                                        step="${state.orderInfo.step}">
                                </div>

                                <div class="w4">
                                    <input type="checkbox" checked="${state.orderInfo.isTrailingStop}"
                                        onchange="${e => {
                                            state.orderInfo.isTrailingStop = e.target.checked;
                                        }}">
                                    <label for="trailingStop" class="lh-copy">Trailing Stop</label>
                                    <input class="mw4" placeholder="Trailing Stop"
                                        name="trailingStop" type="number" min="0"
                                        oninput="${e => {
                                            state.orderInfo.trailingStop = e.target.value.trim();
                                        }}"
                                        disabled="${!state.orderInfo.isTrailingStop}"
                                        step="${state.orderInfo.step}">
                                </div>

                            </div>

                        </div>

                    </fieldset>

                    <div class="flex flex-row items-center justify-around">
                        <input id="orderSubmit" class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Submit" onclick="${events}">

                        <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button" value="Close"
                            onclick="${() => {
                                state.orderModalIsOpen = false;
                            }}">
                    </div>

                </form>
            </main>

            </div>
            </div>
        `;
        /* eslint-enable indent */
    }

}
