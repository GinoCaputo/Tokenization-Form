<script lang="ts" setup>
import { toRefs } from 'vue';
import arrowChecker from './arrow-checker.vue';
const props = defineProps<{
    coin: {
        money: number;
        formatted: string;
        name: string;
    };
}>();
const { coin } = toRefs(props);
</script>
<template>
    <Transition mode="out-in">
        <div class="inner" :key="coin.formatted">
            {{ coin.name }}
            <div class="price-info">
                <span>{{ coin.formatted }}</span>
                <!-- arrow checker -->
                <arrow-checker :name="coin.name" :amount="coin.money"/>
            </div>
        </div>
    </Transition>
</template>