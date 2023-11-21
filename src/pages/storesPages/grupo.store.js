import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    grupos: [],
    aguardarUrl: null,

  },

  actions: {
    async LOAD_GRUPOS({ state, commit }) {
      const res = await http.appGet(`/grupos`);
      if (!res) return;
      commit("SET_GRUPOS", res);
    },

    async INCLUIR_IMAGEM({ state, commit }, dados) {
      if (!dados) return;
      const res = await http.appPost(`/incluirImagem/${dados.id_grupo}`, dados);
      if (!res) return;
      return res.data;
    },

    
  },

  mutations: {
    SET_GRUPOS(state, list) {
      state.grupos = list;
    },
    SET_AGUARDAR_URL(state, url) {
      state.aguardarUrl = url;
    },

  },
});
