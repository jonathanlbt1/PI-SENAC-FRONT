import axios from "axios";
import { Notify } from "quasar";

const http = {
  mensagemDeErro() {
    Notify.create({
      type: "negative",
      message: "Ops, algo deu errado.",
      icon: "dangerous",
      //iconSize: "5rem",
      iconColor: "orange",
      position: "top",
      //classes: "text-h5 q-btn",
      //timeout: "60000",
      //multiLine: true,
      // actions: [
      //   {
      //     label: "ok",
      //     color: "yellow-10",
      //     handler: () => {
      //       /* ... */
      //     },
      //   },
      // ],
    });
  },
  async conexaoApi() {
    const appAtdConf = JSON.parse(localStorage.getItem("appAtdConf"));

    const instance = axios.create({
      baseURL: appAtdConf[0].endercoServidor,
      timeout: 10000,
      headers: { codempresa: appAtdConf[0].codEmpresa },
    });
    return instance;
  },
  async appGet(url) {
    const instancia = await this.conexaoApi().catch((e) => {
      console.log(e);
    });
    const resto = await instancia.get(url).catch((e) => {
      this.mensagemDeErro();
      return "";
    });
    return resto.data;
  },
  async appPut(url, id, dados) {
    const instancia = await this.conexaoApi();
    const resto = await instancia.put(`${url}${id}`, dados).catch((e) => {
      this.mensagemDeErro();
      return "";
    });
    return resto.data;
  },
  async appPost(url, dados) {
    const instancia = await this.conexaoApi();
    const resto = await instancia.post(`${url}`, dados).catch((e) => {
      this.mensagemDeErro();
      return "";
    });
    return resto.data;
  },
};

export default http;
