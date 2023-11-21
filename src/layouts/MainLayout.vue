<template>
  <q-layout
    view="lhh LpR lff"
    class="shadow-2 rounded-borders q-ma-none"
    style="background-color: #fafafa"
  >
    <q-header
      v-if="mostraHeader() == true"
      style="
        background-color: white;
        width: 100%;
        z-index: 1000;
        background-repeat: no-repeat;
        background-size: cover;
        object-fit: cover;
      "
      class="q-pa-sm teste header-layout"
      color="green-4"
      bordered
    >
    <q-img >
      <img style="margin-top: 2rem;" class="logo-img" src="../assets/ecofood.png" />
    </q-img>
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
        <q-space />
        <div class="row justify-evenly">
          <q-space></q-space>

          <q-btn
            v-if="mostraIcone() == true"
            @click="$router.push({ name: 'carrinho' })"
            round
            color="primary"
            icon="shopping_cart"
          >
            <q-badge color="red" floating transparent>
              {{ quantidadeCarrinho() }}
            </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import ModalComanda from "src/pages/ModalComanda";
import { useQuasar, Quasar, QIcon } from "quasar";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
import { Screen } from "quasar";
import image from "src/assets/element.svg";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    return {};
  },

  computed: {
    shouldShowCartIcon() {
      return !this.somenteCardapio || (this.somenteCardapio && !Screen.lt.md);
    },
  },
  data() {
    return {
      btnConfig: !["/inicio", "/lancamento"].includes(this.$route.path),
    };
  },
  watch: {
    "$route.path"() {
      this.showIcon = this.$route.path !== "/index";
      this.btnConfig = !["/inicio", "/lancamento"].includes(this.$route.path);
    },
  },
  async created() {
    const dados = JSON.parse(localStorage.getItem("appAtdConf"));

    if (dados && dados.length > 0) {
      this.somenteCardapio = dados[0].somenteCardapio;
    }
  },

  methods: {
    async loadComanda(num) {
      this.$q.loading.show();
      await controllerComanda.dispatch("LOAD_COMANDA", { num: num });
      this.$q.loading.hide();

      (await this.validarComanda(controllerComanda.state.comanda)) == true
        ? this.abrirAtendente()
        : (this.comanda = []);
    },

    async abrirAtendente() {
      this.comanda = controllerComanda.state.comanda;

      if (this.comanda.length == 0) return;
      const idComandaAtual = this.comanda[0].id_comanda;

      if (controllerOperador.state.manterOperador) {
        this.$router.push({ path: "/lancamento" });
        return;
      }

      this.$q
        .dialog({
          component: ModalAtendente,
          //componentProps: { obj: this.operador },
        })
        .onOk(async () => {
          this.operador = controllerOperador.state.operador;
          if (this.operador.length == 0) {
            this.liberarComanda();
            return;
          }
          await this.loadPag();
          this.$router.push({ path: "/lancamento" });
        })
        .onCancel(async () => {
          this.liberarComanda();
        });
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

    mostraIcone() {
      if (
        this.$route.path !== "/index" ||
        (this.somenteCardapio && Screen.lt.md)
      ) {
        return false;
      } else {
        return true;
      }
    },

    mostraHeader() {
      if (this.$route.path !== "/" && this.$route.path !== "/nutricao" ) {
        return true;
      } else {
        return false;
      }
    },
    quantidadeCarrinho() {
      const itensSelecionados = controllerItensPedido.state.itensSelecionados;
      let totalQuantidade = 0;

      for (const item of itensSelecionados) {
        totalQuantidade += item.quantidade;
      }

      return totalQuantidade;
    },
  },
});
</script>
<style>
.logo-img {
  width: 150px;
  height: 50px;
  margin-top: 10px;
  margin-left: 10px;
}

.header-layout {


}
@media (min-width: 768px) {
  .q-header {
    background-size: cover;
    background-position: 50%;
    justify-content: center;
    height: 260px;
  }
}

@media (max-width: 767px) {
  .q-header {
    height: 100px;
  }
}
</style>
