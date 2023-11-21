<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    @before-show="onShowModal"
    persistent
  >
    <q-card
      class="q-dialog-plugin bg-red-10"
      style="
        max-height: 100vh;
        width: 90%;
        max-width: 1024px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >
      <q-card-section class="bg-red-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon
            class="q-mr-md"
            name="do_disturb_on"
            color="white"
            size="2rem"
          />
          Motivo do Cancelamento
        </div>
        <div>
          <q-btn
            round
            dense
            color="red"
            icon="close"
            @click="onCancelClick()"
          />
        </div>
      </q-card-section>

      <q-card-section class="bg-white text-body1 q-pa-lg">
        <br />
        <div class="row">
          <div class="col-12">
            <q-input
              type="text"
              filled
              v-model="text"
              label="Qual o motivo do cancelamento?"
              autofocus
              @keyup.enter="validarMotivo"
            />
          </div>
        </div>

        <div class="row q-mt-md text-right">
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="validarMotivo"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useQuasar } from "quasar";
import controller from "./storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import dataHora from "src/mixins/dataHoraMixin.js";

export default {
  name: "ModalMotivoCancelamento",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
      motivoVazio() {
        $q.notify({
          message: "Digite um motivo para o cancelamento.",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      text: "",
    };
  },

  methods: {
    async onShowModal() {},
    async validarMotivo() {
      if (this.text === "") {
        this.motivoVazio();
        return false;
      }

      this.onDialogOK(this.text);
    },
  },
};
</script>
