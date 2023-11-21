<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    @before-show="onShowModal"
    persistent
  >
    <q-card
      class="q-dialog-plugin bg-grey-10"
      style="
        max-height: 100vh;
        width: 100%;
        max-width: 680px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >
      <q-card-section class="bg-grey-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon class="q-mr-md" name="people" color="white" size="2rem" />
          Listagem de Clientes
        </div>
        <div>
          <q-btn
            round
            dense
            color="red"
            icon="close"
            @click="fecharTelaCliente()"
          />
        </div>
      </q-card-section>

      <q-card-section class="bg-white text-body1 q-pa-lg">
        <div class="row">
          <div class="col-12 q-mt-md">
            <q-input
              type="text"
              filled
              v-model="text"
              label="Pesquisar por Telefone, Nome ou CPF"
              autofocus
              @keyup.enter="selecionarCliente"
              class="q-mb-sm"
              @change="procurarCliente()"
            />
          </div>
          <div class="col-12">
            <q-table
              :rows="dadosClientes"
              :columns="columns"
              row-key="id_cliente"
              selection="single"
              v-model:selected="selected"
            />
          </div>
        </div>
        <div class="row q-mt-md" v-if="false">
          Selected: {{ JSON.stringify(selected) }}
        </div>

        <div class="row q-mt-md text-right">
          <q-btn
            color="orange-10"
            icon="person_add_alt"
            size="lg"
            @click="novoCliente()"
          />
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="selecionarCliente"
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
import controllerCliente from "./storesPages/cliente.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import dataHora from "src/mixins/dataHoraMixin.js";
import ModalProgramarPedido from "src/pages/ModalProgramarPedido";

import ModalAdicionar from "src/pages/ModalAdicionarCliente";

export default {
  name: "ModalClientes",
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
      clienteVazio() {
        $q.notify({
          position: "top",
          classes: "text-h6 q-btn",
          message: "Selecione um cliente para inicia um novo pedido!",
          color: "negative",
          icon: "close",
        });
      },
      opcaoInvalida() {
        $q.notify({
          position: "top",
          classes: "text-h6 q-btn",
          message: "Selecione um tipo de registro",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      text: "",
      columns: [
        {
          name: "fone1_cliente",
          required: true,
          label: "Telefone",
          align: "left",
          field: "fone1_cliente",
          sortable: true,
        },
        {
          name: "razao_cliente",
          align: "left",
          label: "Nome",
          field: "razao_cliente",
          sortable: true,
        },
      ],
      dadosClientes: [],
      selected: ref([]),
    };
  },

  watch: {
    text() {
      this.procurarCliente();
    },
  },

  methods: {
    async onShowModal() {
      this.$q.loading.show();
      await controllerCliente.dispatch("LOAD_CLIENTES");
      this.dadosClientes = controllerCliente.state.clientes;
      this.$q.loading.hide();
    },

    async selecionarCliente() {
      if (this.selected.length == 0) {
        this.clienteVazio();
        return false;
      }
      controllerCliente.state.selecionado = this.selected;
      this.tipoDeRegistro();
    },

    fecharTelaCliente() {
      this.$q
        .dialog({
          title: "Deseja encerrar o pedido ?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onCancelClick();
        });
    },

    tipoDeRegistro() {
      this.$q
        .dialog({
          component: ModalProgramarPedido,
        })
        .onOk(() => {
          this.onDialogOK();
        });
    },

    async procurarCliente() {
      this.text != ""
        ? await controllerCliente.dispatch("LOAD_CLIENTE", this.text)
        : await controllerCliente.dispatch("LOAD_CLIENTES");
      this.dadosClientes = controllerCliente.state.selecionado;
    },

    async novoCliente() {
      console.log(this.selected);
      this.$q
        .dialog({
          component: ModalAdicionar,
          componentProps: {
            dado: this.selected,
            tituloPage:
              this.selected.length == 0 ? "Novo Cliente" : "Editar Cliente",
          },
        })
        .onOk(async (res) => {
          this.selected = res;
          await this.selecionarCliente();
        });
    },
  },
};
</script>
