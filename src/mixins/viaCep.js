import {  Notify } from "quasar";
import axios from "axios";

const viacep = {
  data() {
    return {

    };
  },
  methods: {
    async cep(cep) {
      try {
        const res = await new axios({
          url: `https://viacep.com.br/ws/${cep}/json/`,
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        return res.data;
      } catch (e) {
        Notify.create({
          type: "negative",
          message: "Não foi possível encontrar o endereço!",
        });
        return;
      }
    },
  },
};

export default viacep;
