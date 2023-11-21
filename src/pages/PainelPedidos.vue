<template>
  <q-page-container v-once style="padding-top: 0px">
    <div class="row full-width">
      <div class="col-6">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title class="text-h2">Em preparo</q-toolbar-title>
        </q-toolbar>
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            v-for="dados in comandasEmAberto"
            :key="dados.num_comanda"
          >
            <q-item-section class="text-h3">{{
              dados.num_comanda
            }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-6">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title class="text-h2">Prontos</q-toolbar-title>
        </q-toolbar>
        <q-list bordered separator>
          <q-item
            clickable
            v-ripple
            v-for="dados in comandasEmAberto"
            :key="dados.num_comanda"
          >
            <q-item-section style="visibility: hidden" class="text-h3">{{
              `.`
            }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page-container>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useQuasar, Quasar, QIcon } from "quasar";
import controllerComanda from "src/pages/storesPages/comandas.store.js";

export default defineComponent({
  name: "PainelPedidos",

  setup() {
    const $q = useQuasar();

    return {};
  },

  data() {
    return {
      comandasEmAberto: [],
    };
  },

  components: {},

  computed: {},

  async created() {
    await this.loadPag();
    await this.loadPedidos();
    this.dadosComanda = controllerComanda.state.comanda[0];
    this.setInterval();
  },

  watch: {},

  methods: {
    async loadPag() {
      if (this.verificacaoAuto) {
        this.verificaMovimento();
      }

      await controllerComanda.dispatch("LOAD");
      this.dados = controllerComanda.state.lista;
      this.$q.loading.hide();
    },

    async loadPedidos() {
      await controllerComanda.dispatch("LOAD");
      this.dados = controllerComanda.state.lista;
      this.comandasEmAberto = controllerComanda.state.lista
        .map((item) => {
          return {
            num_comanda: item.num_comanda,
            data_hora: item.hrabertura_comanda,
          };
        })
        .slice(0, 8);
      await this.ordenaPedidos();
      this.$q.loading.hide();
    },

    setInterval() {
      setInterval(() => {
        this.loadPedidos();
      }, 15000);
    },

    async ordenaPedidos() {
      this.comandasEmAberto.sort((a, b) =>
        a.data_hora.localeCompare(b.data_hora)
      );
    },
  },
});
</script>
