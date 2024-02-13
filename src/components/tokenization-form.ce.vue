<script setup lang="ts">
import { reactive } from 'vue';
const emit = defineEmits(['validation-error']);

const props = defineProps<{
    showerror?: boolean
}>();

const form = reactive({
  name: '',
  cardNumber: '',
  cvc: '',
  expirationDate: ''
});
const validationErrors = reactive({
  name: '',
  cardNumber: '',
  cvc: '',
  expirationDate: ''
});
const validateCardNumber = () => {
  // Remove all non-digit characters
  let cardNumber = String(form.cardNumber)
  const digitsOnly = cardNumber.replace(/\D+/g, '');
  form.cardNumber = digitsOnly; // Update the form with cleaned input
  // Basic validation for length of card number
  if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
    validationErrors.cardNumber = '';
  } else {
    validationErrors.cardNumber = 'Card number must be between 13 to 19 digits';
    emit('validation-error', { field: 'cardNumber', message: validationErrors.cardNumber });
  }
};
// Name validation logic
const validateName = () => {
  validationErrors.name = form.name.trim().length > 0 ? '' : 'Name is required';
  if (validationErrors.name !== '') {
    emit('validation-error', { field: 'name', message: validationErrors.name });
}

};

// CVC validation logic
const validateCVC = () => {
  const cvcPattern = /^\d{3,4}$/;
  validationErrors.cvc = cvcPattern.test(form.cvc) ? '' : 'CVC must be 3 or 4 digits';
  if (validationErrors.cvc !== '') {
  emit('validation-error', { field: 'cvc', message: validationErrors.cvc });
}
};

// Expiration date validation logic
const validateExpirationDate = () => {
  const expirationDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const matches = form.expirationDate.match(expirationDatePattern);
  if (matches) {
    const today = new Date();
    const expYear = Number(matches[2]); // Convert string to number
    const expMonth = Number(matches[1]) - 1; // Convert string to number and adjust month for 0 index
    const expDate = new Date(Number(`20${expYear}`), expMonth);
    validationErrors.expirationDate = (expDate > today) ? '' : 'Expiration date must be in the future';
    emit('validation-error', { field: 'expirationDate', message: validationErrors.expirationDate });
  } else {
    validationErrors.expirationDate = 'Expiration date must be in MM/YY format';
    emit('validation-error', { field: 'expirationDate', message: validationErrors.expirationDate });

  }
}
const filterNumeric = (event: any) => {
  const value = event.target.value;
  form.cardNumber = value.replace(/\D/g, '');
};
// Mask the expiration date input
const maskExpirationDate = (event: any) => {
  let value = event.target.value;
  const cleaned = value.replace(/\D+/g, '');
  
  // Break the string into parts based on the expected MM/YY format
  let month = cleaned.substring(0, 2);
  let year = cleaned.substring(2, 4);
  
  // Reconstruct the value, inserting a slash where appropriate
  value = month + (year ? '/' + year : '');
  form.expirationDate = value;
};
const validateForm = () => {
  validateCardNumber();
  validateName();
  validateCVC();
  validateExpirationDate();
}

const submitForm = () => {
  validateForm();
  // ... call validation for other fields ...

  if (!Object.values(validationErrors).some(Boolean)) {
    // If there are no validation errors, proceed with the submission
    console.log('Form submitted', form);
  } else {
    // Handle the invalid form case
    console.log('Validation errors', validationErrors);
  }
};
</script>

<template>
  <div class="container">
    <slot name="header"></slot>
    <h2>tokenization Form</h2>
    <form @submit.prevent="submitForm">
      <!-- Name Field -->
      <div class="mb-4">
        <label for="name" class="label">Name</label>
        <input part="input" type="text" id="name" v-model.trim="form.name" @blur="validateName"
              :class="{'border-red-500': validationErrors.name}" required>
      </div>

      <!-- CC Field -->
      <div class="mb-4">
        <label for="cc" class="label">Credit Card</label>
        <input part="input" type="number" id="cc" v-model.trim="form.cardNumber" @blur="validateCardNumber"
               :class="{'border-red-500': validationErrors.cardNumber}" required>
      </div>

      <!-- CVC Field -->
      <div class="mb-4">
        <label for="cvc" class="label">CVC</label>
        <input part="input" type="text" id="cvc" v-model="form.cvc" @input="filterNumeric" @blur="validateCVC"
              :class="{'border-red-500': validationErrors.cvc}" required>
      </div>

      <!-- Expiration Date Field -->
      <div class="mb-4">
        <label for="expirationDate" class="label">Expiration date</label>
        <input part="input" type="text" id="expirationDate" v-model="form.expirationDate" @input="maskExpirationDate"  @blur="validateExpirationDate"
              :class="{'border-red-500': validationErrors.expirationDate}" required>
      </div>
      <div>
      </div>
      <div class="error-info" v-if="showerror">
        <h3>Error feedback</h3>
        <p class="text-red-500" v-if="validationErrors.name">{{ validationErrors.name }}</p>
        <p class="text-red-500" v-if="validationErrors.cardNumber">{{ validationErrors.cardNumber }}</p>
        <p class="text-red-500" v-if="validationErrors.cvc">{{ validationErrors.cvc }}</p>
        <p class="text-red-500" v-if="validationErrors.expirationDate">{{ validationErrors.expirationDate }}</p>
      </div>
      <div>
        <button part="button">Try tokenization</button>
      </div>
    </form>       
    <slot name="footer"></slot>



  </div>
</template>

<style scoped>

* {
  font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;

}
input {
  display: block;
  display: block;
    width: 100%;
    height: 40px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin-bottom: 8px;
}
form {
  width: 100%;
}
button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  cursor: pointer;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
}
.border-red-500 {
  border-color: red;
}
.text-red-500 {
  color: red
}
</style>
