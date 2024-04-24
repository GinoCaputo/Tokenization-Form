<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { loadVGSCollect } from "@vgs/collect-js";

const props = defineProps<{
    inputType: 'text' | 'card-number' | 'card-security-code' | 'card-expiration-date',
    showbutton?: boolean,
}>();

let form = ref({} as any);
let formState = reactive({
  CreditCardNumber: { errorMessages: [] },
  Cvv: { errorMessages: [] },
  ExpirationDate: { errorMessages: [] },
  CardHolderName: { errorMessages: [] },
});

onMounted(async () => {
  const collect: any = await loadVGSCollect({
    vaultId: "tntne5koztu",
    environment: "sandbox",
    version: "2.7.0",
  }).catch((e) => {});
  form = collect.init((state: any) => {
    if (
      state.CreditCardNumber &&
      state.Cvv &&
      state.ExpirationDate &&
      state.CardHolderName
    )
      formState = state;
  });

  // Initialize the form field based on the inputType
  switch (props.inputType) {
    case 'text':
      form.field("#cc-name", {
        type: "text",
        name: "CardHolderName",
        placeholder: "Joe Business",
        validations: ["required"],
      });
      break;
    case 'card-number':
      form.field("#cc-number", {
        type: "card-number",
        name: "CreditCardNumber",
        successColor: "#4F8A10",
        errorColor: "#D8000C",
        placeholder: "4111 1111 1111 1111",
        validations: ["required", "validCardNumber"],
      });
      break;
    case 'card-security-code':
      form.field("#cc-cvc", {
        type: "card-security-code",
        name: "Cvv",
        placeholder: "344",
        validations: ["required", "validCardSecurityCode"],
      });
      break;
    case 'card-expiration-date':
      form.field("#cc-expiration-date", {
        type: "card-expiration-date",
        yearLength: 2,
        name: "ExpirationDate",
        placeholder: "01 / 25",
        serializers: [
          {
            name: "separate",
            options: {
              monthName: "ExpirationMonth",
              yearName: "ExpirationYear",
            },
          },
        ],
        validations: ["required", "validCardExpirationDate"],
      });
      break;
  }
});
</script>

<template>
  <main>
    <div class="row">
      <div class="col-md-12">
        <div class="row card card-outline-secondary" part="card">
          <div class="card-body">
            <form id="cc-form">
              <div part="cc-name">
                <div class="form-group">
                  <label for="cc-name">Name</label>
                  <slot name="cc-name"></slot>
                </div>
              </div>
              <div part="cc-number">
                <div class="form-group">
                  <label for="cc-number">Card number</label>
                  <slot name="cc-number"></slot>
                </div>
              </div>
              <div part="cc-expiration-date">
                <div class="form-group">
                  <label for="cc-expiration-date">Expiration</label>
                  <slot name="cc-expiration-date"></slot>
                </div>
              </div>
              <div part="cc-cvc">
                <div class="form-group">
                  <label for="cc-cvc">CVC</label>
                  <slot name="cc-cvc"></slot>
                </div>
              </div>

              <!-- Submit credit card form button
              <div>
                <button
                  part="button"
                  id="submitButton"
                  class="btn btn-success btn-block ml-auto"
                  @click="validateForm($event)"
                  :disabled="isButtonDisabled"
                  v-if="showbutton"
                >
                  {{ submitButtonText }}
                </button>
              </div> -->
            </form>
            <!-- <div v-if="errorsVisible" id="errors">
              <div
                class="error-msg"
                v-if="formState.CreditCardNumber.errorMessages.length > 0"
              >
                Card number {{ formState.CreditCardNumber.errorMessages[0] }}
              </div>
              <div
                class="error-msg"
                v-if="formState.Cvv.errorMessages.length > 0"
              >
                CVC {{ formState.Cvv.errorMessages[0] }}
              </div>
              <div
                class="error-msg"
                v-if="formState.ExpirationDate.errorMessages.length > 0"
              >
                Expiration date {{ formState.ExpirationDate.errorMessages[0] }}
              </div>
              <div
                class="error-msg"
                v-if="formState.CardHolderName.errorMessages.length > 0"
              >
                Name {{ formState.CardHolderName.errorMessages[0] }}
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";

span[id*="cc-"] {
  display: block;
  height: 40px;
  margin-bottom: 15px;
}

span[id*="cc-"] iframe {
  height: 100%;
  width: 100%;
}

pre {
  font-size: 12px;
}

.form-field {
  display: block;
  width: 100%;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-field iframe {
  border: 0 none transparent;
  height: 100%;
  vertical-align: middle;
  width: 100%;
}

p {
  margin-bottom: 10px;
}

#errors div {
  font-size: 11px;
  color: #ff1721;
  padding: 5px 0;
}

#errors div.error-msg {
  font-weight: 400;
  letter-spacing: 0;
  font-style: normal;
}
.vgs-collect-container__invalid.vgs-collect-container__touched {
  border: 1px solid #ff1721;
}
</style>
  