import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    configTerminal: [],
    filtro: {
      numeroTerminal: "",
    },
  },

  actions: {
    //comandas em aberto
    async LOAD_CONFIGURA({ state, commit }) {
      const res = await http.appGet(
        `/configuracao/${state.filtro.numeroTerminal}`
      );
      if (!res) return;
      commit("SET_CONFIGURA", res);
      //console.log(res);
    },
  },

  mutations: {
    SET_CONFIGURA(state, list) {
      state.configTerminal = list;
    },
  },

  getters: {
    combinadoMediaMaior: (state) => {
      if (state.configTerminal.length > 0) {
        return state.configTerminal[0].combinado_media_maior === 1;
      } else {
        return false; // ou defina um valor padrão se a configuração não estiver disponível
      }
    },
  },
});
