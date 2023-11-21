import { Store, store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    lista: [],
    operador: [
      {
        nom_funcionario: "",
        nivel_funcionario: "",
      },
    ],

    manterOperador: true,
  },

  actions: {
    async LOAD({ state, commit }, dados) {
      const res = await http.appGet(`/funcionarios/${dados.codAtendente}`);

      if (!res) return;

      commit("SET_LISTAGEM", res);
    },
  },

  mutations: {
    SET_LISTAGEM(state, list) {
      state.lista = list;
    },
    SET_ATUAL(state, list) {
      state.operador = list;
    },
    SET_MANTEROPERADOR(state, list) {
      list
        ? localStorage.setItem(
            "operadorMantido",
            JSON.stringify(state.operador)
          )
        : localStorage.removeItem("operadorMantido");

      state.manterOperador = list;
    },
    SET_LIMPAR_ATUAL(state) {
      if (state.manterOperador == true) return;

      localStorage.removeItem("operadorMantido");
      state.operador = [
        {
          nom_funcionario: "",
          nivel_funcionario: "",
        },
      ];
    },
  },
});
