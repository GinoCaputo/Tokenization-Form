<script lang="ts" setup>
import { reactive, ref } from 'vue';
import CoinChecker from './coin-checker.vue'
const props = defineProps<{
    pair?: string
    background?: string
}>();
const url = 'https://api.coinbase.com/v2/prices'
const btcPair = 'BTC-USD'
const ethPair = 'ETH-USD'

interface moneyFormat {
    formatted: string
    money: number
    name: string
}

const btc = reactive({} as moneyFormat);
const date = ref('');
const eth = reactive({} as moneyFormat);
const pass = reactive({} as moneyFormat);
async function grabPrices(pair: string): Promise<moneyFormat> {
    const btcInfo = await fetch(`${url}/${pair}/buy`);
    const money = await btcInfo.json();
    return {
        money: parseFloat(money.data.amount),
        formatted: new Intl.NumberFormat("en-us", {
            style: "currency",
            currency: "USD"
        }).format(money.data.amount),
        name: pair.split("-")[0]
    };
}

setValues();
async function setValues(): Promise<void> {
    const btcValue = await grabPrices(btcPair);
    const ethValue = await grabPrices(ethPair);
    btc.name = btcValue.name;
    btc.money = btcValue.money;
    btc.formatted = btcValue.formatted;

    eth.name = ethValue.name;
    eth.money = ethValue.money;
    eth.formatted = ethValue.formatted;

    if (props.pair) {
        const pairValue = await grabPrices(props.pair);
        pass.name = pairValue.name;
        pass.money = pairValue.money;
        pass.formatted = pairValue.formatted;
    }

    date.value = new Date().toString();
}
setInterval(setValues, 5000)
</script>
<template>
    <slot name="header"></slot>
    <section>
        <coin-checker :coin="btc"></coin-checker>
        <coin-checker :coin="eth"></coin-checker>
        <coin-checker v-if="pair" :coin="pass"></coin-checker>
    </section>
    <div class="sub">
        last Update: <span>{{ date }}</span>
    </div>
    <slot name="footer"></slot>
</template>
<style>
.sub {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 2.5rem;
    margin: 0 auto;
    gap: 1rem;
}
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
.inner{
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border: 1px solid black;
    box-shadow: 0 3px 10px rgb(0 0 0 /0.2);
}
.price-info {
    display: flex;
    gap: 1.2rem;
}
svg {
    width: 30px;
}

.up {
    fill: green;
}

.down {
    fill: red;
}
</style>
