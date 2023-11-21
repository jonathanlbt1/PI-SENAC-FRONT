<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Bem vindo!</div>
            <div class="text-grey-8">Login para acessar sua conta</div>
          </q-card-section>
          <q-card-section>
            <q-input dense outlined v-model="email" label="Email"></q-input>
            <q-input dense outlined class="q-mt-md" v-model="password" type="password" label="Senha"></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn @click="validarLogin" style=" background-color: #A0C7AA; color: white;
  border-radius: 8px;" rounded size="md" label="Login" no-caps class="full-width"></q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pt-none">
            <div class="text-grey-8">Ainda não tem conta?
              <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">Cadastre-se
                .</a></div>
          </q-card-section>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar, Quasar, QIcon } from "quasar";
import controllerComanda from "src/pages/storesPages/comandas.store.js";
import controllerOperador from "src/pages/storesPages/operador.store";
import controllerConfigura from "src/pages/storesPages/configura.store";
import controllerParametro from "src/pages/storesPages/parametro.store";
import ModalComanda from "src/pages/ModalComanda";
import dataHora from "src/mixins/dataHoraMixin.js";
import validarComanda from "src/mixins/validarComanda.js";
import controller from "./storesPages/comandas.store";

export default defineComponent({
  name: "IndexPage",
  mixins: [dataHora, validarComanda],

  setup() {
    const $q = useQuasar();
    return {
      email: ref(''),
      password: ref(''),
      modelSelect: ref({ label: "Todos", value: 0 }),
      options: [
        { label: "Todos", value: 0 },
        { label: "Comanda", value: 1 },
        { label: "Mesa", value: 2 },
        { label: "Delivery", value: 3 },
      ],
      controllerComanda,
      controllerOperador,
      transferidoComSucesso() {
        $q.notify({
          message: "Transferência realizada com sucesso!",
          color: "positive",
          icon: "done",
        });
      },
      nenhumMovimento() {
        $q.notify({
          message: "Sem movimentação no momento!",
          color: "yellow-10",
          classes: "",
          icon: "store",
          position: "top",
        });
      },
      canceladoComSucesso() {
        $q.notify({
          message: "Cancelado com sucesso!",
          color: "positive",
          icon: "done",
        });
      },
      verificaMovimento() {
        $q.notify({
          color: "blue-10",
          classes: "q-btn q-pa-xs",
          icon: "history",
          position: "bottom-left",
          timeout: "30000",
          iconColor: "white",
          onDismiss: () => {
            if (this.verificacaoAuto) {
              this.loadPag();
            }
          },
        });
      },
    };
  },

  data() {
    return {
      verificacaoAuto: false,
      dados: [],
      operador: controllerOperador.state.operador[0],
      comanda: [],
      configura: [],
      configLocal: [],
      textComanda: "",
      slide: 0,
      autoplay: true,
      images: [ "pratos-desktop.png", "pratos-tablet.png", "pratos-celular.png"], // Lista de nomes de imagens
      fullscreen: ref(false),
      text: "",
      mesa: "",
    };
  },

  components: {
    //BuscaComanda,
  },

  computed: {
    filtrarPorTipo() {
      if (!this.modelSelect) {
        return this.dados.filter((model) => model.id_comanda > 0);
      }

      //grava o filtro para o futuro
      this.gravaFiltro(this.modelSelect);

      if (this.modelSelect.label === "Todos") {
        return this.dados.filter((model) => model.id_comanda > 0);
      }

      try {
        return this.dados.filter(
          (model) => model.tipo === this.modelSelect.label
        );
      } catch {
        this.nenhumMovimento();
        return this.dados;
      }
    },
  },

  async created() {
    this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));
    const operadorMantido = JSON.parse(localStorage.getItem("operadorMantido"));

    //verificar se existe o filtro gravado e mantem
    const filtro = this.lerFiltro();
    if (filtro != null) {
      this.modelSelect = filtro[0].tipo;
    }
    //--------------------------------------------

    //caso sistema não configurado
    if (this.configLocal === null) {
      this.$router.push("/configura");
    }

    //caso exista dados fixos de operador
    if (operadorMantido !== null) {
      controllerOperador.state.operador = operadorMantido;
      controllerOperador.state.manterOperador = true;
      this.operador = controllerOperador.state.operador[0];
    }

    if (!this.configLocal[0].atualizacaoAuto) {
      this.verificacaoAuto = false;
    } else {
      this.verificacaoAuto = true;
    }

    await this.loadConfigura(this.configLocal);
    await this.loadPag();
  },

  watch: {
    // whenever question changes, this function will run
    comanda() {},

    operador() {
      //this.operador = controllerOperador.state.operador[0];
    },
  },

  methods: {
    gravaFiltro(tipo) {
      //console.log(localStorage.removeItem("filtroInicial"));
      localStorage.setItem(
        "filtroInicial",
        JSON.stringify([
          {
            tipo,
          },
        ])
      );
    },

    getImageForScreenSize(image) {
      if (this.$q.screen.width < 600) {
        // Mobile
        return image.includes("celular") ? image : "pizza-celular.png";
      } else if (this.$q.screen.width < 1024) {
        // Tablet
        return image.includes("tablet") ? image : "pizza-tablet.png" ;
      } else {
        // Desktop
        return image.includes("desktop") ? image : "pizza-desktop.png";
      }
    },

    lerFiltro() {
      return JSON.parse(localStorage.getItem("filtroInicial"));
    },

    async loadConfigura(configLocal) {
      controllerConfigura.state.filtro.numeroTerminal =
        configLocal[0].codTerminal;
      await controllerParametro.dispatch("LOAD_PARAMETRO");
      await controllerConfigura.dispatch("LOAD_CONFIGURA");
      this.configura = controllerConfigura.state.configTerminal;
    },

    async loadPag() {
      if (this.verificacaoAuto) {
        this.verificaMovimento();
      }

      this.$q.loading.show();

      await controllerComanda.dispatch("LOAD");
      this.dados = controllerComanda.state.lista;
      this.operador = controllerOperador.state.operador[0];
      this.configura = controllerConfigura.state.configTerminal[0];

      this.$q.loading.hide();

      if (this.configura.iniciar_modomesa == 1) {
        this.modelSelect = this.options[2];
      }

      if (this.configura.codigo_fecha_comanda == 1) {
        this.modelSelect = this.options[3];
      }
    },

    async abrirAtendente() {
      this.comanda = controllerComanda.state.comanda;

      if (this.comanda.length == 0) return;
      const idComandaAtual = this.comanda[0].id_comanda;

      if (controllerOperador.state.manterOperador) {
        this.$router.push({ path: "/index" });
        return;
      }

      this.$q
        .dialog({
          //componentProps: { obj: this.operador },
        })
        .onOk(async () => {
          this.operador = controllerOperador.state.operador;
          if (this.operador.length == 0) {
            this.liberarComanda();
            return;
          }
          await this.loadPag();
          this.$router.push({ path: "/index" });
        })
        .onCancel(async () => {
          this.liberarComanda();
        });
    },

    async mostraComanda(num) {
      this.textComanda = num;
      await this.loadComanda(num);
    },

    async loadComanda(num) {
      this.$q.loading.show();
      await controllerComanda.dispatch("LOAD_COMANDA", { num: num });
      this.$q.loading.hide();

      let retorno = await this.validarComanda(controllerComanda.state.comanda);

      if (retorno === "P") {
        this.$q
          .dialog({
            component: ModalAutorizar,
          })
          .onOk(async (res) => {
            await controllerComanda.dispatch("LIBERAR_COMANDA", num);
            await this.loadComanda(num);
          });
      }

      retorno == true ? this.abrirAtendente() : (this.comanda = []);
    },

    async validarLogin() {

      await this.loadPag();
     this.validarComanda();
      this.$router.push({ path: "/feed" });
    },

    async abrirComanda() {
      this.$q
        .dialog({
          component: ModalComanda,

          //componentProps: { obj: this.operador },
        })
        .onOk(async () => {
          this.comanda = controllerComanda.state.comanda;
          if ((await this.validarComanda(this.comanda)) == true) {
            this.abrirAtendente();
          } else {
            this.comanda = [];
          }
        });
    },

    async validarComanda() {
      if (this.text === "200") {
        this.numeroVazio();
        return false;
      }

      controller.state.filtro.numeroComanda = this.text;
      await controller.dispatch("LOAD_COMANDA", {
        num: this.text,
        mesa_comanda: this.mesa,
      });
    },
  },
});
</script>

<style scoped>
.q-carousel__slide {
  background-size: contain !important;
  background-position: center !important;
  height: 100%;

}


.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

</style>
