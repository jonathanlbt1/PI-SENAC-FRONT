<template>
  <q-page-container
    v-once
    style="padding-top: 0px; padding-bottom: 0px !important"
  >
    <div class="col-4">
      <q-img
        src="../assets/cover.jpg"
        :ratio="16 / 9"
        style="object-fit: cover; max-height: 150px; display: none"
      />
    </div>
    <div class="q-gutter-md">
      <div
        style="background-color: white; z-index: 1000; position: relative"
        class="row"
      >
        <Carousel
          style="
            background-color: white;
            width: 100%;
            margin: 20px auto;
            height: 50px;
          "
          class="lt-md"
          :items-to-show="4"
          :wrap-around="true"
        >
          <Slide v-for="grupo in dadosGrupos" :key="grupo.id_grupo">
            <div class="row content-start">
              <q-card
                no-border
                class="shadow-2 no-border no-shadow column items-center content-center"
                style="
                  display: flex;
                  flex-direction: column;

                  margin-top: 3px;
                  margin-right: 5px;
                  max-width: 80px;
                  background-color: transparent;
                "
                @click="selecionaUmGrupoMobile(grupo.id_grupo)"
                :class="{
                  'grupo-selecionado': grupo.id_grupo === grupoSelecionado,
                }"
              >
                <q-img

                  :src="
                    grupo.imagem_grupo || require('../assets/imagem-padrao.jpg')
                  "
                  style="
                    width: 50px;
                    max-width: 50px;
                    max-height: 50px;
                    min-height: 50px;
                    min-width: 50px;
                    object-fit: contain !important;
                  "
                />
                <q-card-section style="flex-grow: 1">
                  <div class="row no-wrap" style="font-size: 10px">
                    {{ grupo.desc_grupo }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>

        <span
          v-if="visibleGrupo"
          style="margin-top: 100px; color: #3f3e3e"
          class="lt-md text-h6 text-weight-medium q-ml-md"
        >
          Destaques
        </span>
        <Carousel
          style="width: 100%"
          class="lt-md"
          :items-to-show="1.5"
          :wrap-around="true"
          v-if="visibleGrupo"
        >
          <Slide v-for="item in produtosDestaque" :key="item.id_produto">
            <div class="row content-start">
              <q-card
                no-border
                class="my-card col-sm-6 col-md-4 col-lg-3"
                bordered
                flat
                style="
                  border-radius: 25px;
                  max-width: 100%;
                  min-width: 100%;
                  margin-top: 2rem;
                "
              >
                <q-img
                  :src="
                    item.imagem_produto == null || item.imagem_produto == ''
                      ? require('../assets/imagem-padrao.jpg')
                      : item.imagem_produto
                  "
                  style="
                    width: 100%;
                    max-width: 100%;
                    max-height: 209px;
                    min-height: 209px;
                    min-width: 230px;
                  "
                />

                <q-card-section>
                  <div class="row no-wrap items-center">
                    <div
                      style="font-size: 12px"
                      class="col text-h6 ellipsis text-weight-medium"
                    >
                      {{ item.desc_produto }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div class="text-subtitle" style="font-weight: 700">
                    R$ {{ precoProduto(item) }}
                    {{ unidadeProduto(item) }}
                  </div>
                  <div class="text-caption text-grey">
                    Valor total: R$
                    {{ valorBR(precoProduto(item) * pegaQuantidade(item)) }}
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions
                  class="q-card-actions-centered row items-center justify-between no-wrap"
                >
                  <div
                    style="width: 100%"
                    class="row items-center row items-center justify-between no-wrap"
                  >
                    <q-btn round color="red" @click="removeDoCarrinho(item)">
                      <q-icon name="remove" />
                    </q-btn>
                    <p class="q-pa-none">{{ pegaQuantidade(item) }}</p>
                    <q-btn
                      round
                      color="green-4"
                      @click="adicionaAoCarrinho(item)"
                    >
                      <q-icon name="add" />
                    </q-btn>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </Slide>
        </Carousel>

        <div
          style="margin-top: 50px; margin-left: 5px"
          class="lt-md col-md-9 col-sm-12"
        >
          <div class="q-list">
            <div v-for="subgrupo in dadosSubGrupos" :key="subgrupo.id_subgrupo">
              <h3
                style="font-size: 15px; color: #3f3e3e"
                class="text-h6 text-weight-medium q-ml-md"
              >
                {{ subgrupo.desc_subgrupo }}
              </h3>
              <div v-for="item in subgrupo.produtos" :key="item.id_produto">
                <q-list
                  :class="{
                    'text-h6': $q.screen.gt.xs,
                  }"
                  bordered
                >
                  <q-item
                    class="items-center justify-start row wrap justify-between row"
                    :class="{
                      'bg-white': item.combinado_item === 0,
                      'bg-yellow-3': item.combinado_item > 0,
                    }"
                  >
                    <q-item-section
                      fit="contain"
                      class="text-bold flex-start col-xs-4 col-1"
                    >
                      <q-img
                      @click = "abrirInfoNutricional(item)"
                        :src="
                          item.imagem_produto == null ||
                          item.imagem_produto == ''
                            ? require('../assets/imagem-padrao.jpg')
                            : item.imagem_produto
                        "
                        fit="contain"
                        position="50% 50%"
                        style="
                          width: auto;
                          max-width: 100px;
                          max-height: 100px;
                          min-height: 100px;
                          min-width: 100px;
                        "
                      />
                    </q-item-section>

                    <q-item-section
                      :class="{
                        transparent: $q.screen.xs,
                        'text-caption': $q.screen.xs,
                        'text-weight-light': $q.screen.xs,
                      }"
                      class="col-xs-4 col-5.5"
                    >
                      <q-item-label
                        :class="{
                          'text-weight-light': $q.screen.xs,
                        }"
                      >
                        <p>
                          {{ item.quantidade }} {{ item.desc_produto }}
                        </p></q-item-label
                      >

                      <span
                        class="text-bold"
                        :class="{
                          'text-weight-light': $q.screen.xs,
                        }"
                      >
                        R$ {{ valorBR(precoProduto(item),2)}}
                        {{ unidadeProduto(item) }}
                      </span>
                      <span
                        v-bind:style="{
                          visibility: somenteCardapio ? 'hidden' : 'visible',
                        }"
                        class="text-bold"
                        :class="{
                          'text-weight-medium': $q.screen.xs,
                        }"
                      >
                        Total: R$

                        {{
                          valorBR(precoProduto(item) * pegaQuantidade(item),2)
                        }}
                      </span>
                    </q-item-section>
                    <q-item-section
                      v-bind:class="{
                        esconder: somenteCardapio,
                        mostrar: !somenteCardapio,
                      }"
                      class="col-xs-4 col-5.5 p-md"
                    >
                      <div
                        class="row inline items-center justify-evenly no-wrap p-md no-shadow"
                      >
                        <q-btn
                          class="no-shadow teste"
                          :class="{
                            transparent: $q.screen.xs,
                            'text-dark': $q.screen.xs,
                            'no-shadow': $q.screen.xs,
                          }"
                          v-if="pegaQuantidade(item) === 1"
                          round
                          color="negative"
                          @click="removeDoCarrinho(item)"
                        >
                          <q-icon
                            :class="{
                              'text-red': $q.screen.xs,
                            }"
                            name="delete_forever"
                          />
                        </q-btn>
                        <q-btn
                          v-else
                          :class="{
                            transparent: $q.screen.xs,
                            'no-shadow': $q.screen.xs,
                          }"
                          round
                          color="red"
                          @click="removeDoCarrinho(item)"
                        >
                          <q-icon
                            :class="{
                              primary: $q.screen.md,
                              'text-dark': $q.screen.xs,
                            }"
                            name="remove"
                          />
                        </q-btn>
                        <p
                          style="margin-top: 11px"
                          class="q-pa-none text-center"
                        >
                          {{ pegaQuantidade(item) }}
                        </p>
                        <q-btn
                          :class="{
                            transparent: $q.screen.xs,
                            'no-shadow': $q.screen.xs,
                          }"
                          round
                          color="green-4"
                          @click="adicionaAoCarrinho(item)"
                        >
                          <q-icon
                            :class="{
                              primary: $q.screen.md,
                              'text-dark': $q.screen.xs,
                            }"
                            name="add"
                          />
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-footer
      v-if="quantidadeCarrinho() > 0"
      @click="$router.push({ name: 'carrinho' })"
      class="lt-md bg-white fixed bottom fixed-bottom bg-blue-12"
      style="position: fixed; margin-top: 5rem; background-color: #A0C7AA!important; height: 94px; width: 100%; bottom: 0px; display: flex; "

    >
      <q-toolbar style="font-size: 10px; color: white">
        <q-toolbar-title class="text-white-10">
          <q-btn class="btn-icon"
            v-if="mostraIcone() == true"
            @click="$router.push({ name: 'carrinho' })"

            icon="shopping_cart"
            style="background-color:transparent; box-shadow: none;"

          >
            <q-badge style="margin-top: 8px" color="red" floating transparent>
              {{ quantidadeCarrinho() }}
            </q-badge>
          </q-btn>
        </q-toolbar-title>
        <q-toolbar-title class="text-white text-left">
          <div
            style="font-size: 14px; color: white; text-align: center; margin-top: 10px; margin-left: 10px;"
            class="text-body1 text-weight-bold text-h6 text-center"
          >
            Ver carrinho
          </div>
        </q-toolbar-title>
        <q-toolbar-title class="text-white-10">
          <div class="text-h6 text-white">
            R$ {{ valorBR(totalDoPedido - totalDesconto, 2) }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-page-container>
</template>
<style>
.products-container {
  margin-left: 30px;
}

.grupo-selecionado {
  background-color: #f5f5f5;
  font-weight: 400;
  color: rgb(243, 25, 25);
}

.subgrupo-selecionado {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #ff9800;
}

.esconder {
  visibility: hidden;
}

.mostrar {
  visibility: visible;
}

.btn-icon {
  background-color: transparent;
  box-shadow: none;
}
</style>

<script>
import { defineComponent, mapActions, mapState } from "vue";
import { useQuasar } from "quasar";
import { QPageContainer, QCard, QCardSection, QImg, QBtn, QIcon } from "quasar";
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import dataHora from "src/mixins/dataHoraMixin.js";
import controlProduto from "src/pages/storesPages/produto.store";
import controleGrupos from "src/pages/storesPages/grupo.store";
import controleSubGrupo from "src/pages/storesPages/subGrupo.store";
import controlConfigura from "src/pages/storesPages/configura.store";
import controleItensPedido from "src/pages/storesPages/itensPedido.store";
import controllerComanda from "src/pages/storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import controllerConfigura from "src/pages/storesPages/configura.store";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import VueSlickCarousel from "vue-slick-carousel";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { slider, slideritem } from "vue-concise-slider";
import InfoNutricional from "src/components/InfoNutricional.vue";

export default defineComponent({
  name: "MobileIndexPage",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  components: {
    Carousel,
    Slide,
    Navigation,

  },
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
      slide: ref(1),
      skeletonTypes: [
        "text",
        "rect",
        "circle",
        "QBtn",
        "QBadge",
        "QChip",
        "QToolbar",
        "QCheckbox",
        "QRadio",
        "QToggle",
        "QSlider",
        "QRange",
        "QInput",
        "QAvatar",
      ],
    };
  },

  data() {
    return {
      visibleGrupo: true,
      visibleSubGrupo: false,
      visibleProduto: false,
      grupoSelecionado: null,
      subGrupoSelecionado: null,
      dadosGrupos: [],
      totalPedido: 0,
      totalDesconto: 0,
      quantidadeItemPedido: 0,
      dadosSubGrupos: [],
      dadosProdutos: [],
      loadItens: 0,
      itemCount: 0,
      item: {},
      imageProduto: null,
      isDesktop: true,
      produtosDestaque: [],
      autoplay: true,
      firstCarouselSlide: 1,
      secondCarouselSlide: 1,
      settings: {
        itemsToShow: 1,
        snapAlign: "center",
      },
    };
  },
  computed: {
    totalDoPedido() {
      let itens = controleItensPedido.state.itensSelecionados;
      let total = 0;
      let teste = 0;

      itens.map((item) => {
        if (item.desc_unidade === "KG") {
          this.calcularGramasItemPedido(item);
          teste = item.venda_produto * this.quantidadeItemPedido;
        } else {
          teste = item.venda_produto * item.quantidade;
        }
        total = total + teste;
      });

      return total;
    },
  },

  async created() {
    this.$q.loading.show();
    this.dadosComanda = controllerComanda.state.comanda[0];
    this.dadosOperador = controllerOperador.state.operador[0];
    this.dadosConfigura = controllerConfigura.state.configTerminal[0];
    this.dadosProdutos = controlProduto.state.produtos;
    this.$q.loading.hide();
    this.loadProdutosAleatorios();
    this.produtosDestaque = JSON.parse(
      localStorage.getItem("produtosDestaque")
    );
    this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));
    this.somenteCardapio = this.verificaCardapio();
  },

  async mounted() {
    this.loadGrupos();
  },

  methods: {
    async loadProdutosAleatorios() {
      await controlProduto.dispatch("LOAD_PRODUTOS");

      this.produtosDestaque = controlProduto.state.produtos.filter((produto) =>
        [474, 475, 476].includes(produto.id_produto)
      );
    },

    async abrirInfoNutricional(item) {
      this.$q
        .dialog({
          component: InfoNutricional,
          componentProps: { item: item },
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


    precoProduto(item) {
  this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));

  if (item.desc_unidade === "KG" && this.configLocal) {
    this.valorVenda = this.configLocal[0].valorVenda;
    if (this.valorVenda.value === 4) { // Verifica se o valorVenda é igual a 4
      return `${item.venda_produto}`;
    }

    this.quantidadeEmGramas = parseInt(this.valorVenda.value);
    this.precoPorQuilo = item.venda_produto;
    this.precoPorGrama = (this.quantidadeEmGramas * this.precoPorQuilo) / 1000;

    // Converter para número e arredondar
    this.precoPorGrama = Math.round(this.precoPorGrama * 1000) / 1000;

    return `${this.precoPorGrama}`;
  }
  return `${item.venda_produto}`;
},


    unidadeProduto(item) {
      this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));
      if (item.desc_unidade === "KG" && this.configLocal) {
        this.valorVenda = this.configLocal[0].valorVenda;

        if (this.valorVenda.value === 4) {
          return `${item.desc_unidade}`;
        }

        this.quantidadeEmGramas = parseInt(this.valorVenda.value);

        return `/${this.quantidadeEmGramas}g`;
      }
      return `${item.desc_unidade}`;
    },

    quantidadeCarrinho() {
      this.itensSelecionados = controllerItensPedido.state.itensSelecionados;
      this.totalQuantidade = 0;

      for (const item of this.itensSelecionados) {
        this.totalQuantidade += item.quantidade;
      }

      return this.totalQuantidade;
    },

    verificaCardapio() {
      this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));
      if (this.configLocal) {
        this.somenteCardapio = this.configLocal[0].somenteCardapio;
        if (this.somenteCardapio === true && Screen.lt.xs) {
          return true;
        }
      }
      return false;
    },

    async loadGrupos() {
      await controleGrupos.dispatch("LOAD_GRUPOS");
      this.dadosGrupos = controleGrupos.state.grupos.map((grupo) => ({
        ...grupo,
        subGrupos: [],
      }));
    },

    async selecionaUmGrupoMobile(id) {
      this.$q.loading.show();
      this.grupoSelecionado = id;
      this.visibleGrupo = false;
      this.visibleSubGrupo = true;
      this.visibleProduto = false;
      this.loadItens = 0;

      // Carregar os subgrupos relacionados ao grupo selecionado
      await controleSubGrupo.dispatch("LOAD_SUBGRUPOS", id);

      // Atualizar a variável dadosSubGrupos com os subgrupos carregados
      this.dadosSubGrupos = controleSubGrupo.state.subGrupos;

      // Carregar os produtos para cada subgrupo encontrado
      for (const subgrupo of this.dadosSubGrupos) {
        await controlProduto.dispatch(
          "LOAD_PRODUTOS_SUBGRUPO",
          subgrupo.id_subgrupo
        );
        subgrupo.produtos = controlProduto.state.produtos;
      }
      this.$q.loading.hide();
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

    async adicionaAoCarrinho(product) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (item) => item.id_produto === product.id_produto
      );

      if (index !== -1) {
        // Aqui se o produto está na lista estou atualizando a quantidade
        controleItensPedido.state.itensSelecionados[index].quantidade++;
      } else {
        // Se o produto não está na lista, é adicionado um novo item ao array
        const itemSelecionado = {
          id_produto: product.id_produto,
          venda_produto: product.venda_produto,
          quantidade: 1,
          desc_produto: product.desc_produto,
          imagem_produto: product.imagem_produto,
          desc_unidade: product.desc_unidade,
        };
        controleItensPedido.commit("SET_ITENS_SELECIONADOS", [
          ...controleItensPedido.state.itensSelecionados,
          itemSelecionado,
        ]);
      }
    },

    async removeDoCarrinho(product) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (item) => item.id_produto === product.id_produto
      );

      if (index !== -1) {
        if (controleItensPedido.state.itensSelecionados[index].quantidade > 1) {
          controleItensPedido.state.itensSelecionados[index].quantidade--;
        } else {
          controleItensPedido.state.itensSelecionados.splice(index, 1);
        }
      }
    },

    pegaQuantidade(item) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (selectedItem) => selectedItem.id_produto === item.id_produto
      );
      return index !== -1
        ? controleItensPedido.state.itensSelecionados[index].quantidade
        : 0;
    },

    async incluirItemPedido(id, venda, qtde) {
      const dadosSalvaItem = [
        {
          origem_item: this.dadosComanda.origem_comanda + 1,
          cadeira_item: 1,
          id_comanda: this.dadosComanda.id_comanda,
          id_produto: id,
          venda_item: venda,
          qtd_item: qtde,
          id_funcionario: this.dadosOperador.id_funcionario,
        },
      ];
      //console.log(this.dadosComanda);

      return await controllerItensPedido.dispatch(
        "INCLUIR_ITEMPEDIDO",
        dadosSalvaItem[0]
      );
    },

    decreaseItemCount(product) {
      if (product.quantity > 0) {
        product.quantity--;
        controleItensPedido.commit("CANCELAR_ITEMPEDIDO", product);
      }
    },

    calcularGramasItemPedido(item) {
      this.valorVenda = this.configLocal[0].valorVenda;
      let tara = item.quantidade * this.valorVenda.value;
      this.quantidadeItemPedido =
        item.desc_unidade === "KG"
          ? this.valorVenda.value !== 4
            ? tara / 1000
            : item.quantidade
          : item.quantidade;
    },

    produtoSelecionado(item) {
      this.$q
        .dialog({
          component: modalQuantidade,
          //componentProps: { obj: this.operador },
        })
        .onOk(async (quantidade) => {
          item.quantidade = quantidade;
          //Deve gravar aqui para a tela ser intermitente
          this.onDialogOK(item);
        })
        .onCancel(() => {
          this.item = [];
        });
    },
  },
});
</script>
