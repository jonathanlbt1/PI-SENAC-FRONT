<template>
  <q-page class="q-pa-sm" :class="{
          'q-pb-xl': $q.screen.gt.xs,
        }" >
    <estadoCliente :cliente="dadosCliente" btnSair="x" :key="dadosCliente" />

    <div
      v-if="dadosComanda.origem_comanda == 3"
      class="text-bold row flex flex-center text-blue-10 bg-blue-2"
    >
      Agendado para :
      {{
        dataHoraBR(
          dadosComanda.dtentrega_comanda + " " + dadosComanda.hrentrega_comanda
        )
      }}
    </div>

    <div>

      <div
        class="text-h5 q-mb-xs flex flex-center text-bold"
      >
        <q-btn
        @click="voltarAsCompras"
          color="green-4"
          icon="arrow_back"
          class="q-ma-xs"

          label="Continuar comprando"
          style="z-index: 10000"
        />


        <q-space />



      </div>
      <div style="display:flex;" >
        <h1
        class="text-h5 text-weight-bold text-justify text-bold q-pa-md poppins"
      >
       Sua Cesta
      </h1>
      <q-img
        class="q-mt-xl"
        src="../assets/basket.png"
        style="max-width: 40px; max-height: 40px'; margin-top: -3px;"
      />
      </div>



      <div
        class="text-h5 q-mb-xs flex flex-center text-red-10 q-mt-lg bg-red-2 text-bold q-pa-lg"
        v-if="itensSelecionados.length === 0"
      >
        {{ loadItens == 0 ? " Verificando Itens" : "Sem itens " }}
        <q-space />
        <div class="row flex flex-center" v-if="loadItens == 0">
          <q-spinner-hourglass color="red-10" size="2em" />
        </div>
      </div>
      <q-space></q-space>
      <q-space></q-space>
      <h1
        v-if="itensSelecionados.length === 0"
        class="text-h5 text-weight-bold text-center text-bold q-pa-md poppins justify-center position center"
      >
        Ops, ainda nao tem nada na sua sacola!
      </h1>
      <div v-if="itensSelecionados < 1">
        <q-space></q-space>
        <div class="flex flex-center">
          <q-img
            class="q-mt-xl"
            src="../assets/sacola.gif"
            style="max-width: 200px; max-height: 200px"
          />
        </div>
      </div>

      <q-list
        :class="{
          'text-h6': $q.screen.gt.xs,
        }"
        bordered
        v-for="item in itensSelecionados"
        :key="item.id_produto"

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
              :src="
                item.imagem_produto == null || item.imagem_produto == ''
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
            }"
            class="col-xs-4 col-5.5"
          >
            <q-item-label>
              <p>
                {{ item.quantidade }}x {{ item.desc_produto }}
              </p></q-item-label
            >

            <span class="text-bold"
              >R${{ valorBR(precoProduto(item),2) }}{{ unidadeProduto(item) }} </span
            >
            <span class="text-bold">
              Total: R$
              {{ valorBR(precoProduto(item) * pegaQuantidade(item) - totalDesconto,2) }}
            </span>
          </q-item-section>
          <q-item-section class="col-xs-4 col-5.5 p-md">
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
              <p style="margin-top: 11px" class="q-pa-none text-center">
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

  </q-page>

  <q-footer
  class="gt-sm bg-white shadow-4 text-weight-bold"
  style="


    padding-left: 2rem;
    padding-right: 2rem;
    color: black;
    position: fixed;



  "
>
  <q-toolbar>
    <q-toolbar-title class="text-white-10">
      <div class="text-body1 text-weight-bold">Pedido</div>
      <div class="text-weight-bold">R$ {{ valorBR(totalDoPedido, 2) }}</div>
    </q-toolbar-title>
    <q-toolbar-title class="text-red-10 text-left">
      <div class="text-body1 text-weight-bold">Desconto</div>
      <div>- R$ {{ valorBR(totalDesconto, 2) }}</div>
    </q-toolbar-title>
    <q-toolbar-title class="text-white-10">
      <div class="text-body1 text-weight-bold">A Pagar</div>
      <div class="text-weight-bold">
        R$ {{ valorBR(totalDoPedido - totalDesconto,2) }}
      </div>
    </q-toolbar-title>
    <q-item>
      <q-btn
        color="red"
        icon="close"
        label="Cancelar pedido"
        rounded
        style="height: 60px; margin-top: 10px"
        @click="cancelarPedido"
      ></q-btn>
    </q-item>
    <q-item>
      <q-btn
        size="14px"
        class="q-px-xl q-py-xs"
        color="green-4"
        label="Confirmar Pedido"
        rounded
        icon="check"
        style="height: 60px; margin-top: 10px"
        @click="router.push({ path: '/confirm' })"
      >
      </q-btn>

    </q-item>
  </q-toolbar>
</q-footer>


  <q-footer class="lt-md bg-white">
    <q-toolbar style="font-size: 10px; color: black">
      <q-toolbar-title class="text-white-10">
        <div
          style="font-size: 10px; color: black"
          class="text-body1 text-weight-bold text-h6"
        >
          Pedido
        </div>
        <div class="text-weight-bold text-h6">
          R$ {{ valorBR(totalDoPedido,2) }}
        </div>
      </q-toolbar-title>
      <q-toolbar-title class="text-red-10 text-left">
        <div
          style="font-size: 10px"
          class="text-body1 text-weight-bold text-h6"
        >
          Desconto
        </div>
        <div>- R$ {{ valorBR(totalDesconto, 2) }}</div>
      </q-toolbar-title>
      <q-toolbar-title class="text-white-10">
        <div
          style="font-size: 10px"
          class="text-body1 text-weight-bold text-h6"
        >
          A Pagar
        </div>
        <div class="text-h6">
          R$ {{ valorBR(totalDoPedido - totalDesconto,2) }}
        </div>
      </q-toolbar-title>
    </q-toolbar>
    <q-item>
      <q-btn
        class="q-px-xl q-py-xs"
        color="green-4"
        label="Confirmar Pedido"
        icon="check"
        style="height: 50px; width: 100%; margin-top: 10px"
        @click="revisarPedido"
      >
      </q-btn>
    </q-item>
    <q-item>
      <q-btn
        color="red"
        icon="close"
        label="Cancelar pedido"
        style="height: 50px; width: 100%; margin-top: 10px"
        @click="cancelarPedido"
      ></q-btn>
    </q-item>

  </q-footer>

  <div class="q-px-sm" v-if="itensCombinados.length > 0">
    Para combinar: <strong>{{ itensCombinados.length }}</strong>
  </div>
</template>

<style>
.no-shadow:before {
  box-shadow: none;
}

@media (min-width: 900px) {
  .q-page {

  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar, Screen } from "quasar";
import { useStore } from "vuex";
import controlProduto from "src/pages/storesPages/produto.store";
import controllerComanda from "src/pages/storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import controllerConfigura from "src/pages/storesPages/configura.store";
import controllerCliente from "src/pages/storesPages/cliente.store";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
import controllerParametro from "src/pages/storesPages/parametro.store";
import dataHora from "src/mixins/dataHoraMixin.js";
import controleItensPedido from "src/pages/storesPages/itensPedido.store";
import estadoOperador from "src/components/estadoOperador.vue";
import estadoCliente from "src/components/estadoCliente.vue";
import ModalCancelamento from "src/pages/ModalCancelamento.vue";
import ModalComanda from "src/pages/ModalComanda.vue";
import validarComanda from "src/mixins/validarComanda.js";

export default defineComponent({
  name: "lancamentoComanda",
  mixins: [dataHora, validarComanda],
  setup() {
    const $q = useQuasar();
    const dadosComanda = [];
    const dadosOperador = [];
    const dadosConfigura = [];
    return {
      splitterModel: ref(0),
      selected: ref("BEBIDAS"),
    };
  },
  data() {
    return {
      tab: ref("pedido"),
      dadosGrupo: [],
      dadosCliente: [],
      dadosItensPedido: [],
      codDescricao: "",
      qtde: "",
      model: "",
      totalPedido: 0,
      totalDesconto: 0,
      loadItens: ref(0), //apenas serve para mostrar o load e o rodapé após carregar itens
      textProcuraProduto: "",
      dadosProdutos: [],
      pesquisar: "",
      itensCombinados: ref([]),
      habilitarCombinado: false,
      quantidadeItemPedido: 0,

    };
  },
  components: {
    estadoCliente,
  },
  mounted() {},

  computed: {
    comFiltro() {
      if (this.pesquisar) {
        //pesquisar por código
        let exp = new RegExp(this.pesquisar.trim(), "i");
        return this.dadosProdutos.filter((dado) => exp.test(dado.desc_produto));
      } else {
        return this.dadosProdutos;
      }
    },

    itensSelecionados() {
      return controleItensPedido.state.itensSelecionados;

    },

    totalDoPedido() {
      let itens = controleItensPedido.state.itensSelecionados;
      let total = 0
      let teste = 0

   itens.map((item) => {
        if (item.desc_unidade === "KG") {
          this.calcularGramasItemPedido(item);
          teste = item.venda_produto * this.quantidadeItemPedido;

        } else {
          teste = item.venda_produto * item.quantidade;
        } total = total + teste;

      });

      return total.toFixed(2);
  },
},


  watch: {
    dadosCliente() {
      //console.log('tipo de pedido set');
      //this.dadosComanda.origem_comanda = controllerComanda.state.tipoDePedido;
    },
    dadosItensPedido() {
      this.itensCombinados = [];
      this.totalPedido = 0;
      this.totalDesconto = 0;
      this.dadosItensPedido.map((dado) => {
        this.totalPedido += parseFloat(dado.total);
      });
      this.dadosItensPedido.map((dado) => {
        this.totalDesconto += parseFloat(dado.desconto_item);
      });
      this.loadItens = 1;
    },
  },

  async created() {
    this.$q.loading.show();
    this.dadosComanda = controllerComanda.state.comanda[0];
    this.dadosOperador = controllerOperador.state.operador[0];
    this.dadosConfigura = controllerConfigura.state.configTerminal[0];
    this.$q.loading.hide();
    this.configLocal = JSON.parse(localStorage.getItem("appAtdConf"));
  },

  methods: {
    async atualizarGripProduto() {
      await controllerItensPedido.dispatch(
        "LOAD_ITENSPEDIDO",
        this.dadosComanda.id_comanda
      );
      this.dadosItensPedido = controllerItensPedido.state.itensPedido;
    },

    revisarPedido() {
      this.$router.push({ path: "/confirm" });
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
    this.precoPorGrama = (this.quantidadeEmGramas * this.precoPorQuilo) / 1000;
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

    voltarAsCompras() {
      console.log("teste de click");
      this.$router.push({ path: "/index" });
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

    decreaseItemCount(product) {
      if (product.quantity > 0) {
        product.quantity--;
        controleItensPedido.commit("CANCELAR_ITEMPEDIDO", product);
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

    async adicionaAoCarrinho(product) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (item) => item.id_produto === product.id_produto
      );

      if (index !== -1) {
        controleItensPedido.state.itensSelecionados[index].quantidade++;
      } else {
        const itemSelecionado = {
          id_produto: product.id_produto,
          venda_produto: product.venda_produto,
          quantidade: 1,
          desc_produto: product.desc_produto,
          imagem_produto: product.imagem_produto,
        };
        controleItensPedido.commit("SET_ITENS_SELECIONADOS", [
          ...controleItensPedido.state.itensSelecionados,
          itemSelecionado,
        ]);
      }
    },

    async finalizarPedido() {
      if (this.dadosComanda.tipo === "Delivery" && this.totalPedido > 0) {
        this.$q
          .dialog({
            component: ModalImpresaoPedido,
            componentProps: { valores: this.totalPedido - this.totalDesconto },
          })
          .onOk(async (res) => {

          });
      }

      this.$q.loading.show();

      if (this.dadosComanda.num_comanda === 0) {
        this.$q.loading.hide();
        this.$router.go(-1);
        return false;
      }

      if (this.dadosComanda.fl_comanda === 1) {
        const rest = await controllerComanda.dispatch("ABRIR_COMANDA", {
          mesa_comanda: this.dadosComanda.mesa_comanda,
          num_comanda: this.dadosComanda.num_comanda,
          data_comanda: this.atualDataBD(),
          id_funcionario: this.dadosOperador.id_funcionario,
          id_cliente: 0,
          situacao_comanda: 0,
          origem_comanda: 0,
        });
        controllerComanda.state.comanda[0].id_comanda = rest[0];
        this.dadosComanda = controllerComanda.state.comanda[0];
      } else {
        await controllerComanda.dispatch("REABRIR_COMANDA", {
          id_comanda: controllerComanda.state.comanda[0].id_comanda,
        });
      }

      for (const item of controleItensPedido.state.itensSelecionados) {

      this.calcularGramasItemPedido(item);
        await this.incluirItemPedido(
          item.id_produto,
          item.venda_produto,
          this.quantidadeItemPedido,
          1
        );
      }

      await controllerComanda.dispatch("FECHAR_COMANDA", {
        id_comanda: controllerComanda.state.comanda[0].id_comanda,
        imprimir_cupom_producao: this.dadosConfigura.imprimir_cupom_producao,
        id_setor: this.dadosConfigura.id_setor,
      });

      controleItensPedido.commit("LIMPAR_ITENS_SELECIONADOS");
      this.$q.loading.hide();
      this.$router.push({ path: "/finalizacao" });
    },

    calcularGramasItemPedido(item) {
      this.valorVenda = this.configLocal[0].valorVenda;
        let tara = item.quantidade * this.valorVenda.value;
        this.quantidadeItemPedido = (item.desc_unidade === "KG" ? (this.valorVenda.value !== 4 ? tara / 1000 : item.quantidade )   : item.quantidade);

    },



    tipandoPedido(tipoAgora) {
      if (tipoAgora === null) return "";
      if (typeof tipoAgora == "undefined") return "";
      const tipos = [
        { label: "", value: 0 },
        { label: "| Entrega", value: 1 },
        { label: "| Balcão", value: 2 },
        { label: "| Retirada", value: 3 },
      ];
      const result = tipos.filter((tipo) => {
        return tipo.value === tipoAgora;
      });

      return result[0].label;
    },

    async incluirTaxaEntrega() {
      if (controllerCliente.state.selecionado[0].taxa_entrega_cliente == 0)
        return false;

      const dadosSalvaItem = [
        {
          origem_item: this.dadosComanda.tipo_comanda + 1,
          cadeira_item: 1,
          id_comanda: this.dadosComanda.id_comanda,
          id_produto: controllerParametro.state.parametro[0].id_taxa_entrega,
          venda_item:
            controllerCliente.state.selecionado[0].taxa_entrega_cliente,
          qtd_item: 1,
          id_funcionario: this.dadosOperador.id_funcionario,
        },
      ];

      await controllerItensPedido.dispatch(
        "INCLUIR_ITEMPEDIDO",
        dadosSalvaItem[0]
      );
      await this.atualizarGripProduto();
    },

    async listaProdutos() {
      this.$q
        .dialog({
          component: modalProdutos,
          //componentProps: { obj: this.operador },
        })
        .onOk(async (produto) => {
          this.$q.loading.show();

          //combinado
          if (produto.length > 1) {
            for (const element of produto) {
              await this.incluirItemPedido(
                element.id_produto,
                element.venda_produto,
                element.quantidade
              );
            }
            await this.atualizarGripProduto();
            this.$q.loading.hide();
            this.listaProdutos();
            return false;
          }

          //incluir taxa de entrega para o cliente
          if (this.dadosComanda.origem_comanda == 1) {
            if (this.dadosItensPedido.length == 0) {
              await this.incluirTaxaEntrega();
            }
          }

          var temp = await this.incluirItemPedido(
            produto.id_produto,
            produto.venda_produto,
            produto.quantidade
          );

          await this.atualizarGripProduto();
          this.$q.loading.hide();

          if (this.dadosConfigura.pede_obs_item == 1) {
            await this.abrirObsItem(temp);
            return false;
          }

          this.listaProdutos();
        });
    },

    async gravaItem() {
      //Caso nenhum produto localizado
      if (this.comFiltro.length == 0) {
        this.$q.notify({
          message: "Nenhum item encontrado",
          color: "negative",
          icon: "close",
        });
        return false;
      }

      //nesse caso a pesquisa retornou apenas um registro
      if (this.comFiltro.length == 1) {
        this.$q
          .dialog({
            component: modalQuantidade,
          })
          .onOk(async (quantidade) => {
            //incluir taxa de entrega para o cliente
            if (this.dadosComanda.origem_comanda == 1) {
              if (this.dadosItensPedido.length == 0) {
                await this.incluirTaxaEntrega();
              }
            }
            await this.incluirItemPedido(
              this.comFiltro[0].id_produto,
              this.comFiltro[0].venda_produto,
              quantidade
            );
            await this.atualizarGripProduto();
            this.$q.loading.hide();
            this.pesquisar = "";
          });
      }
      //abre modal para selecionar um dos itens
      if (this.comFiltro.length > 1) {
        this.$q
          .dialog({
            component: modalProdutos,
            componentProps: { dadosDosProdutos: this.comFiltro },
          })
          .onOk(async (produto) => {
            //incluir taxa de entrega para o cliente
            if (this.dadosComanda.origem_comanda == 1) {
              if (this.dadosItensPedido.length == 0) {
                await this.incluirTaxaEntrega();
              }
            }
            await this.incluirItemPedido(
              produto.id_produto,
              produto.venda_produto,
              produto.quantidade
            );
            await this.atualizarGripProduto();
            this.$q.loading.hide();
            this.pesquisar = "";
          });
      }
    },

    async incluirItemPedido(id, venda, qtde) {
      const dadosSalvaItem = [
        {
          origem_item: this.dadosComanda.origem_comanda + 4,
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

    async abrirObsItem(item) {
      if (item.fechado_item == 1) {
        return;
      }
      this.$q
        .dialog({
          component: modalObsItem,
          componentProps: {
            id_item: item.id_item,
            id_produto: item.id_produto,
          },
        })
        .onOk(async () => {});
    },

    async cancelarItem(item) {
      const dadosEnvio = [
        {
          id_item: item.id_item,
          id_usucancela_item: "",
          motivo_cancelamento: "",
          fechado_item: item.fechado_item,
        },
      ];

      if (item.fechado_item == 1) {
        this.$q
          .dialog({
            component: ModalAutorizar,
          })
          .onOk(async (res) => {
            dadosEnvio[0].id_usucancela_item = res[0].id_funcionario;
            this.$q
              .dialog({
                component: modalMotivo,
              })
              .onOk(async (res) => {
                dadosEnvio[0].motivo_cancelamento = res;
                await controllerItensPedido.dispatch(
                  "CANCELAR_ITEMPEDIDO",
                  dadosEnvio[0]
                );
                await this.atualizarGripProduto();
              });
          });
      } else {
        await controllerItensPedido.dispatch(
          "CANCELAR_ITEMPEDIDO",
          dadosEnvio[0]
        );
        await this.atualizarGripProduto();
      }
    },

    async imprimirConta() {
      //setar a comanda antes
      if (this.dadosItensPedido.length == 0) {
        this.$q.notify({
          message: "Nenhum item encontrado para impressão",
          color: "negative",
          icon: "close",
        });
        return false;
      }

      this.$q
        .dialog({
          component: ModalQtdePessoas,
        })
        .onOk(async (qtde) => {
          const dados = {
            atendente_fechaconta: this.dadosOperador.id_funcionario,
            num_pessoas: qtde,
          };

          await controllerComanda.commit("SET_COMANDA", this.dadosComanda);
          await controllerComanda.dispatch("IMPRIMIR_CONTA", dados).then(() => {
            controllerComanda.state.comanda = [];
            controllerComanda.state.tipoDePedido = [];
            controllerOperador.commit("SET_LIMPAR_ATUAL");
            this.$q.loading.hide();
            this.$router.push({ path: "/" });
          });
        });
    },

    async cardapio() {
      this.$q
        .dialog({
          component: modalCardapio,
        })
        .onOk(async (produto) => {
          //incluir taxa de entrega para o cliente
          if (this.dadosComanda.origem_comanda == 1) {
            if (this.dadosItensPedido.length == 0) {
              await this.incluirTaxaEntrega();
            }
          }
          await this.incluirItemPedido(
            produto.id_produto,
            produto.venda_produto,
            produto.quantidade
          );
          await this.atualizarGripProduto();
          this.$q.loading.hide();
          this.pesquisar = "";
        });
    },

    async combinarItens() {
      if (this.itensCombinados.length <= 1) {
        this.$q.notify({
          message: "Selecione mais de um produto para combinar",
          color: "negative",
          icon: "close",
        });
        return false;
      }

      if (this.itensCombinados.length > 4) {
        this.$q.notify({
          message: "Número máximo é 4 sabores",
          color: "negative",
          icon: "close",
        });
        return false;
      }

      let qtde = 1 / this.itensCombinados.length;
      let combinado_item = await this.encontrarMaiorCombinadoItem(
        this.dadosItensPedido
      );
      let valorItem =
        this.dadosConfigura.combinado_media_maior === 1
          ? await this.encontrarMaiorValor(this.itensCombinados)
          : await this.calcularMedia(this.itensCombinados);
      let idsItens = await this.concatenarIds(this.itensCombinados);

      let dadosEnvio = {
        qtd_item: qtde,
        combinado_item: combinado_item,
        venda_item: valorItem,
        ids: idsItens,
      };

      this.$q.loading.show();
      await controllerItensPedido.dispatch("COMBINAR_ITEMPEDIDO", dadosEnvio);
      this.atualizarGripProduto();
      this.$q.loading.hide();
      this.habilitarCombinado = false;
    },

    async encontrarMaiorValor(array) {
      let maiorValor = 0;
      for (let i = 0; i < array.length; i++) {
        const vendaItem = parseFloat(array[i].venda_item);
        if (vendaItem > maiorValor) {
          maiorValor = vendaItem;
        }
      }
      return maiorValor;
    },

    async calcularMedia(array) {
      let soma = 0;
      for (let i = 0; i < array.length; i++) {
        const vendaItem = parseFloat(array[i].venda_item);
        soma += vendaItem;
      }
      const media = soma / array.length;
      return media;
    },

    async encontrarMaiorCombinadoItem(array) {
      let maiorCombinadoItem = 0;
      for (let i = 0; i < array.length; i++) {
        const combinadoItem = array[i].combinado_item;
        if (combinadoItem > maiorCombinadoItem) {
          maiorCombinadoItem = combinadoItem;
        }
      }
      return maiorCombinadoItem + 1;
    },

    async cancelarPedido() {
      this.$q
        .dialog({
          component: ModalCancelamento,
        })
        .onOk(async () => {
          await controllerComanda
            .dispatch("FECHAR_COMANDA", {
              id_comanda: controllerComanda.state.comanda[0].id_comanda,
              imprimir_cupom_producao:
                this.dadosConfigura.imprimir_cupom_producao,
              id_setor: this.dadosConfigura.id_setor,
            })
            .then(() => {
              controllerComanda.state.comanda = [];
              controllerComanda.state.tipoDePedido = [];
              controllerOperador.commit("SET_LIMPAR_ATUAL");
              this.$q.loading.hide();
              this.$router.push({ path: "/" });
            });
          controleItensPedido.commit("LIMPAR_ITENS_SELECIONADOS");
          this.$router.push({ path: "/" });
        });
    },

    async concatenarIds(array) {
      const ids = array.map((item) => item.id_item);
      return ids.join(", ");
    },
    openModal() {
      this.showModal = true;
    },
  },
});
</script>
