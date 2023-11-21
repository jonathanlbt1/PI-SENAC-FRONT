import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    subGrupos: [],
  },

  actions: {
    async LOAD_SUBGRUPOS({ state, commit }, idGrupo) {
      const res = await http.appGet(`/subgrupos/${idGrupo}`);
      if (!res) return;
      commit("SET_SUBGRUPOS", res);
    },
  },

  mutations: {
    SET_SUBGRUPOS(state, list) {
      state.subGrupos = list;
    },
  },
});
