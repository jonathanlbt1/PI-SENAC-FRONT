<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container
      v-once
      style="padding-top: 0px; padding-bottom: 0px !important"
    >


      <div class="feed-page">

        <div class="q-pa-md">
          <div>
            <h6 style="font-size:21px; font-weight:bold " >
              Seu pedido
            </h6>
            <p>
              Entregar em:
            </p>
          </div>

          <div class="q-gutter-y-md column" style="width: 100%">
            <q-select
              clearable
              filled
              color="purple-12"
              v-model="model"
              :options="optionsAdress"
              label="Endereco de entrega"
            />
          </div>
        </div>
      </div>

    <div
    class="no-shadow"
    label="Hoje, 15 a 20 min"
    style="margin-left: 20px; margin-top: 1rem;  "
    >
    <div >

      <q-option-group



        :options="options"
        type="radio"
        v-model="group"
        icon="local_shipping"
        @update:model-value="abreAgendamento"
      />

    </div>



  </div>


      <div style="margin-left:11px" class="q-pa-md">
        <div class="q-gutter-y-md column" style="width: 100%; margin-top: 3rem">

          <q-select
            clearable
            filled
            color="purple-12"
            v-model="forma"
            :options="pagamento"
            label="Escolha a forma de pagamento"


          />
        </div>




        <div v-if="forma === 'Cartão de crédito'">
          <q-option-group
            :options="cards"
            type="radio"
            v-model="groupcards"
            icon="local_shipping"
          />
          <q-btn style="margin-left: 0px; margin-top: 2rem; font-size: 12px; color: white; width: 352px; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: #A0C7AA; box-shadow: none!important;"
          label="Adicionar cartão"
          ></q-btn>

        </div>





        <div>

        </div>
        <p style="margin-top: 3rem">
          Cupom de desconto
        </p>

        <div style="display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;" >
          <q-input v-model="text" label="Adicione Seu Cupom" stack-label  />

          <q-btn

            class="no-shadow selecionar"
            label="Aplicar"
            style="margin-left: 25px; margin-top: 1rem; font-size: 12px; color: white; width: 88px; border: solid 1px #EBD7D7; border-radius: 7px; height: 44px; background-color: #2f5b58; box-shadow: none!important;"
            @click="validarCupom"

          >

          </q-btn>
        </div>



      </div>

      <div v-for="item in itensSelecionados" :key="item.id_produto"  style="margin-left:25px" >
        <h1
          style="margin-left: 0px; font-size: 15px; color: #2f5b58"
          class="text-h6 text-weight-bolder"
        >
          Detalhes do pedido
        </h1>
        <div>
          <p>
            Custo do produtos
          </p>
          <p>
            R$ {{ valorBR(totalDoPedido,2) }}
          </p>

        </div>
        <div>
          <p>
            Taxa de entrega
          </p>
          <p>
            R$ 00,00
          </p>

        </div>


        <div class="row justify-around" style="height: 8rem">




        </div>
      </div>
    </q-page-container>
  </q-layout>
  <q-footer
    class=""
    style=" margin-top: 5rem; background-color: #A0C7AA; height: 94px; width: 100%; bottom: 0px; display: flex; "
    justify-center
  >
    <q-toolbar v-for="item in itensSelecionados"
    :key="item.id_produto" class="justify-evenly">
      <div style="display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;" class="justify-center">
        <p>Total a Pagar</p>
        <p>
          R$ {{ valorBR(totalDoPedido - totalDesconto,2) }}
        </p>
      </div>

      <div style="display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;" justify-center >
        <q-btn @click="finalizarPedido"
         style="background-color:white; color:black" label="Pagamento" />

      </div>


    </q-toolbar>
  </q-footer>
</template>

<script>
import { ref } from "vue";
import ModalPagamento from "src/components/ModalPagamento.vue";
import ModalAgendamento from "src/components/ModalAgendamento.vue";
import controllerItensPedido from "src/pages/storesPages/itensPedido.store";
import controllerParametro from "src/pages/storesPages/parametro.store";
import dataHora from "src/mixins/dataHoraMixin.js";
import controleItensPedido from "src/pages/storesPages/itensPedido.store";
import ModalFinalizarPedido from "src/components/ModalFinalizarPedido.vue";
export default {
  name: "ConfirmPage",
  mixins: [dataHora],

  setup() {
    const selectedOptions = {};
    const options =  [
      { name: 'option1', value: '1', label: 'Hoje, 15 a 20 min' },
      { name: 'option2', value: '2', label: 'Entrega agendada'},


      ]

      const cards = [
        { name: 'option1', value: '1', label: 'Mastercard: **** 8211 ' },
        { name: 'option2', value: '2', label: 'ELO: **** 4215 '},
        { name: 'option3', value: '3', label: 'Visa: **** 2111'},

        ]



    // options.forEach(option => {
    //   selectedOptions[option.name] = null;
    // });


    const selectedOption = ref(null);
    return {
      model: ref("R. Espirito Santo, 395"),
      slide: ref(1),
      selectedOptions,
      selectedOption,

      group: ref(null),
      groupcards: ref(null),
      options,
      cards,
      pagamento: ["Dinheiro", "Cartão de crédito", "Cartão de débito"],

      optionsAdress: ["R. Espirito Santo, 395", "R. da gloria, 791"],
    };
  },
  data() {
    return {
      cupom: false,
      user: {
        name: "Laura",
        email: "",
        selectedOption: null,
        deliveryMethod: null,
        deliveryMethod2: null,
        metodoSelecionado: null,
        dadosItensPedido: [],


      },
      totalDesconto: 0,

      receitas: [
        {
          id: 1,
          titulo: "Salada Fit",
          date: "2021-09-01",
          items: "Large Pepperoni Pizza, Garlic Knots",
          total: "$20.99",
          status: "Delivered",
        },
        {
          id: 2,
          restaurant: "Torta de limao",
          date: "2021-09-02",
          items: "Big Mac Meal",
          total: "$8.99",
          status: "Preparing",
        },
        {
          id: 3,
          restaurant: "Sanduiche natural",
          date: "2021-09-03",
          items: "Footlong Turkey Sub",
          total: "$7.99",
          status: "On the way",
        },
      ],
    };
  },
  watch: {
    selectedOption(newValue) {
      if (newValue === 'Padrão') {
        this.storeOptionValue(1);
      } else if (newValue === 'Rápida') {
        this.storeOptionValue(2);
      }
    }
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


  methods: {
    reorder(order) {
      // Logic to reorder the selected order
    },


    aplicarDesconto() {

      if (this.cupom) {
        this.user.totalDesconto = this.totalDesconto + 10;

      }


    },

    finalizarPedido() {
      this.$q
        .dialog({
          component: ModalFinalizarPedido,
          componentProps: {},
        })
        .onOk(async () => {
          // Close modal
          this.$q.dialog().hide();
        });
      
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


pegaQuantidade(item) {
      const index = controleItensPedido.state.itensSelecionados.findIndex(
        (selectedItem) => selectedItem.id_produto === item.id_produto
      );
      return index !== -1
        ? controleItensPedido.state.itensSelecionados[index].quantidade
        : 0;
    },





    abreAgendamento() {
      if (this.group == 2) {

        this.$q
        .dialog({
          component: ModalAgendamento,
          componentProps: {},
        })
        .onOk(async () => {
          // Get the selected div element
          const selectedDiv = document.querySelector(".selecionar");

          // Apply the CSS class to the selected div
          selectedDiv.classList.add(".selected");
        });

      }

    },

    onRadioChange(value) {
      // Armazena o valor selecionado
      this.deliveryMethod = value;

      // Altera a cor da borda de seleção
      this.$refs.radio.querySelectorAll(".q-radio-item")
        .forEach((item) => {
          item.classList.remove("q-radio-item--selected");
        });
      this.$refs.radio.querySelector(`[value="${value}"]`).classList.add("q-radio-item--selected");
    },



    selectOption(option) {
      this.selectedOption = option;
      // Armazene o valor conforme a opção selecionada
      if (option === 'Padrão') {
        // Faça o que for necessário com o valor para a opção Padrão (neste caso, armazenando 1)
        this.storeOptionValue(1);
      } else if (option === 'Rápida') {
        // Faça o que for necessário com o valor para a opção Rápida (neste caso, armazenando 2)
        this.storeOptionValue(2);
      }
    },

    storeOptionValue(value) {
      // Faça o que precisar com o valor selecionado (armazenamento, envio para servidor, etc.)
      console.log('Valor selecionado:', value);
    },

    validarCupom() {

      if (this.text == "ECO10") {
        this.$q.dialog({
          title: "Cupom aplicado com sucesso!",
          message: "Você ganhou 10% de desconto",
          cancel: true,
          persistent: true,
          cupom: true,
        });

      } else {
        this.$q.dialog({
          title: "Cupom inválido",
          message: "Tente novamente",
          cancel: true,
          persistent: true,
        });
      }
    },


    async openModalFormaPagamento() {
      // se forma de pagamento é credito, abre a modal de pagamento
      if (this.pagamento == "Cartão de crédito") {
        this.$q
          .dialog({
            component: ModalPagamento,
            componentProps: {},
          })
          .onOk(async () => {
            // Get the selected div element
            const selectedDiv = document.querySelector(".selecionar");

            // Apply the CSS class to the selected div
            selectedDiv.classList.add(".selected");
          });

      }

    },

  },


};
</script>

<style>
.q-carousel {
  height: 184px;
}

.my-card {
  width: 25%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.q-option-group > div {
  margin-left: 7px;
  margin-top: 11px;
  font-size: 12px;
  color: #2f5b58;
  width: 352px;
  height: 59px;
  border: solid 1px #EBD7D7;
  border-radius: 7px;
  height: 44px;
  background-color: transparent;
  box-shadow: none!important; display:flex
}

.lista {
background-color: red;
}

.my-card img {
  display: block;
  width: 100%;
  max-width: 100%;
  border: 0;
  height: 100%;
  object-fit: cover !important;
}

.q-btn {
  font-size: 10px;
}
.q-btn:before {
  box-shadow:none;
}

.btn-listas {
  margin-left: 25px;
  margin-top: 1rem;
  font-size: 12px;
  color: white;
  background-color: #A0C7AA;
  border-radius: 8px;
  border: 0;
  width: 136px;
  height: 44px;
}


.selected {
  border-color: red;
}

.delivery-option {
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
}
.delivery-option input[type="radio"] {
  display: block;
}
.delivery-option div {
  border: 1px solid #ccc;
  padding: 10px;
}
.selected div {
  border-color: red;
}
.selected-div {
  border-color: red;
}
</style>
