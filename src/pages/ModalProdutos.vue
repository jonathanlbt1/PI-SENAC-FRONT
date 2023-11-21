<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    @before-show="onShowModal"
    persistent
  >
    <q-card
      class="q-dialog-plugin bg-blue-10"
      style="
        max-height: 90vh;
        width: 100%;
        max-width: 1024px;
        position: absolute;
        border: 1px solid blue-10;
      "
      bordered
    >
      <q-card-section class="bg-blue-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon
            class="q-mr-md"
            name="local_library"
            color="white"
            size="2rem"
          />
          Produtos
        </div>
        <div>
          <q-btn
            round
            dense
            color="red"
            icon="close"
            @click="onCancelClick()"
          />
        </div>
      </q-card-section>

      <q-card-section class="bg-white text-body1 q-pa-lg">
        <br />
        <div class="row">
          <div class="col-12">
            <q-table
              :rows="dadosDosProdutos"
              :columns="columns"
              row-key="id_produto"
              selection="single"
              v-model:selected="selected"
              @selection="produtoSelecionado"
              :grid="$q.screen.lt.md"
              table-class="text-grey-10 bg-blue-1"
              table-header-class="text-blue-10 bg-blue-3"
              title-class="text-h6"
            >
              <template v-slot:item="props">
                <div
                  class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                  :style="props.selected ? 'transform: scale(0.95);' : ''"
                >
                  <q-card :class="props.selected ? 'bg-grey-3' : ''">
                    <q-card-section>
                      <q-checkbox
                        dense
                        v-model="props.selected"
                        :label="props.row.desc_produto"
                      />
                    </q-card-section>
                    <q-separator />
                    <q-list dense>
                      <q-item
                        v-for="col in props.cols.filter(
                          (col) => col.name !== 'desc'
                        )"
                        :key="col.name"
                      >
                        <q-item-section>
                          <q-item-label class="text-greey-3 text-weight-bold">{{
                            col.label
                          }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label
                            style="font-size: 15px"
                            class="text-blue-10 text-weight-bold"
                            >{{ col.value }}</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
          <div class="row q-mt-md" v-if="false">
            Selected: {{ JSON.stringify(selected) }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useQuasar } from "quasar";
import dataHora from "src/mixins/dataHoraMixin.js";
import controlProduto from "src/pages/storesPages/produto.store";
import controlConfigura from "src/pages/storesPages/configura.store";
import modalQuantidade from "src/pages/ModalQuantidadeItem";

export default {
  name: "ModalProdutos",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
    };
  },

  data() {
    return {
      isMeio: 0,
      itensCombinado: [],
      pesquisar: "",
      columns: [
        {
          name: "cod_produto",
          required: true,
          label: "Código",
          align: "left",
          field: "cod_produto",
          sortable: true,
        },
        {
          name: "desc_produto",
          align: "left",
          label: "Descrição",
          field: "desc_produto",
          sortable: true,
        },
        {
          name: "venda_produto",
          align: "left",
          label: "Valor",
          field: "venda_produto",
          sortable: true,
        },
      ],
      dadosProdutos: [],
      selected: ref([]),
    };
  },
  props: {
    dadosDosProdutos: Object,
  },
  computed: {
    /*     comFiltro() {
      //console.log(typeof this.pesquisar);
      if (this.pesquisar) {
        let exp = new RegExp(this.pesquisar.trim(), "i");
        return this.dadosProdutos.filter((dado) => exp.test(dado.desc_produto));
      } else {
        return this.dadosProdutos;
      } */
    //},
  },

  methods: {
    async onShowModal() {
      // Load products
      //await controlProduto.dispatch("LOAD_PRODUTOS");
      //this.dadosProdutos = controlProduto.state.produtos;
      // Load configuration
      //await controlConfigura.dispatch("LOAD_CONFIGURA");
      //console.log(controlConfigura.getters.combinadoMediaMaior); // Log the value of combinadoMediaMaior
    },

    produtoSelecionado() {
      if (this.isMeio == 1) return false;
      this.$q
        .dialog({
          component: modalQuantidade,
          //componentProps: { obj: this.operador },
        })
        .onOk(async (quantidade) => {
          this.selected[0].quantidade = quantidade;
          //Deve gravar aqui para a tela ser intermitente
          this.onDialogOK(this.selected[0]);
        })
        .onCancel(() => {
          this.selected.length = [];
        });
    },
    /*  async combinado() {
      if (this.selected.length == 0 && this.itensCombinado.length == 0) {
        alert("Selecione o primeiro produto");
        this.isMeio = 1;
        return false;
      }
      if (this.itensCombinado.length == 0)
        alert("Selecione o segundo produto.");

      this.selected[0].quantidade = "0.5";

      if (controlConfigura.getters.combinadoMediaMaior) {
        if (this.itensCombinado.length > 0) {
          // Combinado_media_maior é true, usar o maior preço entre os dois produtos
          let maiorPreco = Math.max(
            this.selected[0].venda_produto,
            this.itensCombinado[0].venda_produto
          );
          this.selected[0].venda_produto = maiorPreco;
          this.itensCombinado[0].venda_produto = maiorPreco;
        }
      }

      this.itensCombinado.push(this.selected[0]);
      this.selected = [];

      if (this.itensCombinado.length == 2) {
        this.onDialogOK(this.itensCombinado);
      }
    },
    calcularPrecoCombinado(precoProduto1, precoProduto2, combinadoMediaMaior) {
      let precoProduto1Final;
      let precoProduto2Final;

      if (combinadoMediaMaior === 1) {
        let precoMaior = Math.max(precoProduto1, precoProduto2);
        precoProduto1Final = precoMaior;
        precoProduto2Final = precoMaior;
      } else {
        precoProduto1Final = precoProduto1;
        precoProduto2Final = precoProduto2;
      }

      return [precoProduto1Final, precoProduto2Final];
    }, */
  },
};
</script>
