<script setup lang="ts">
import TokenizationForm from './components/tokenization-form.ce.vue';
import TokenizationInput from './components/tokenization-input.vue';
</script>

<template>
  <tokenization-form :showbutton="true" :inputtype="'name'"  @validation-error="console.log('validation-error')">
    <template #cc-name>
        <span
          id="cc-name"
          class="form-field">
          <!--JUPITER Collect iframe for card name field will be here!-->
        </span>
      </template>
  </tokenization-form>
  <div style="margin: 20px;"></div>
  <tokenization-form :showbutton="true" :inputtype="'number'"  @validation-error="console.log('validation-error')">
    <template #cc-number>
        <span
          id="cc-number"
          class="form-field">
          <!--JUPITER Collect iframe for card name field will be here!-->
        </span>
      </template>
  </tokenization-form>


</template>
