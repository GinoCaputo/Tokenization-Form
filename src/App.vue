<script setup lang="ts">
import TokenizationForm from './components/tokenization-form.ce.vue';
</script>

<template>
  <tokenization-form>
    <div slot="cc-name">
        <span
          id="cc-name"
          class="form-field">
          <!--JUPITER Collect iframe for card name field will be here!-->
        </span>
      </div>
      <div slot="cc-number">
        <span id="cc-number" class="form-field"
        part="input">
          <!--JUPITER Collect iframe for card number field will be here!-->
        </span>
      </div>
      <div slot="cc-cvc">
        <span id="cc-cvc" class="form-field"
        part="input">
          <!--JUPITER Collect iframe for CVC field will be here!-->
        </span>
      </div>
      <div slot="cc-expiration-date">
        <span id="cc-expiration-date" class="form-field"
        part="input">
          <!--JUPITER Collect iframe for expiration date field will be here!-->
        </span>
      </div>
  </tokenization-form>
</template>
