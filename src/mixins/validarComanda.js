const validarComanda = {
  setup() {
    return {};
  },
  data() {
    return {};
  },
  methods: {
    async validarComanda(comanda) {
      if (comanda.length == 0) {
        await this.notificar(`Número inválido!`, "negative", "close");
        return false;
      }
      if (comanda[0].id_venda != 0) {
        if (typeof comanda[0].id_venda !== "object") {
          await this.notificar(
            `A ${comanda[0].tipo}-${comanda[0].num_comanda}  está aberta no caixa.`,
            "negative",
            "close"
          );
          return false;
        }
      }
      if (comanda[0].ativa_comanda == 0) {
        await this.notificar(
          `A ${comanda[0].tipo}  está desativada!`,
          "negative",
          "close"
        );
        return false;
      }
      if (comanda[0].fl_comanda == 6) {
        await this.notificar(
          `A ${comanda[0].tipo}  está bloqueada!`,
          "negative",
          "close"
        );
        return false;
      }
      if (comanda[0].reservada_comanda > 0) {
        await this.notificar(
          `A ${comanda[0].tipo}  está reservada!`,
          "negative",
          "close"
        );
        return false;
      }
      if (comanda[0].situacao_comanda == 0) {
        await this.notificar(
          `A ${comanda[0].tipo}-${comanda[0].num_comanda}  está em uso em outro terminal`,
          "negative",
          "close"
        );
        return false;
      }
      if (comanda[0].situacao_comanda == 4) {
        await this.notificar(
          `A conta da ${comanda[0].tipo}-${comanda[0].num_comanda} já foi emitida!`,
          "yellow-10",
          "warning"
        );
        return true;
      }
      return true;
    },
    async validarTransferenciaComanda(comanda, tipo) {
      if ((await this.validarComanda(comanda)) == false) {
        return false;
      }
      if (comanda[0].num_comanda >= 100000) {
        await this.notificar(
          `${tipo} inválida para transferência!`,
          "negative",
          "close"
        );
        return false;
      }
      if (comanda[0].situacao_comanda == 4) {
        await this.notificar(
          `A conta da ${comanda[0].tipo}-${comanda[0].num_comanda} de ${tipo} já foi emitida não é possível transferência !`,
          "negative",
          "close"
        );
        return false;
      }

      return true;
    },
    async notificar(msg, tipo, icon) {
      this.$q.notify({
        position: "top",
        classes: "text-h6 q-btn",
        message: msg,
        color: tipo,
        icon: icon,
      });
    },
  },
};

export default validarComanda;
