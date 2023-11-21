const dataHoraMixin = {
  data() {
    return {
      atual: "",
    };
  },
  created() {
    this.atual = new Date();
  },
  methods: {
    dataHoraBR(umaData) {
      //sem parametro retorna atual
      if (!umaData) return this.atual.toLocaleString("pt-BR");
      return new Date(umaData).toLocaleString("pt-BR");
    },
    atualDataBR() {
      const options = { dateStyle: "short" };
      return this.atual.toLocaleString("pt-BR", options);
    },
    atualHoraBR() {
      const options = { timeStyle: "medium" };
      return this.atual.toLocaleString("pt-BR", options);
    },

    atualDataBD() {
      const options = { dateStyle: "short" };
      return this.atual.toLocaleString("en-CA", options);
    },

    dataBD(valor) {
      const ano = valor.substring(6, 10);
      const mes = valor.substring(3, 5);
      const dia = valor.substring(0, 2);
      return `${ano}-${mes}-${dia}`;
    },

    horaBD(valor) {
      return valor.substring(11, 17);
    },

    diferencaDataEmHoras(data) {
      var inicio = new Date(data);
      var fim = this.atual;
      var diferenca = new Date(fim - inicio);
      var resultado = diferenca.getUTCHours() + "h ";
      resultado += diferenca.getUTCMinutes() + "m ";
      resultado += diferenca.getUTCSeconds() + "s ";

      return resultado;
    },

    valorBR(input, casas) {
      input = typeof input != "number" ? Number(input) : input;

      return input
        .toFixed(casas) // casas decimais
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },

    parseNumber(val, tofixed) {
      return Number(val || "0").toFixed(tofixed || 2);
    },
  },
};

export default dataHoraMixin;
