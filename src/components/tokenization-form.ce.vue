<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { loadVGSCollect } from "@vgs/collect-js";
const props = defineProps<{
    showbutton?: boolean,
}>();
let form = ref({} as any);
let formState = reactive({
  CreditCardNumber: { errorMessages: [] },
  Cvv: { errorMessages: [] },
  ExpirationDate: { errorMessages: [] },
  CardHolderName: { errorMessages: [] },
});
const errorsVisible = ref(false);
const submitButtonText = ref("Submit");
const isButtonDisabled = ref(false);
const emit = defineEmits(["submit-success", "validation-error"]);

const validateForm = (event: { preventDefault: () => void }) => {
  event.preventDefault();
  const { CreditCardNumber, Cvv, ExpirationDate, CardHolderName } = formState;
  errorsVisible.value =
    CreditCardNumber.errorMessages.length > 0 ||
    Cvv.errorMessages.length > 0 ||
    ExpirationDate.errorMessages.length > 0 ||
    CardHolderName.errorMessages.length > 0;

  if (errorsVisible.value) {
    // Display errors and keep the button enabled
    submitButtonText.value = "Submit";
    isButtonDisabled.value = false;
  } else {
    // No errors, proceed to tokenize
    submitButtonText.value = "Tokenizing...";
    isButtonDisabled.value = true;
    submitForm();
    // Call your tokenization function here
  }
};
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
  // Create JUPITER Collect field for credit card name
  form.field("#cc-name", {
    type: "text",
    name: "CardHolderName",
    placeholder: "Joe Business",
    validations: ["required"],
  });

  // Create JUPITER Collect field for credit card number
  form.field("#cc-number", {
    type: "card-number",
    name: "CreditCardNumber",
    successColor: "#4F8A10",
    errorColor: "#D8000C",
    placeholder: "4111 1111 1111 1111",
    validations: ["required", "validCardNumber"],
  });

  // Create JUPITER Collect field for CVC
  form.field("#cc-cvc", {
    type: "card-security-code",
    name: "Cvv",
    placeholder: "344",
    validations: ["required", "validCardSecurityCode"],
  });

  // Create JUPITER Collect field for credit card expiration date
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
  form.value = form;
});
// Handle form submission
const submitForm = async () => {
  try {
    // Implement the form submission logic here
    const env = "sandbox-platform";
    const subMerchantId = "jpt-sim-md-1";
    let resp = await fetch(
      "https://" +
        env +
        ".jupiterhq.com/v1/transactions/creditcard/tokenization/" +
        subMerchantId +
        "/session"
    );
    let sessionData = await resp.json();
    let sessionId;
    if (sessionData.data && sessionData.data.status === "active") {
      sessionId = sessionData.data.sessionId;
    }
    if (form.value) {
      // Accediendo a la instancia de VGSCollect a través de .value

      //submit cc fields to VGS for tokenization
      form.value.submit(
        "/v1/transactions/creditcard/tokenization/" + subMerchantId,
        { data: { sessionToken: sessionId } },
        async (status: any, response: any) => {
          submitButtonText.value = "Submit";
          emit("submit-success", { data: response.data.token });
          submitButtonText.value = "Submit";
          isButtonDisabled.value = false;
        }
      );
    }
  } catch (error) {
    // Handle or log the error
    submitButtonText.value = "Submit";
    isButtonDisabled.value = false;
    emit("validation-error", { message: "Error de validación", formState });

    // You might also want to update the UI or state to reflect the error
  }
};

defineExpose({ validateForm })

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

              <!--Submit credit card form button-->
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
              </div>
            </form>
            <div v-if="errorsVisible" id="errors">
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
            </div>
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
