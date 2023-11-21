<template>
  <div
    v-if="cli.razao_cliente && !fecharTela"
    class="row bg-orange-3 text-bold text-blue-10 q-mb-xs"
    style="border: 1px solid orange"
    @click="abrirTelinha()"
  >
    <q-icon
      size="xs"
      name="person"
      color="black"
      class="q-mt-xs q-ml-sm q-mr-sm"
    />
    <div class="q-mt-xs">
      {{ `Dados do Cliente: ${cli.razao_cliente} ` }}
    </div>
  </div>

  <q-card
    v-if="cli.razao_cliente && fecharTela"
    class="bg-orange-3 q-pa-xs q-mb-xs"
    style="border: 1px solid orange"
  >
    <q-card-section horizontal class="flex flex-center text-blue-10 text-bold">
      Dados do Cliente
      <q-space />
      <q-icon
        v-if="btnSair == 'x'"
        color="red-10"
        name="close"
        size="sm"
        @click="fecharTelinha()"
      />
    </q-card-section>
    <q-card-section horizontal>
      <q-icon size="sm" name="person" color="green-10" class="q-mr-sm" />
      {{ `${cli.razao_cliente} ` }}
    </q-card-section>

    <q-card-section horizontal>
      <q-icon size="sm" name="flag" color="red-10" class="q-mr-sm" />
      {{
        ` ${cli.end_cliente}, ${cli.num_cliente}, ${cli.complemento_cliente} - ${cli.bairro_cliente} `
      }}
      <q-space />
      <q-btn
        label="alterar endereço"
        size="sm"
        flat
        color="blue-10"
        @click="alterarCliente"
      />
    </q-card-section>

    <q-card-section horizontal>
      <q-icon size="xs" name="phone" color="blue-10" class="q-mr-sm" />
      {{ `${cli.fone1_cliente} ` }}
    </q-card-section>
  </q-card>
</template>

<script>
import dataHoraAtual from "../mixins/dataHoraMixin";
import notifyMixin from "../mixins/notifyMixin";
import ModalAdicionar from "src/pages/ModalAdicionarCliente";

export default {
  mixins: [dataHoraAtual, notifyMixin],
  setup() {
    return {};
  },
  data() {
    return { cli: [], fecharTela: false };
  },

  props: {
    cliente: {
      type: Object,
      required: true,
    },
    btnSair: {
      type: String,
    },
  },
  async created() {
    this.cli = this.cliente;
  },

  methods: {
    fecharTelinha() {
      this.fecharTela = false;
    },
    abrirTelinha() {
      this.fecharTela = true;
    },
    async alterarCliente() {
      this.$q
        .dialog({
          component: ModalAdicionar,
          componentProps: {
            dado: [this.cliente],
            tituloPage: "Editar Cliente",
          },
        })
        .onOk(async (res) => {
          this.cli = res[0];
          //await this.selecionarCliente();
        });
    },
  },
};
</script>
