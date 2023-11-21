import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    lista: [],
    comanda: [
      {
        origem_comanda: 1,
        dtentrega_comanda: "0000-00-00",
        hrentrega_comanda: "00:00:00",
        tipo_comanda: "",
        num_comanda: 0,
      },
    ],
    ultimoDelivery: 0,

    filtro: {
      numeroComanda: "",
    },
  },

  actions: {
    //coamandas em aberto
    async LOAD({ state, commit }) {
      const res = await http.appGet("/comandasEmAberto");
      if (!res) return;
      commit("SET_LISTAGEM", res);
    },

    async IMPRIMIR_CONTA({ state, commit }, dados) {
      if (!state.comanda) return;
      const dadosEnvio = {
        atendente_fechaconta: dados.atendente_fechaconta,
        num_pessoas: dados.num_pessoas,
      };
      await http.appPut(
        "/imprimirConta/",
        state.comanda.id_comanda,
        dadosEnvio
      );
    },

    async CANCELAR_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      await http.appPut("/cancelarComanda/", dados.id_comanda, dados);
    },

    async LOAD_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      const res = await http.appGet(`/comandaPorNumero/200`);

      if (!res) return;
      //anotação da mesa
      res[0].mesa_comanda = dados.mesa_comanda != "" ? dados.mesa_comanda : 0;
      //console.log(res);
      commit("SET_COMANDA", res);
    },

    async ABRIR_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      const res = http.appPost(`/comandas/abrirComanda`, dados);
      if (!res) return;
      return res;
    },

    async REABRIR_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      const res = await http.appPost(`/comandas/reabrirComanda`, dados);
      if (!res) return;
      return res;
    },

    async FECHAR_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      const res = await http.appPost(`/comandas/fecharComanda`, dados);
      console.log(res);
      if (!res) return;
      return res.data;
    },

    async TRANSFERIR_COMANDA({ state, commit }, dados) {
      if (!dados) return;
      const res = await http.appPost(`/comandas/transferirComanda`, dados);
      if (!res) return;
      return res.data;
    },

    async NOVO_DELIVERY({ state, commit }) {
      const res = await http.appGet(`/novoDelivery`);
      if (!res) return;
      //res[0].mesa_comanda = 0;
      commit("SET_ULTIMO_DELIVERY", res);
    },

    async ATUALIZAR_COMANDA({ state, commit }, dados) {
      //console.log(dados);
      if (!dados) return;
      await http.appPut("/atualizarComanda/", dados.id_comanda, dados);
    },
  },

  mutations: {
    SET_LISTAGEM(state, list) {
      state.lista = list;
    },
    SET_COMANDA(state, list) {
      state.comanda = list;
    },
    SET_ULTIMO_DELIVERY(state, list) {
      state.ultimoDelivery = list.ultimo_delivery;
    },
  },
});
