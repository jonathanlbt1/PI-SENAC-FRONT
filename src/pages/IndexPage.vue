<template>
  <q-page-container
    v-once
    style="padding-top: 0px; padding-bottom: 0px !important"
  >
    <MobileIndexPage />
    <div class="gt-sm q-gutter-md">
      <div class="row justify-center">
        <div class="gt-xs col-12 col-md-3 mt-3 mt-md-0 col-sm-3" solid>
          <q-card
            class="q-dialog-plugin no-shadow no-border-radius"
            solid
            bordered
            style="
              max-height: 100%;
              position: sticky;
              top: 0;
              width: 100%;
              border-left: 1px solid #ccc;
              height: 100%;
              background-color: rgb(255, 255, 255);
              shadow: none;
            "
          >
            <q-expansion-item
              class="text-h7 text-weight-bold"
              icon="group"
              label="Categorias"
              :default-opened="visibleGrupo"
            >
              <q-expansion-item
                :content-inset-level="0.5"
                class="text-h7 text-weight-bold"
                v-for="grupo in dadosGrupos"
                :key="grupo.id_grupo"
                :label="grupo.desc_grupo"
                @click="selecionaUmGrupo(grupo.id_grupo)"
                :class="{
                  'grupo-selecionado': grupo.id_grupo === grupoSelecionado,
                }"
              >
                <q-expansion-item

                  :content-inset-level="0.5"
                  class="text-h7 text-weight-bold"
                  outline
                  outline-color="orange"
                  v-for="subgrupo in grupo.subGrupos"
                  :key="subgrupo.id_subgrupo"
                  :label="subgrupo.desc_subgrupo"
                  @click="selecionaUmSubGrupo(subgrupo.id_subgrupo)"
                  :class="{
                    'subgrupo-selecionado':
                      subgrupo.id_subgrupo === subGrupoSelecionado,
                  }"
                ></q-expansion-item>
              </q-expansion-item>
            </q-expansion-item>
            <q-separator />
            <q-card-section v-if="somenteCardapio === false">
              <h2 class="text-h6 text-weight-bold">Meu carrinho</h2>

              <q-btn
                square
                color="primary"
                icon="shopping_cart"
                class="material-icons-outlined"
                label="Ir ao carrinho"
                @click="$router.push({ name: 'carrinho' })"
                style="
                  margin-top: 10px;
                  width: 100%;
                  height: 50px;
                  font-size: 15px;
                  color: black;
                  border-radius: 15px;
                "
              >
                <q-badge color="red" floating transparent>
                  {{ quantidadeCarrinho() }}
                </q-badge>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>

        <div
         style="border-radius: 25px"
          v-if="visibleGrupo"
          class="q-pa-md col-md-9 col-sm-9"
        >
          <q-carousel
            class="gt-xs"
            style="border-radius: 25px; max-height: 16rem"
            animated
            v-model="secondCarouselSlide"
            arrows
            navigation
            infinite
            :autoplay="autoplay"
            transition-prev="slide-right"
            transition-next="slide-left"
          >
            <q-carousel-slide :name="1" img-src="../assets/banner2.jpg" />
            <q-carousel-slide :name="2" img-src="../assets/banner3.jpg" />
            <q-carousel-slide :name="3" img-src="../assets/banner2.jpg" />
            <q-carousel-slide :name="4" img-src="../assets/banner3.jpg" />
          </q-carousel>

          <h1 class="xl text-h6">Destaques</h1>

          <div
            class="gt-xs row items-start q-gutter-md q-mb-md text-weight-bold"
          >
            <q-card
              v-for="item in produtosDestaque"
              :key="item.id_produto"
              class="my-card col-sm-6 col-md-4 col-lg-3 text-center"
              bordered
              flat
              style="
                border-radius: 25px;
                max-width: 15rem;
                min-width: 15rem;
                margin-top: 2rem;
              "
            >
              <q-card
                no-border
                class="shadow-2 no-border"
                style="display: flex; justify-content: center; margin-top: 3px"
              >
                <q-img
                  :src="
                    item.imagem_produto == null || item.imagem_produto == ''
                      ? require('../assets/imagem-padrao.jpg')
                      : item.imagem_produto
                  "
                  style="
                    width: 220px;
                    max-width: 230px;
                    max-height: 209px;
                    min-height: 209px;
                    min-width: 230px;
                    object-fit: contain !important;
                  "
                />
              </q-card>
              <q-card-section>
                <div class="row no-wrap items-center">
                  <div
                    style="font-size: 12px"
                    class="col text-h6 ellipsis text-weight-bold"
                  >
                    {{ item.desc_produto }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div
                  class="text-subtitle1"
                  style="font-weight: 700; color: #0d47a1"
                >
                  R$ {{ item.venda_produto }}
                  {{ item.desc_unidade }}
                </div>
                <div class="text-caption text-grey">
                  Valor total: R$
                  {{ valorBR(precoProduto(item) * pegaQuantidade(item), 2) }}
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
        </div>

        <div class="col-md-9 col-sm-9">
          <h2
            class="text-h6 text-weight-bold"
            style="margin-left: 6%"
            v-if="visibleSubGrupo"
          >
            Selecione um subgrupo
          </h2>
          <h2
            v-if="visibleProduto"
            class="text-h6 text-weight-bold"
            style="margin-left: 6%"
          >
            Selecione seus produtos!
          </h2>
          <div
            v-if="visibleProduto"
            class="row items-start q-gutter-md q-mb-md products-container text-weight-bold"
          >
            <div
              v-for="item in dadosProdutos"
              :key="item.id_produto"
              class="product-card product-image"
            >
              <q-card
                class="my-card col-sm-6 col-md-4 col-lg-3 text-center"
                bordered
                flat
                style="border-radius: 25px; max-width: 15rem; min-width: 15rem"
              >
                <q-card
                  no-border
                  class="shadow-2 no-border"
                  style="
                    display: flex;
                    justify-content: center;
                    margin-top: 1px;
                  "
                >
                  <q-img
                    :src="
                      item.imagem_produto == null || item.imagem_produto == ''
                        ? require('../assets/imagem-padrao.jpg')
                        : item.imagem_produto
                    "
                    style="
                      width: 220px;
                      max-width: 230px;
                      max-height: 209px;
                      min-height: 209px;
                      min-width: 230px;
                      object-fit: cover;
                    "
                  />
                </q-card>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <div
                      style="font-size: 12px"
                      class="col text-h6 ellipsis text-weight-bold"
                    >
                      {{ item.desc_produto }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div
                    class="text-subtitle1"
                    style="font-weight: 700; color: #0d47a1"
                  >
                    R$ {{ precoProduto(item) }}
                    {{ unidadeProduto(item) }}
                  </div>
                  <div class="text-caption text-grey">
                    Valor total: R$
                    {{ valorBR(precoProduto(item) * pegaQuantidade(item), 2) }}
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
          </div>
        </div>
      </div>
    </div>
  </q-page-container>
</template>
<style>
.products-container {
  margin-left: 30px;
}

.grupo-selecionado {
  background-color: #f5f5f5;
  font-weight: bold;
}

.subgrupo-selecionado {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #ff9800;
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
import MobileIndexPage from "src/components/MobileIndexPage.vue";
export default defineComponent({
  name: "IndexPage",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  components: {
    MobileIndexPage,
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

      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: 3.5,
          snapAlign: "center",
        },
        // 1024 and up
        1024: {
          itemsToShow: 5,
          snapAlign: "start",
        },
      },
    };
  },
  computed: {
    totalDoPedido() {
      return this.dadosProdutos.reduce(
        (total, item) => total + item.venda_produto * item.quantity,
        0
      );
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

    async loadGrupos() {
      await controleGrupos.dispatch("LOAD_GRUPOS");
      this.dadosGrupos = controleGrupos.state.grupos.map((grupo) => ({
        ...grupo,
        subGrupos: [],
      }));
    },

    async atualizarGripProduto() {
      await controllerItensPedido.dispatch(
        "LOAD_ITENSPEDIDO",
        this.dadosComanda.id_comanda
      );
      this.dadosItensPedido = controllerItensPedido.state.itensPedido;
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

    async voltarInicio() {
      this.visibleGrupo = true;
      this.visibleSubGrupo = false;
      this.visibleProduto = false;
    },

    async selecionaUmGrupo(id) {
      this.grupoSelecionado = id;
      this.visibleGrupo = false;
      this.visibleSubGrupo = true;
      this.loadItens = 0;
      this.dadosSubGrupos = []; // não mostrar a anterior
      const grupo = this.dadosGrupos.find((item) => item.id_grupo === id);

      if (grupo) {
        await controleSubGrupo.dispatch("LOAD_SUBGRUPOS", id);
        grupo.subGrupos = controleSubGrupo.state.subGrupos;
        this.dadosSubGrupos = grupo.subGrupos;
        this.loadItens = 1;
      }
    },

    precoProduto(item) {
      this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));

      if (item.desc_unidade === "KG" && this.configLocal) {
        this.valorVenda = this.configLocal[0].valorVenda;
        if (this.valorVenda.value === 4) {
          return `${item.venda_produto}`;
        }

        this.quantidadeEmGramas = parseInt(this.valorVenda.value);
        this.precoPorQuilo = item.venda_produto;
        this.precoPorGrama =
          (this.quantidadeEmGramas * this.precoPorQuilo) / 1000;

        return `${this.precoPorGrama.toFixed(2)}`;
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
    async selecionaUmSubGrupo(id) {
      this.subGrupoSelecionado = id;
      this.visibleGrupo = false;
      this.visibleSubGrupo = false;
      this.visibleProduto = true;
      this.loadItens = 0;
      this.dadosProdutos = []; //limpa a anterior
      await controlProduto.dispatch("LOAD_PRODUTOS_SUBGRUPO", id);
      this.dadosProdutos = controlProduto.state.produtos.map((product) => ({
        ...product,
        quantity: 0,
      }));
      this.loadItens = 1;
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
        this.itemSelecionado = {
          id_produto: product.id_produto,
          venda_produto: product.venda_produto,
          quantidade: 1,
          desc_produto: product.desc_produto,
          imagem_produto: product.imagem_produto,
          desc_unidade: product.desc_unidade,
        };
        controleItensPedido.commit("SET_ITENS_SELECIONADOS", [
          ...controleItensPedido.state.itensSelecionados,
          this.itemSelecionado,
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

    quantidadeCarrinho() {
      this.itensSelecionados = controllerItensPedido.state.itensSelecionados;
      this.totalQuantidade = 0;

      for (const item of this.itensSelecionados) {
        this.totalQuantidade += item.quantidade;
      }

      return this.totalQuantidade;
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
