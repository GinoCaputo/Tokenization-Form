import { defineCustomElement } from "vue";
import main from "./assets/main.css";

import VueTokenizationForm from "./components/tokenization-form.ce.vue";
console.log(VueTokenizationForm.styles);
export const TokenizationForm = defineCustomElement(VueTokenizationForm);

customElements.define("tokenization-input", TokenizationForm);

