<template>
  <ModalSenhaTecnica />
  <q-page class="q-pa-sm">
    <div class="row">
      <q-btn
        color="blue-10"
        icon="west"
        label="Voltar"
        class="lt-sm q-mb-sm"
        @click="this.$router.push('/')"
      />
      <div class="col-sm-4 col-md-3 gt-xs flex q-pa-md">
        <q-icon name="settings" color="blue-10" size="20.4em" />
      </div>
      <q-card
        style="max-height: 443px"
        class="text-blue-10 col-xs-12 col-sm-8 col-md-9"
        bordered
      >
        <q-card-section>
          <div class="q-mb-md text-h5 text-weight-bolder flex">
            <q-btn
              color="blue-10"
              icon="west"
              label="Voltar"
              class="gt-xs q-mb-sm"
              @click="this.$router.push('/')"
            />
            Configurações
            <q-space />
            <q-btn
              round
              color="blue-10"
              icon="edit"
              @click="mostrarCodEmpresa"
              size="sm"
            />
          </div>

          <q-input
            type="text"
            v-model="codEmpresa"
            outlined
            class="q-mb-sm"
            label="Código Empresa"
            v-if="isCodeEmpresa"
          />

          <q-input
            v-model="endercoServidor"
            outlined
            class="q-mb-sm"
            label="Endereço Servidor"
          />
          <q-input
            type="number"
            v-model="codTerminal"
            outlined
            class="q-mb-sm"
            label="Código do terminal"
          />
          <q-input
            type="number"
            v-model="codCaixa"
            outlined
            class="q-mb-sm"
            label="Pertence ao Caixa"
          />
          <q-input
            type="number"
            v-model="codigoAtendente"
            outlined
            class="q-mb-sm"
            label="Código de Atendente"
          />
          <q-select
            outlined
            v-model="valorVenda"
            :options="options"
            label="Defina se os produtos em KG serão vendidos fracionados"
            option-value="value"
          />
          <q-toggle
            :label="`Habilitar atualização automática de tela`"
            color="green"
            v-model="atualizacaoAuto"
          />
          <q-toggle v-model="manterSessao" label="Manter Atentendente" />
          <q-toggle v-model="somenteCardapio" label="Somente Cardápio" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            icon="close"
            class="col-5 bg-red text-white"
            @click="limpar()"
            >limpar</q-btn
          >
          <q-btn
            flat
            icon="add"
            class="col-5 bg-green-10 text-white"
            @click="gravar()"
            >gravar</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import ModalSenhaTecnica from "components/ModalSenhaTacnica.vue";
import { useQuasar } from "quasar";
import controllerOperador from "src/pages/storesPages/operador.store";

export default defineComponent({
  name: "ConfigPage",
  setup() {
    const $q = useQuasar();
    return {

      options: [
        { label: "Valor em 100g", value: 100 },
        { label: "Valor em 150g", value: 150 },
        { label: "Valor em 200g", value: 200 },
        { label: "Valor por quilo", value: 4 },
      ],
      gravadoComSucesso() {
        $q.notify({
          message: "As configurações foram gravadas com sucesso",
          color: "positive",
          icon: "done",
        });
      },
      configurarSistema() {
        $q.notify({
          message: "O sistema não está configurado.",
          color: "warning",
          textColor: "black",
          icon: "error",
          classes: "text-h6 q-btn",
        });
      },
    };
  },
  data() {
    return {
      isCodeEmpresa: false,
      codEmpresa: "pacnet",
      endercoServidor: "http://127.0.0.1:3030",
      codTerminal: "100",
      codCaixa: "1",
      atualizacaoAuto: false,
      modoDelivery: false,
      modoMesa: false,
      codigoAtendente: "1",
      manterSessao: true,
      valorVenda: "valor em 100g",
      somenteCardapio: false,
    };
  },
  components: {
    ModalSenhaTecnica,
  },
  computed: {},
  async created() {
    var url = window.location.hostname.toString();

    const dados = JSON.parse(localStorage.getItem("appAtdConf"));

    if (!dados) {
      this.endercoServidor = `http://${url}:3030`;
      this.configurarSistema();
      return;
    }

    this.codEmpresa = dados[0].codEmpresa;
    this.endercoServidor = dados[0].endercoServidor;
    this.codTerminal = dados[0].codTerminal;
    this.codCaixa = dados[0].codCaixa;
    this.atualizacaoAuto = dados[0].atualizacaoAuto;
    this.modoDelivery = dados[0].modoDelivery;
    this.modoMesa = dados[0].modoMesa;
    this.valorVenda = dados[0].valorVenda.toString();
    this.somenteCardapio = dados[0].somenteCardapio;
    this.teste = dados[0].teste;
  },

  watch: {},

  methods: {
    mostrarCodEmpresa() {
      this.isCodeEmpresa
        ? (this.isCodeEmpresa = false)
        : (this.isCodeEmpresa = true);
    },

    async validarOperador() {
      if (this.codigoAtendente === "") {
        this.codigoVazio();
        return false;
      }

      await controllerOperador.dispatch("LOAD", {
        codAtendente: this.codigoAtendente,
      });

      if (controllerOperador.state.lista.length === 0) {
        this.operadorNaoLocalizado();
        return false;
      }

      var res = controllerOperador.state.lista.filter(
        (user) => user.codatd_funcionario == this.codigoAtendente
      );

      // Update the "operador" controller with the selected "Código de Atendente"
      controllerOperador.commit("SET_ATUAL", res);
      controllerOperador.commit("SET_MANTEROPERADOR", this.manterSessao);

      return true;
    },

    gravar() {
      const config = [
        {
          codEmpresa: this.codEmpresa,
          endercoServidor: this.endercoServidor,
          codTerminal: this.codTerminal,
          codCaixa: this.codCaixa,
          atualizacaoAuto: this.atualizacaoAuto,
          modoDelivery: this.modoDelivery,
          modoMesa: this.modoMesa,
          valorVenda: this.valorVenda,
          somenteCardapio: this.somenteCardapio,
          teste: this.teste,
        },
      ];
      const parsed = JSON.stringify(config);
      localStorage.setItem("appAtdConf", parsed);

      const isValidOperador = this.validarOperador();
      if (!isValidOperador) {
        return; // Don't proceed if the "Código de Atendente" is not valid
      }
      controllerOperador.commit("SET_ATUAL", {
        nom_funcionario: "Atendente " + this.codigoAtendente,
        nivel_funcionario: "Nível " + this.codigoAtendente,
      });

      this.gravadoComSucesso();
    },

    limpar() {
      this.codEmpresa = "";
      this.endercoServidor = "";
      this.codTerminal = "";
      this.codCaixa = "";
      this.teste = "";
      localStorage.removeItem("appAtdConf");
    },
  },
});
</script>
