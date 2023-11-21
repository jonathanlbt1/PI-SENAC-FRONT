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
        max-height: 100vh;
        width: 90%;
        max-width: 420px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >

      <q-card-section class="bg-blue-10 flex justify-between">
        <q-uploader
          v-model="novaImagem"
          @input="handleNovaImagemUpload"
          :max-files="1"
          accept=".png, .jpg, .jpeg"
          @click="enviarImagem"
        ></q-uploader>

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
        <div class="row q-mt-md text-right">
          <q-btn color="primary" icon="camera_alt" size="lg" />
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="enviarImagem"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useQuasar } from "quasar";
import controller from "./storesPages/comandas.store";
import controllerOperador from "src/pages/storesPages/operador.store";
import dataHora from "src/mixins/dataHoraMixin.js";
import configura from "src/pages/storesPages/configura.store";
import controleGrupos from "src/pages/storesPages/grupo.store";

export default {
  name: "ModalUpload",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  props: {
    idGrupo: {
      type: Number,

    },
  },

  setup(props) {

    console.log("props", props);

    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
      onShowModal() {

      },
      numeroVazio() {
        $q.notify({
          message: "Digite o Número da Comanda ou Mesa",
          color: "negative",
          icon: "close",
        });
      },
      operadorNaoLocalizado() {
        $q.notify({
          message: "A Comanda Inexistente ou inválida",
          color: "negative",
          icon: "close",
        });
      },
    };
  },

  data() {
    return {
      text: "",
      mesa: "",
      pede_mesa: 1,
      novaImagem: null,
      grupoSelecionado: null,
    };
  },

  methods: {


    atribuiGrupoSelecionado (idGrupo) {
      this.grupoSelecionado = idGrupo;
    },

    handleNovaImagemUpload(event) {
      // Acesse os arquivos selecionados usando o método específico do Quasar
      const files = event.target.files;
      if (files.length > 0) {
        // Atribua o primeiro arquivo à this.novaImagem
        this.novaImagem = files[0];
        console.log("Imagem selecionada:", this.novaImagem);
      } else {
        console.error("Nenhum arquivo foi selecionado.");
      }

    },

    async enviarImagem() {
    console.log( this.novaImagem)
    this.grupoSelecionado = this.idGrupo
      if (this.grupoSelecionado && this.novaImagem) {
        this.$q.loading.show();
        // Ler a imagem como base64
        const reader = new FileReader();
        reader.readAsDataURL(this.novaImagem);
        reader.onload = () => {
          // Enviar os dados ao servidor
          const dados = {
            id_grupo: this.grupoSelecionado,
            imagem_grupo: "data:image/png;base64," + reader.result.split(",")[1],
          };
          // Chamar a função para enviar ao servidor
          this.enviarDadosAoServidor(dados);
          //fechar a modal
          this.onDialogOK();
        };
      } else {
        console.error("Por favor, selecione um grupo e uma imagem.");
      }
    },

    async enviarDadosAoServidor(dados) {
      try {
        await controleGrupos.dispatch("INCLUIR_IMAGEM", dados);
        console.log("Imagem enviada com sucesso!");
        // Atualizar a lista de grupos após enviar a nova imagem

      } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
</script>
