<template>
  <q-page class="q-pa-sm">
    <estadoOperador :operador="dadosOperador" btnSair="" />
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
        class="text-h5 q-mb-xs flex flex-center text-blue-10 bg-blue-2 text-bold"
      >
        <q-btn
          color="orange-10"
          icon="arrow_back"
          class="q-ma-xs"
          @click="$router.push({ name: 'index' })"
        />
        <!-- só no caso de ser um pedido delivery volta ao fluxo -->
        <q-btn
          color="grey-10"
          icon="print"
          class="q-ma-xs"
          @click="$router.push({ name: 'index' })"
          v-if="dadosComanda.num_comanda >= 100000"
        />

        <q-space />
        <div
          class="text-bold text-h5 q-mr-xs"
          :key="dadosComanda.origem_comanda"
        >
          {{ dadosComanda.tipo }}: {{ dadosComanda.num_comanda }}
          {{ tipandoPedido(dadosComanda.origem_comanda) }}
        </div>
      </div>

      <q-card>
        <q-card-section class="flex">
          <q-input
            filled
            v-model="pesquisar"
            bg-color="grey-2"
            color="blue-10"
            label="Procurar por um produto"
            style="width: 80%"
            @input="pesquisar = $event.target.value"
            @keyup.enter="gravaItem()"
            @keyup.esc="voltar"
          />
          <q-space />
          <q-btn icon="search" color="blue-10" @click="gravaItem()" />
        </q-card-section>
      </q-card>

      <div
        class="text-h5 q-mb-xs flex flex-center text-red-10 q-mt-lg bg-red-2 text-bold q-pa-lg"
        v-if="dadosItensPedido.length == 0"
      >
        {{ loadItens == 0 ? " Verificando Itens" : "Sem itens " }}
        <q-space />
        <div class="row flex flex-center" v-if="loadItens == 0">
          <q-spinner-hourglass color="red-10" size="2em" />
        </div>
      </div>

      <div class="flex bg-white" v-if="dadosItensPedido.length > 1">
        <div class="q-ma-md text-weight-medium">Selecionar</div>
        <q-space />
        <q-toggle v-model="habilitarCombinado" />
      </div>

      <q-list
        :class="{
          'text-h6': $q.screen.gt.xs,
        }"
        bordered
        v-for="item in dadosItensPedido"
        :key="item.id_item"
      >
        <q-item
          :class="{
            'bg-white': item.combinado_item === 0,
            'bg-yellow-3': item.combinado_item > 0,
          }"
        >
          <q-item-section class="text-bold">
            {{ item.desc_produto }}
          </q-item-section>
          <q-item-section avatar>
            <div class="inline rounded-borders cursor-pointer">
              <div>
                <q-icon color="blue-10" name="menu" size="md" />
              </div>

              <q-menu touch-position class="bg-grey-3" bordered>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-icon
                      color="red-10"
                      name="close"
                      size="xs"
                      class="q-ma-sm"
                    />
                    <q-item-section @click="cancelarItem(item)">
                      Excluir
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-if="item.fechado_item == 0"
                    @click="abrirObsItem(item)"
                  >
                    <q-icon
                      color="green-10"
                      name="library_books"
                      size="xs"
                      class="q-ma-sm"
                    />
                    <q-item-section> Observações </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </q-item-section>
        </q-item>

        <q-item
          :class="{
            'bg-white': item.combinado_item === 0,
            'bg-yellow-2': item.combinado_item > 0,
          }"
        >
          <q-item-section>
            {{ valorBR(item.qtd_item, 3) }} ({{ item.desc_unidade }})
          </q-item-section>
          <q-item-section>{{ valorBR(item.venda_item, 2) }}</q-item-section>
          <q-item-section>R$ {{ valorBR(item.total, 2) }}</q-item-section>
          <q-item-section avatar v-if="item.combinado_item === 0">
            <q-checkbox
              keep-color
              color="orange"
              v-model="itensCombinados"
              :val="item"
              v-if="habilitarCombinado"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>

  <q-footer
    class="bg-blue-3"
    v-if="loadItens == 1"
    style="border-top: 1px solid blue"
  >
    <q-toolbar>
      <q-toolbar-title class="text-green-10 text-right">
        <div class="text-body1 text-weight-bold">Pedido</div>
        <div>R$ {{ valorBR(totalPedido, 2) }}</div>
      </q-toolbar-title>
      <q-toolbar-title class="text-red-10 text-right">
        <div class="text-body1 text-weight-bold">Desconto</div>
        <div>- R$ {{ valorBR(totalDesconto, 2) }}</div>
      </q-toolbar-title>
      <q-toolbar-title class="text-green-10 text-right">
        <div class="text-body1 text-weight-bold">A Pagar</div>
        <div>R$ {{ valorBR(totalPedido - totalDesconto, 2) }}</div>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
  <div class="q-px-sm" v-if="itensCombinados.length > 0">
    Para combinar: <strong>{{ itensCombinados.length }}</strong>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import controlProduto from "src/pages/storesPages/produto.store";
import controllerComanda from "src/pages/storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import controllerConfigura from "src/pages/storesPages/configura.store";
import controllerCliente from "src/pages/storesPages/cliente.store";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
import controllerParametro from "src/pages/storesPages/parametro.store";
import estadoOperador from "src/components/estadoOperador.vue";
import estadoCliente from "src/components/estadoCliente.vue";
import dataHora from "src/mixins/dataHoraMixin.js";

export default defineComponent({
  name: "lancamentoComanda",
  mixins: [dataHora],
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
    };
  },
  components: {
    estadoOperador,
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

    if (this.dadosComanda.num_comanda == 0) {
      this.$q.loading.hide();
      this.$router.go(-1);
      return false;
    }

    //console.log(this.dadosComanda);
    //aqui e na tela transferencia abre ou reabre um novo pedido
    if (this.dadosComanda.fl_comanda == 1) {
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

    //se for delivery
    if (
      this.dadosComanda.num_comanda > 100000 &&
      !this.dadosComanda.id_cliente
    ) {
      this.$q
        .dialog({
          component: modalCliente,
        })
        .onOk(async (res) => {
          //atualiza cliente
          this.dadosCliente = controllerCliente.state.selecionado[0];
          //atualiza comanda
          this.dadosComanda = controllerComanda.state.comanda[0];
        })
        .onCancel(async () => {
          this.voltar();
        });
    }

    if (this.dadosComanda.id_cliente) {
      // console.log(!this.dadosComanda.id_cliente);
      await controllerCliente.dispatch(
        "LOAD_IDCLIENTE",
        this.dadosComanda.id_cliente
      );
      this.dadosCliente = controllerCliente.state.selecionado[0];
    }

    this.atualizarGripProduto();
    // console.log(this.dadosItensPedido);
    this.$q.loading.hide();

    await controlProduto.dispatch("LOAD_PRODUTOS");
    this.dadosProdutos = controlProduto.state.produtos;
  },

  methods: {
    async atualizarGripProduto() {
      await controllerItensPedido.dispatch(
        "LOAD_ITENSPEDIDO",
        this.dadosComanda.id_comanda
      );
      this.dadosItensPedido = controllerItensPedido.state.itensPedido;
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
        console.log("Primeiro lançamento pode excluir sem autorização.");
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

    async concatenarIds(array) {
      const ids = array.map((item) => item.id_item);
      return ids.join(", ");
    },
  },
});
</script>
