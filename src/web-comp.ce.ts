import { defineCustomElement } from "vue";
import main from "./assets/main.css";

import VueCoinTracker from "./components/coin-tracker.ce.vue";
console.log(VueCoinTracker.styles);
export const CoinTracker = defineCustomElement(VueCoinTracker);

customElements.define("coin-tracker", CoinTracker);

