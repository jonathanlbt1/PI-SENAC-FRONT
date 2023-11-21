<template>
  <div
    v-if="opr.nom_funcionario"
    style="border: 1px solid blue"
    class="q-mb-sm bg-blue-2 flex flex-center q-pa-xs"
  >
    <q-icon size="xs" name="person" color="green-10" class="q-ml-sm q-mr-sm" />
    <div class="text-bold">
      {{ opr.nivel_funcionario + ": " + opr.nom_funcionario }}
    </div>
    <q-space />
    <q-icon
      v-if="btnSair == 'x'"
      class="text-blue-10"
      name="logout"
      size="sm"
      @click="logoutOperador"
    />
  </div>
</template>

<script>
import controllerOperador from "src/pages/storesPages/operador.store";
import dataHoraAtual from "../mixins/dataHoraMixin";
import notifyMixin from "../mixins/notifyMixin";

export default {
  mixins: [dataHoraAtual, notifyMixin],
  setup() {
    return { controllerOperador };
  },
  data() {
    return { opr: [] };
  },

  props: {
    operador: {
      type: Object,
      required: true,
    },
    btnSair: {
      type: String,
    },
  },
  async created() {
    this.opr = this.operador;
  },

  methods: {
    loadComponente() {},
    logoutOperador() {
      controllerOperador.state.manterOperador = false;
      controllerOperador.commit("SET_LIMPAR_ATUAL");
      this.opr = controllerOperador.state.operador;
      this.$router.go();
    },
  },
};
</script>
