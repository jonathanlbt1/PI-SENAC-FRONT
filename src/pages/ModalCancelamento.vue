<template>
  <q-dialog
    style="height: 200vh"
    v-model="medium"
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
  >
    <q-card style="width: 700px; max-width: 80vw; ">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6"
          >Tem certeza que deseja cancelar seu pedido?</span
        >
      </q-card-section>

      <q-separator />
      <q-card-section class="teste">
        <q-img style="max-height: 14rem;" >
          <img class=" q-no-padding" src="../assets/sad.gif" />
        </q-img>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-mt-md">
        <q-btn

        size="14px"
          class="q-px-xl q-py-xs"
          label="Nao, quero continuar"
          rounded
          color="primary"
          @click="onCancel"
          icon="mood"
          style="height: 60px; margin-top: 10px"
        />
        <q-btn
        size="14px"
          class="q-px-xl q-py-xs q-ml-md"
          label="Sim, quero cancelar"
          rounded
          color="negative"
          @click="onConfirm"
          icon="mood_bad"
          style="height: 60px; margin-top: 10px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style>
.teste {

  object-fit: contain;
  padding-bottom: 0px!important;
}
</style>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useQuasar } from "quasar";
export default {
  name: "ModalCancelamento",
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
      medium: false,
    };
  },

  methods: {
    onCancel() {
      // Fechar a modal quando o usuário clicar em Cancelar
      this.$refs.dialogRef.hide();
    },
    onConfirm() {
      this.onDialogOK();
    },
  },
};
</script>
