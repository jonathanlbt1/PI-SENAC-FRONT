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


        </q-bar>

        <q-card-section>

          <h6 style="text-align: center; font-size: 22px; font-weight:bold;  margin-top: 10rem" class="h6 text-weight-bold" >

          Pedido Confirmado</h6>

        </q-card-section>

        <q-card-section style="margin-left:2rem;" class="q-pt-none">
<q-img class="vertical-middle" style="display:flex; margin-left: 6rem;" >
  <img style="
width: 96px; height: 96px;
  " src="../assets/confirmado.png" alt="">
</q-img>
        </q-card-section>
        <q-card-section class="tabela" >

          <p class="text-black">{{ countdown }}</p>

        </q-card-section>


      </q-card>
    </q-dialog>
</template>

<script>


import { defineComponent } from "vue";
import { ref } from 'vue'


export default defineComponent({
  name: "FinalizacaoPage",
  data() {
    return {
      countdown: 5,
      timerInterval: null,
      dialog: ref(false),
      maximizedToggle: ref(true),
    };
  },
  methods: {
    startRegressiveTimer() {
      this.timerInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.endTimer();
        }
      }, 1000);
    },
    endTimer() {
      clearInterval(this.timerInterval);
      this.$router.push("/feed");
      this.dialog = false;

    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  mounted() {
    this.startRegressiveTimer();
  },
});
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
