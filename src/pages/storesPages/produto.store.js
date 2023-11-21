import { Store } from "vuex";
import axios from "axios";
import http from "/src/pages/storesPages/httpConexao.js";
import controleSubGrupo from "src/pages/storesPages/subGrupo.store";

export default new Store({
  state: {
    produtos: [],
    carrinho: [],
    produtosAleatorios: [],
  },

  actions: {
    //coamandas em aberto
    async LOAD_PRODUTOS({ state, commit }) {
      const res = await http.appGet(`/produtos`);
      if (!res) return;
      commit("SET_PRODUTOS", res);
    },

    async LOAD_OPCIONAL_PRODUTOS({ state, commit }, dados) {
      const res = await http.appGet(`/produtoopcional/${dados.id_produto}`);
      if (!res) return;
      return res;
    },

    async LOAD_PRODUTOS_SUBGRUPO({ state, commit }, id) {
      const res = await http.appGet(`/produtosSubGrupo/${id}`);
      if (!res) return;
      commit("SET_PRODUTOS", res);
    },

    async LOAD_PRODUTOS_ALEATORIOS({ state, commit }) {
      const randomSubgroups = controleSubGrupo.state.subGrupos
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const produtosAleatorios = await Promise.all(
        randomSubgroups.map(async (subgrupo) => {
          const res = await http.appGet(
            `/produtosSubGrupo/118`
          );
          if (res && res.length > 0) {
            const randomProductIndex = Math.floor(Math.random() * res.length);
            return res[randomProductIndex];
          }
          return null;
        })
      );
      commit(
        "SET_PRODUTOS_ALEATORIOS",
        produtosAleatorios.filter((product) => product !== null)
      );
    },
  },

  mutations: {
    SET_PRODUTOS(state, list) {
      state.produtos = list;
    },
    addToCart(state, item) {
      state.carrinho.push(item);
    },
    SET_PRODUTOS_ALEATORIOS(state, list) {
      state.produtosAleatorios = list;
      console.log(this.list)

    },
  },
});
