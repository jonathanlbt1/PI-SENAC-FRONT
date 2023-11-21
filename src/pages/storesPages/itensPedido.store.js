import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    itensPedido: [],
    itensSelecionados: [],
  },

  actions: {
    async LOAD_ITENSPEDIDO({ state, commit }, dados) {
      const res = await http.appGet(`/listarItensPedido/${dados}`);
      if (!res) return;
      commit("SET_ITENSPEDIDO", res);
    },

    async LOAD_OBSITEM({ state, commit }, dados) {
      const res = await http.appGet(`/listarObsItem/${dados.id_item}`);

      if (!res) return;
      return res;
    },

    async INCLUIR_ITEMPEDIDO({ state, commit }, dados) {
      const res = await http.appPost(`/comandaItem/incluirItem`, dados);
      if (!res) return;
      return res;
      console.log(res);
    },

    async INCLUIR_OBS_ITEMPEDIDO({ state, commit }, dados) {
      const res = await http.appPost(`/incluirObsItem`, dados);
      if (!res) return;
      return res;
    },

    async CANCELAR_ITEMPEDIDO({ state, commit }, dados) {
      const res = await http.appPut(
        `/cancelarItemPedido/`,
        dados.id_item,
        dados
      );
      if (!res) return;
      return res;
    },

    async COMBINAR_ITEMPEDIDO({ state, commit }, dados) {
      const res = await http.appPut(`/combinarItensPedido`, "", dados);
      if (!res) return;
      return res;
    },
  },

  mutations: {
    SET_ITENSPEDIDO(state, list) {
      //console.log(list);
      state.itensPedido = list;
    },

    SET_ITENS_SELECIONADOS(state, itens) {
      state.itensSelecionados = itens;
    },
    LIMPAR_ITENS_SELECIONADOS(state) {
      state.itensSelecionados = [];
    },
  },
});
