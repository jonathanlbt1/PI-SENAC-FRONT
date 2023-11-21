import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";

export default new Store({
  state: {
    clientes: [],
    selecionado: [],
  },

  actions: {
    async LOAD_CLIENTES({ state, commit }) {
      const res = await http.appGet(`/listaDeClientes`);
      if (!res) return;
      commit("SET_CLIENTES", res);
    },

    async LOAD_IDCLIENTE({ state, commit }, dados) {
      const res = await http.appGet(`/listarClienteId/${dados}`);
      if (!res) return;
      commit("SET_SELECIONADO", res);
    },

    async LOAD_CLIENTE({ state, commit }, dados) {
      const res = await http.appGet(`/listarCliente/${dados}`);
      if (!res) return;
      commit("SET_SELECIONADO", res);
    },

    async INCLUIR_CLIENTE({ state, commit }, dados) {
      const res = await http.appPost(`/cliente`, dados);
      if (!res) return;
      return res;
      //commit("SET_SELECIONADO", res);
    },

    async ALTERAR_CLIENTE({ state, commit }, dados) {
      const res = await http.appPut(`/cliente/`, dados.id_cliente, dados);
      if (!res) return;
      return res;
      //commit("SET_SELECIONADO", res);
    },
  },

  mutations: {
    SET_CLIENTES(state, list) {
      state.clientes = list;
    },

    SET_SELECIONADO(state, list) {
      state.selecionado = list;
    },
  },
});
