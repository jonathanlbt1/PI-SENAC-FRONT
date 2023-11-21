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
            name="local_police"
            color="blue-3"
            size="2rem"
          />
          Autorização Gerencial
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
              class="q-mb-sm"
              filled
              v-model="nome"
              label="Nome"
              autofocus
            >
              <template v-slot:append>
                <q-icon name="persona" color="blue-10" /> </template
            ></q-input>
            <q-input
              filled
              v-model="senha"
              autofocus
              @keyup.enter="validar"
              :type="isPwd ? 'password' : 'text'"
              hint="Digite a senha"
            >
              <template v-slot:append>
                <q-icon
                  color="blue-10"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-mt-md text-right">
          <q-btn color="primary" icon="camera_alt" size="lg" />
          <q-space />
          <q-btn color="green-10" icon="done" size="lg" @click="validar" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useQuasar } from "quasar";
import controller from "./storesPages/operador.store";

export default {
  name: "ModalAutorixar",
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
          position: "top",
          classes: "text-h6 q-btn",
          message: "Digite o nome do gerente.",
          color: "negative",
          icon: "close",
        });
      },
      senhaVazio() {
        $q.notify({
          position: "top",
          classes: "text-h6 q-btn",
          message: "Digite uma senha válida.",
          color: "negative",
          icon: "close",
        });
      },
      operadorNaoLocalizado() {
        $q.notify({
          position: "top",
          classes: "text-h6 q-btn",
          message: "Não autorizado",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      isPwd: true,
      nome: "",
      senha: "",
    };
  },

  methods: {
    async onShowModal() {
      await controller.dispatch("LOAD", { codAtendente: 0 });
    },

    async validar() {
      if (this.nome === "") {
        this.codigoVazio();
        return false;
      }
      if (this.senha === "") {
        this.senhaVazio();
        return false;
      }

      var md5 = require("md5");
      var res = controller.state.lista.filter(
        (user) =>
          user.login_funcionario == this.nome.toUpperCase() &&
          user.senha_funcionario == md5(this.senha) &&
          user.nivel_funcionario >= 2
      );

      if (res.length == 0) {
        this.operadorNaoLocalizado();
        return false;
      }
      controller.state.operador = res;
      this.onDialogOK(res);
    },
  },
};
</script>
