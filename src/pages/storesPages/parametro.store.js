import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    parametro: [],
  },

  actions: {
    //coamandas em aberto
    async LOAD_PARAMETRO({ state, commit }) {
      const res = await http.appGet(`/parametro`);
      if (!res) return;
      commit("SET_PARAMETRO", res);
    },
  },

  mutations: {
    SET_PARAMETRO(state, list) {
      state.parametro = list;
    },
  },
});
