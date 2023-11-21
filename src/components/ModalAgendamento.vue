<template>

  <q-dialog
  v-model="dialog"
  persistent
  :maximized="maximizedToggle"
  transition-show="slide-up"
  transition-hide="slide-down"

>
<q-layout style="background-color:white" view="lHh Lpr lFf">

  <q-page-container
    v-once
    style="padding-top: 0px; padding-bottom: 0px !important"
  >


    <div class="feed-page">

      <div class="q-pa-md">
        <div>
          <h6 style="font-size:21px; font-weight:bold " >
            Entrega agendada
          </h6>
          <div style="display:flex; justify-content: space-between;" >
            <div class="cardSelecaoDia" >
            <p>14</p>
            <p>Hoje</p>
          </div>
          <div class="cardSelecaoDia">
            <p>15</p>
            <p>Quarta</p>
          </div>
          <div class="cardSelecaoDia">
            <p>16</p>
            <p>Quinta</p>
          </div>
          <div class="cardSelecaoDia">
            <p>17</p>
            <p>Sexta</p>
          </div>
        </div>
        <div >
          <q-option-group
            :options="options"
            type="radio"
            v-model="group"
          />
        </div>

        </div>

      </div>
    </div>
    <div style="margin-left:11px" class="q-pa-md">
    <div class="q-gutter-y-md column" style="width: 100%; margin-top: 3rem">
    <q-btn @click="confirmarAgendamento"
      label="Confirmar agendamento"
      class="btn-agendamento"
      >
    </q-btn>
</div>
</div>

  </q-page-container>
</q-layout>
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



export default {
  name: 'ModalAgendamento',


  setup () {

    const selectedOptions = {};
    const options =  [
      { name: 'option1', value: '1', label: '14:00 - 16:00' },
      { name: 'option2', value: '2', label: '15:00 - 17:00'},
      { name: 'option3', value: '3', label: '16:00 - 18:00' },
      { name: 'option4', value: '4', label: '17:00 - 19:00' },
      { name: 'option5', value: '5', label: '18:00 - 20:00' },
      { name: 'option6', value: '6', label: '19:00 - 21:00'},
      { name: 'option7', value: '7', label: '20:00 - 22:00'},

      ]

    options.forEach(option => {
      selectedOptions[option.name] = null;
    });


    const selectedOption = ref(null);
    return {
      dialog: ref(false),
      maximizedToggle: ref(true),
      selectedOptions,
      selectedOption,

      group: ref(null),
      options,



    }
  },
  data () {

    return {

    }

  },
  methods: {

    confirmarAgendamento() {

      console.log("confirmar agendamento")
    // Verifica se há uma opção selecionada
    if (this.group !== null) {
      const selectedOption = this.options.find(option => option.value === this.group);
      // Emite um evento para notificar o componente pai sobre o agendamento confirmado
      this.$emit('agendamento-confirmado', {
        data: selectedOption.label, // Aqui, você pode passar qualquer informação relevante sobre o agendamento
      });
    }

    // Fecha o diálogo/modal de agendamento
    this.dialog = false;
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

.q-option-group {
  margin-top: 27px;
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

.btn-nutri {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>


<style>
.q-carousel {
  height: 184px;
}

.cardSelecaoDia {
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  border: solid 1px #EBD7D7;
  padding-top: 10px;

}

.cardSelecaoDia select {

  border-radius: 8px;
  border: 0;
  background-color: #A0C7AA;
  color: white;
  font-size: 12px;
  font-weight: bold;

}

.btn-agendamento {

  width: 352px;
  height: 44px;
  background-color: #A0C7AA;
  color: white;
  border-radius: 9px;
}

.my-card {
  width: 25%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
</style>
