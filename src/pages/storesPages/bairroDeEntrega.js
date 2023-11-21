import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    bairroDeEntrega: [],
  },

  actions: {
    //coamandas em aberto
    async LOAD_BAIRROENTREGA({ state, commit }) {
      const res = await http.appGet(`/bairrosDeEntrega`);
      if (!res) return;
      commit("SET_BAIRROENTREGA", res);
    },
  },

  mutations: {
    SET_BAIRROENTREGA(state, list) {
      state.bairroDeEntrega = list;
    },
  },
});
