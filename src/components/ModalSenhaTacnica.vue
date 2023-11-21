<template>
  <q-dialog v-model="showmodal" persistent>
    <q-card class="bg-blue-1" style="min-width: 350px">
      <q-card-section class="bg-blue-10 row">
        <div class="text-h5 text-white">
          <q-icon name="style" />
          Senha Técnica
        </div>
        <q-space />
        <q-btn
          flat
          round
          color="white"
          size="md"
          icon="close"
          class="bg-red-10"
          @click="this.$router.push('/')"
        />
      </q-card-section>
      <br />
      <q-card-section class="q-pt-none">
        <q-input
          class="my-input"
          outlined
          standout
          v-model="senhaTecnica"
          autofocus
          @keyup.enter="validaSenhaTecnica"
          :type="isPwd ? 'password' : 'text'"
          hint="Digite a senha técnica"
        >
          <template v-slot:append>
            <q-icon
              color="primary"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          color="red-10"
          label="Cancelar"
          @click="$router.push({ name: 'home' })"
        />
        <q-btn color="green-10" label="OK" @click="validaSenhaTecnica" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import dataHoraAtual from "../mixins/dataHoraMixin";
import notifyMixin from "../mixins/notifyMixin";

export default {
  mixins: [dataHoraAtual, notifyMixin],
  data() {
    return {
      isPwd: true,
      senhaTecnica: "",
      showmodal: true,
    };
  },

  props: {},

  methods: {
    validaSenhaTecnica() {
      let atual = this.dataHoraBR().replace("/", "");

      atual = atual.substring(0, 4) + atual.substring(5, 9);
      console.log(atual);
      //this.senhaTecnica === "" ? console.log(atual) : "";

      if (atual === this.senhaTecnica) {
        this.showmodal = false;
      } else {
        this.mensagemNotificacao = "Senha incorreta";
        this.colorNotificacao = "negative";
        this.notificando();
      }
    },
  },
};
</script>
