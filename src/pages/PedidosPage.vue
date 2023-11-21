<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container
      v-once
      style="padding-top: 0px; padding-bottom: 0px !important"
    >
      <div class="feed-page">
        <div class="q-pa-md">
          <div class="q-gutter-y-md column" style="width: 100%">
            <q-select
              clearable
              filled
              color="purple-12"
              v-model="model"
              :options="options"
              label="Endereco de entrega"
            />
          </div>
        </div>
      </div>
      <h3
        style="margin-left: 25px; font-size: 18px; color: #2f5b58"
        class="text-h6 text-weight-bolder"
      >
        Pedidos
      </h3>
      <div @click="verificar" class="q-pa-md card-pedido">
        <p>Entrega Estimada</p>
        <p style="margin-top: -15px;" >07:55 PM - 08:10 PM</p>
        <p style="font-size:10px; font-wheight: 100  " >Pedido aguardando Expedicao</p>

      </div>
      <div v-if="isCardClicked" class="map-container">
<div >
<img style=" height:298px; width:393px; margin-top:2rem " src="../assets/mapa.png " alt="Mapa" border="0">
</div>
      </div>

      <div>
        <h1
          style="margin-left: 25px; font-size: 15px; color: #2f5b58"
          class="text-h6 text-weight-bolder"
        >
          Pedidos Anteriores
        </h1>

        <div class="row justify-around" style="height: 8rem">
          <p>
           Voce ainda nao finalizou nenhum pedido . <br />
          </p>
        </div>
      </div>
      <h3 style="margin-left: 25px; margin-top: 5rem; font-size: 15px; color:#2f5b58" class="text-h6 text-weight-bolder">

      </h3>

    </q-page-container>
  </q-layout>
  <q-footer
    class="justify-center"
    style="position: fixed; margin-top: 5rem; background-color: #A0C7AA; height: 94px; width: 100%; bottom: 0px; display: flex; "
    justify-center
  >
    <q-toolbar class="justify-evenly">
      <div @click="$router.push('/feed')" style="display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;" class="justify-center">
        <q-btn round dense flat icon="home" />
        <p>Inicio</p>
      </div>
      <div  @click="$router.push('/feed')" class="justify-center">
        <q-btn round dense flat icon="search" />
        <p>Buscar</p>
      </div>

     <div style="display: flex;
     flex-direction: column;
     align-content: center;
     justify-content: center;" justify-center>
      <q-btn
      round
      dense
      flat
      icon="favorite"

      @click="$router.push('/index')"
    />
    <p>Loja Eco</p>
     </div>
     <div style="display: flex;
     flex-direction: column;
     align-content: center;
     justify-content: center;" justify-center>
      <q-btn
      round
      dense
      flat
      icon="list"

      @click="$router.push('/index')"
    />
    <p>Pedidos</p>
     </div>
      <div style="display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;" justify-center >
        <q-btn round dense flat icon="settings" />
        <p>Perfil</p>
      </div>


    </q-toolbar>
  </q-footer>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    return {
      model: ref("R. Espirito Santo, 395"),
      slide: ref(1),

      options: ["R. Espirito Santo, 395", "R. da gloria, 791"],
    };
  },
  data() {
    return {
      user: {
        name: "Laura",
        email: "",
      },

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
  data() {
    return {
      isCardClicked: false,
    };
  },
  methods: {
    reorder(order) {
      // Logic to reorder the selected order
    },

    verificar() {
      this.isCardClicked = !this.isCardClicked;
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

.my-card img {
  display: block;
  width: 100%;
  max-width: 100%;
  border: 0;
  height: 100%;
  object-fit: cover !important;
}

.card-pedido {
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 1rem;
  font-size: 12px;
  color: black;
  background-color: #F2F2F2;
  border-radius: 8px;
  border: 0;
  width: 343px;
  height: 120px;
}

.card-pedido p {
  margin-left: 5px;
  margin-top: 1px;
  font-size: 15px;
  color: black;
  font-weight: bold;
}

.q-btn {
  font-size: 10px;
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
</style>
