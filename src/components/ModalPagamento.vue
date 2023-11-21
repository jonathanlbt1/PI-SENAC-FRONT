<template>
  <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"

    >
      <q-card class="bg-white text-black">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <h1 style="font-size:21px;" >
            Forma de pagamento
          </h1>
        </q-card-section>

        <q-card-section style="margin-left:2rem;" class="q-pt-none">
          <div class="info-container" >
            <h6 style="font-size: 22px; font-weight:bold" class="h6 text-weight-bolder" >
             Pague pelo App
            </h6>
            <q-btn
      class="no-shadow"
      no-shadow
      label="Pix"
      style=" margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
    </q-btn>
      <q-btn
      class="no-shadow"
      no-shadow
      label="Credito"
      style=" margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
    </q-btn>
      <q-btn
      class="no-shadow"
      no-shadow
      label="Debito"
      style="margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
      </q-btn>
            <p style="font-size: 15px; font-weight: 100" >
            Pague na entrega
            </p>

            <q-btn
      class="no-shadow"
      no-shadow
      label="Debito"
      style=" margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
      </q-btn>
      <q-btn
      class="no-shadow"
      no-shadow
      label="Debito"
      style=" margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
      </q-btn>
      <q-btn
      class="no-shadow"
      no-shadow
      label="Debito"
      style=" margin-top: 1rem; font-size: 12px; color: #2f5b58; width: 90%; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: white; box-shadow: none!important;"
      @click="agendarEntrega"
      >
      </q-btn>

          </div>
        </q-card-section>
        <q-card-section class="tabela" >

            <div class="q-pa-md">
              <q-table

                :rows="rows"
                :columns="columns"
                row-key="name"
                selection="multiple"
                v-model:selected="selected"
                :filter="filter"
                grid
                hide-header
              >
                <template v-slot:top-right>



                </template>

                <template v-slot:item="props">
                  <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''"
                  >
                    <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                      <q-card-section>
                        {{ item.desc_produto }}
                      </q-card-section>
                      <q-separator />
                      <q-list dense>
                        <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                          <q-item-section>
                            <q-item-label>{{ col.label }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{ col.value }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </div>
                </template>

              </q-table>
              <p style="font-size: 9px;" >
                (*) % Valores Diários de referência com base em uma dieta de 2.000 kcal ou 8400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.(**)O que são carboidratos líquidos? Carboidratos líquidos são aqueles que o corpo consegue digerir e, geralmente, não incluem as fibras. Descubra qual é a quantidade ideal de carboidratos líquidos que você deve consumir:
              </p>
            </div>


        </q-card-section>
        <q-card-actions
        class="q-card-actions-centered row items-center justify-between no-wrap"
        style="display: flex; justify-content: space-between; align-items: center; margin-left: 1rem; margin-right: 1rem;"
      >
        <div
          style="width: 100%"
          class="row items-center row items-center justify-between no-wrap"
        >
          <q-btn class="btn-nutri" round color="red" @click="removeDoCarrinho(item)">
            <q-icon name="remove" />
          </q-btn>
          <p style="margin-top: 17px" class="q-pa-none">{{ pegaQuantidade(item) }}</p>
          <q-btn class="btn-nutri"
            round
            color="green-4"
            @click="adicionaAoCarrinho(item)"
          >
            <q-icon name="add" />
          </q-btn>
        </div>
      </q-card-actions>

      </q-card>
    </q-dialog>
</template>


<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import controlProduto from "src/pages/storesPages/produto.store";
import controleGrupos from "src/pages/storesPages/grupo.store";
import controleSubGrupo from "src/pages/storesPages/subGrupo.store";
import controlConfigura from "src/pages/storesPages/configura.store";
import controleItensPedido from "src/pages/storesPages/itensPedido.store";
import controllerComanda from "src/pages/storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import controllerConfigura from "src/pages/storesPages/configura.store";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
const columns = [
  { name: 'calorias', align: 'center', label: 'calorias', field: 'calories', sortable: true },
  { name: 'gorduras', label: 'gorduras (g)', field: 'gorduras', sortable: true },
  { name: 'carboidratos', label: 'Carboidratos (g)', field: 'carboidratos' },
  { name: 'proteinas', label: 'proteinas (g)', field: 'proteinas' },
  { name: 'sodio', label: 'Sodio (mg)', field: 'sodio' },
  { name: 'calcio', label: 'Calcio (%)', field: 'calcio', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'ferro', label: 'ferro (%)', field: 'ferro', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calorias: 159,
    gorduras: 6.0,
    carboidratos: 24,
    proteinas: 4.0,
    sodio: 87,
    calcio: '14%',
    ferro: '1%'
  },

]


export default {
  name: 'ModalPagamento',

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    console.log('Item:', props.item);
    console.log('Nome:', props.nome);
    console.log('ID:', props.id);
    console.log('Imagem:', props.imagem);
    return {
      dialog: ref(false),
      maximizedToggle: ref(true),
      columns,
      rows
    }
  },
  methods: {

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

    pegaQuantidade(item) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (selectedItem) => selectedItem.id_produto === item.id_produto
      );
      return index !== -1
        ? controleItensPedido.state.itensSelecionados[index].quantidade
        : 0;
    },



  }
}
</script>
<style lang="sass">

.grid-style-transition
  transition: transform .28s, background-color .28s

</style>
<style>
.img-produtos-info {
  width: 360px;
  height: 306px;
}

.text-h6 {
  font-size: 15px;
  color: #2f5b58;
  margin-left: 25px;
  font-weight: bold;
}

.info-container {
  font-size: 22px;
  font-weight: bolder;
  color:#2f5b58
}

.tabela {
  color: black;
}

.btn-nutri {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
