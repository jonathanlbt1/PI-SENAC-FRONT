<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    @before-show="onShowModal"
    persistent
  >
    <q-card
      class="q-dialog-plugin bg-blue-10"
      style="
        max-height: 100vh;
        width: 90%;
        max-width: 420px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >
      <q-card-section class="bg-blue-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon
            class="q-mr-md"
            name="local_activity"
            color="primary"
            size="2rem"
          />
          Comanda ou Mesa
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
              type="number"
              filled
              v-model="text"
              label="Faca a leitura do código da comanda"
              autofocus
              @keyup.enter="validarComanda"
            />
          </div>
          <div class="col-12 q-mt-xs" v-if="pede_mesa == 1">
            <q-input
              type="number"
              filled
              v-model="mesa"
              label="Qual a mesa?"
              autofocus
            />
          </div>
        </div>

        <div class="row q-mt-md text-right">
          <q-btn color="primary" icon="camera_alt" size="lg" />
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="validarComanda"
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
import configura from "src/pages/storesPages/configura.store";

export default {
  name: "ModalComanda",
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
      numeroVazio() {
        $q.notify({
          message: "Digite o Número da Comanda ou Mesa",
          color: "negative",
          icon: "close",
        });
      },
      operadorNaoLocalizado() {
        $q.notify({
          message: "A Comanda Inexistente ou inválida",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      text: "",
      mesa: "",
      pede_mesa: 1,
    };
  },

  methods: {
    async onShowModal() {
      this.pede_mesa = configura.state.configTerminal[0].pede_mesa;
    },

    async validarComanda() {
      if (this.text === "") {
        this.numeroVazio();
        return false;
      }

      controller.state.filtro.numeroComanda = this.text;
      await controller.dispatch("LOAD_COMANDA", {
        num: this.text,
        mesa_comanda: this.mesa,
      });

      this.onDialogOK();
    },
  },
};
</script>
