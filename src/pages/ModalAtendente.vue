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
        width: 90%;
        max-width: 1024px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >
      <q-card-section class="bg-blue-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon class="q-mr-md" name="person" color="primary" size="2rem" />
          Atendente
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
              label="Código de Atendente"
              autofocus
              @keyup.enter="validarOperador"
            />
          </div>
        </div>
        <div class="row q-mt-md text-right">
          <q-toggle v-model="manterSessao" label="Manter Atentendente" />
        </div>
        <div class="row q-mt-md text-right">
          <q-btn color="primary" icon="camera_alt" size="lg" />
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="validarOperador"
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
import dataHora from "src/mixins/dataHoraMixin.js";
import controller from "./storesPages/operador.store";
import controllerComanda from "src/pages/storesPages/comandas.store.js";

export default {
  name: "ModalAtendente",
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
      codigoVazio() {
        $q.notify({
          message: "Digite o Código do Atendente",
          color: "negative",
          icon: "close",
        });
      },
      operadorNaoLocalizado() {
        $q.notify({
          message: "Atendente inválido !",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      text: "1",
      manterSessao: true,
    };
  },

  methods: {
    async onShowModal() {
      //this.$q.loading.show();
      // console.log("load operadores");
      //this.$q.loading.hide();
    },

    async validarOperador() {
      if (this.text === "") {
        this.codigoVazio();
        return false;
      }
      await controller.dispatch("LOAD", { codAtendente: this.text });

      if (controller.state.lista.length == 0) {
        this.operadorNaoLocalizado();
        return false;
      }

      var res = controller.state.lista.filter(
        (user) => user.codatd_funcionario == this.text
      );

      await controllerOperador.commit("SET_ATUAL", res);
      await controllerOperador.commit("SET_MANTEROPERADOR", this.manterSessao);
      this.onDialogOK();
    },
  },
};
</script>
