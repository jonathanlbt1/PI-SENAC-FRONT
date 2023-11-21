<template>
  <q-page-container>
    <!-- Lista de grupos -->
    <q-list bordered separator>
      <q-item v-for="grupo in dadosGrupos" :key="grupo.id_grupo">
        <q-item-section avatar>
          <!-- Mostrar a imagem do grupo como avatar -->
          <q-avatar>
            <q-img
              :src="grupo.imagem_grupo"
              @click="enviarNovaImagem(grupo.id_grupo)"
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <!-- Nome do grupo -->
          <q-item-label :lines="1">{{ grupo.desc_grupo }}</q-item-label>

        </q-item-section>
      </q-item>
    </q-list>

    <!-- Campo de upload para enviar uma nova imagem -->
    <q-uploader
      v-model="novaImagem"
      label="Escolha uma imagem"
      @input="handleNovaImagemUpload"
      :max-files="1"
      accept=".png, .jpg, .jpeg"
    ></q-uploader>

    <!-- Botão para enviar a nova imagem -->
    <q-btn @click="enviarImagem" label="Enviar Nova Imagem" color="primary" />
    <q-list v-if="grupoSelecionado" bordered>
      <q-item v-for="imagem in listaDeImagens" :key="imagem" @click="handleNovaImagemUpload">
        <q-item-section>
          <q-avatar :lines="1">
            <q-img :src="require(`src/assets/imgGrupos/${imagem}`)" />
          </q-avatar>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page-container>



</template>

<script>
import { defineComponent } from "vue";
import { QPageContainer, QAvatar, QImg, QItem, QItemSection, QItemLabel, QUploader, QBtn } from "quasar";
import controleGrupos from "src/pages/storesPages/grupo.store";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      dadosGrupos: [],
      novaImagem: null,
      grupoSelecionado: null,
      listaDeImagens: [],
    };
  },
  async created() {
    await this.loadGrupos();
    this.carregarListaDeImagens();
    console.log(this.listaDeImagens);
  },
  methods: {
    async loadGrupos() {
      this.$q.loading.show();
      await controleGrupos.dispatch("LOAD_GRUPOS");
      this.dadosGrupos = controleGrupos.state.grupos;
      console.log(this.dadosGrupos);
      this.$q.loading.hide();
    },

    // Carregar lista de imagens do diretório ../assets/
    carregarListaDeImagens() {
      const context = require.context("../assets/imgGrupos/", false, /\.(jpg|jpeg|png)$/);
      this.listaDeImagens = context.keys().map((key) => key.replace("./", ""));
    },

    enviarNovaImagem(idGrupo) {
      this.grupoSelecionado = idGrupo;
    },
    handleNovaImagemUpload(event) {
      // Acesse os arquivos selecionados usando o método específico do Quasar
      const files = event.target.files;
      if (files.length > 0) {
        // Atribua o primeiro arquivo à this.novaImagem
        this.novaImagem = files[0];
      } else {
        console.error("Nenhum arquivo foi selecionado.");
      }
    },
    async enviarImagem() {
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
        await this.loadGrupos();
      } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
});
</script>
