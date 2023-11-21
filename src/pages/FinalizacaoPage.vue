<template>
  <q-page
    style="min-height: 0px !important"
    class="column justify-center full-height full-width text-center align-center items-center"
  >
    <h1 class="text-red text-h2 text-weight-bold">Obrigado!</h1>
    <p class="text-black">
      Seu pedido foi enviado com sucesso. Agora é só aguardar!
    </p>
    <h2 class="text-black text-h3 text-weight-bold">542</h2>
    <p class="text-black">{{ countdown }}</p>
    <q-btn
      style="border-radius: 48px; width:232px; font-size: 12px; height:88px"
      size="45px"
      rounded
      class=""
      label="Encerrar"
      color="primary"
      @click="closeModal"
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FinalizacaoPage",
  data() {
    return {
      countdown: 5,
      timerInterval: null,
      showModal: true, // Add a data property to control the modal visibility
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
      this.closeModal(); // Call the closeModal method when the timer ends
    },
    closeModal() {
      this.showModal = false; // Set the showModal data property to false to close the modal
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
