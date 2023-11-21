<template>
  <ModalSenhaTecnica />

  <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400">
    <q-scroll-area
      style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
        color: #525b75
      "
    >
      <q-list padding class="no-border"
      style="font-size: 12px; height: 70px; color: #525b75"

      >
        <q-item
          clickable
          v-ripple
          @click="menuItemSelected = 'imagensIniciais'"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_image" size="20px" />
          </q-item-section>
          <q-item-section>Imagens Grupos</q-item-section>
        </q-item>

        <q-item

          clickable
          v-ripple
          @click="menuItemSelected = 'bannerPromocional'"
        >
          <q-item-section avatar style="color:color: #525b75">
            <q-icon name="sym_o_star" size="20px" />
          </q-item-section>

          <q-item-section> Banner promocional</q-item-section>
        </q-item>

        <q-item

          clickable
          v-ripple
          @click="menuItemSelected = 'produtos em destaque'"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_send" size="20px" />
          </q-item-section>

          <q-item-section> Produtos em destaque</q-item-section>
        </q-item>

        <q-item  clickable v-ripple @click="menuItemSelected = 'drafts'">
          <q-item-section avatar>
            <q-icon name="sym_o_drafts" size="20px" />
          </q-item-section>

          <q-item-section> Imagens produtos </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img
      class="absolute-top"
      src=""
      style="height: 150px; border-right: 1px solid #ddd"
    >
      <div class="absolute-bottom bg-transparent">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold">Razvan Stoenescu</div>
        <div>@rstoenescu</div>
      </div>
    </q-img>
  </q-drawer>

  <q-page class="q-pa-sm">
    <h1 v-if="menuItemSelected === ``" class="text-h6">Pagina de admin</h1>
    <div v-if="menuItemSelected === 'imagensIniciais'">
      <h1
      style="margin-left: 3rem; margin-top: 5rem;"
       class="text-h6 text-weight-bold">Imagens Grupos</h1>
      <p
      style="margin-left:3rem;"

      >
        Escolha imagens para ilustrar os grupos de produtos.
      </p>
      <p style="margin-left:3rem; " >
        <a
        style="color: #525b75; font-size: 12px;"
        href="https://www.flaticon.com/br/" target="_blank"
        >Site indicado para baixar as imagens</a>
      </p>
      <q-list class="row" clickable
      v-ripple v-for="grupo in dadosGrupos" :key="grupo.id_grupo" @click="abrirModalUploadImagem(grupo.id_grupo)"
style="cursor: pointer; font-size: 12px; height: 70px; margin-left: 2rem; margin-right: 2rem; padding-left: 1rem; border-top: solid 1px #cbcbcb;"
      >
        <q-item-section avatar>
          <q-avatar>
            <q-img
              :src="grupo.imagem_grupo"
              @click="enviarNovaImagem(grupo.id_grupo)"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          {{ grupo.desc_grupo }}
        </q-item-section>
        <q-item-section side>

          <q-icon name="upload">
             <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>Escolher imagem</strong>
            (<q-icon name="keyboard_arrow_up"/>)
          </q-tooltip>
          </q-icon >

        </q-item-section>
      </q-list>
    </div>
    <div v-if="menuItemSelected === 'bannerPromocional'">
      <h1 class="text-h6">
        Esse texto deve aparecer quando banner promocional estiver clicado
      </h1>
      <p>
        Escolha imagens para ilustrar o banner promocional.
      </p>
      <q-carousel
      class="gt-xs"
      style="border-radius: 25px; max-height: 16rem"
      animated
      v-model="secondCarouselSlide"
      arrows
      navigation
      infinite
      :autoplay="autoplay"
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide :name="1" img-src="../assets/banner2.jpg" />
      <q-carousel-slide :name="2" img-src="../assets/banner3.jpg" />
      <q-carousel-slide :name="3" img-src="../assets/banner2.jpg" />
      <q-carousel-slide :name="4" img-src="../assets/banner3.jpg" />
    </q-carousel>

    <h1 class="text-h6">
      Defina aqui os produtos que aparecerao em destaque na pagina inicial
     </h1>
         <h1 class="xl text-h6">Destaques</h1>

         <div
           class="gt-xs row items-start q-gutter-md q-mb-md text-weight-bold"
         >
           <q-card
             v-for="item in produtosDestaque"
             :key="item.id_produto"
             class="my-card col-sm-6 col-md-4 col-lg-3 text-center"
             bordered
             flat
             style="
               border-radius: 25px;
               max-width: 15rem;
               min-width: 15rem;
               margin-top: 2rem;
             "
           >
             <q-card
               no-border
               class="shadow-2 no-border"
               style="display: flex; justify-content: center; margin-top: 3px"
             >
               <q-img
                 :src="
                   item.imagem_produto == null || item.imagem_produto == ''
                     ? require('../assets/imagem-padrao.jpg')
                     : item.imagem_produto
                 "
                 style="
                   width: 220px;
                   max-width: 230px;
                   max-height: 209px;
                   min-height: 209px;
                   min-width: 230px;
                   object-fit: contain !important;
                 "
               />
             </q-card>
             <q-card-section>
               <div class="row no-wrap items-center">
                 <div
                   style="font-size: 12px"
                   class="col text-h6 ellipsis text-weight-bold"
                 >
                   {{ item.desc_produto }}
                 </div>
               </div>
             </q-card-section>
             <q-card-section class="q-pt-none">
               <div
                 class="text-subtitle1"
                 style="font-weight: 700; color: #0d47a1"
               >
               </div>
               <div class="text-caption text-grey">
                 Valor total: R$

               </div>
             </q-card-section>
             <q-separator />
             <q-card-actions
               class="q-card-actions-centered row items-center justify-between no-wrap"
             >
               <div
                 style="width: 100%"
                 class="row items-center row items-center justify-between no-wrap"
               >

               </div>
             </q-card-actions>
           </q-card>
         </div>

    </div>
    <div v-if="menuItemSelected === 'produtos em destaque'">
      <h1 class="text-h6">
       Defina aqui os produtos que aparecerao em destaque na pagina inicial
      </h1>
          <h1 class="xl text-h6">Destaques</h1>

          <div
            class="gt-xs row items-start q-gutter-md q-mb-md text-weight-bold"
          >
            <q-card
              v-for="item in produtosDestaque"
              :key="item.id_produto"
              class="my-card col-sm-6 col-md-4 col-lg-3 text-center"
              bordered
              flat
              style="
                border-radius: 25px;
                max-width: 15rem;
                min-width: 15rem;
                margin-top: 2rem;
              "
            >
              <q-card
                no-border
                class="shadow-2 no-border"
                style="display: flex; justify-content: center; margin-top: 3px"
              >
                <q-img
                  :src="
                    item.imagem_produto == null || item.imagem_produto == ''
                      ? require('../assets/imagem-padrao.jpg')
                      : item.imagem_produto
                  "
                  style="
                    width: 220px;
                    max-width: 230px;
                    max-height: 209px;
                    min-height: 209px;
                    min-width: 230px;
                    object-fit: contain !important;
                  "
                />
              </q-card>
              <q-card-section>
                <div class="row no-wrap items-center">
                  <div
                    style="font-size: 12px"
                    class="col text-h6 ellipsis text-weight-bold"
                  >
                    {{ item.desc_produto }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div
                  class="text-subtitle1"
                  style="font-weight: 700; color: #0d47a1"
                >
                </div>
                <div class="text-caption text-grey">
                  Valor total: R$

                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions
                class="q-card-actions-centered row items-center justify-between no-wrap"
              >
                <div
                  style="width: 100%"
                  class="row items-center row items-center justify-between no-wrap"
                >

                </div>
              </q-card-actions>
            </q-card>
          </div>

    </div>
    <div v-if="menuItemSelected === 'drafts'">
      <h1 class="text-h6">
        Esse texto deve aparecer quando drafts estiver clicado
      </h1>
    </div>
    </q-page>
    </template>
    <script>
    import { defineComponent, ref } from "vue";
    import ModalSenhaTecnica from "components/ModalSenhaTacnica.vue";
    import { useQuasar } from "quasar";
    import { QAvatar, QImg, QItem, QItemSection, QUploader, QBtn } from "quasar";
    import controleGrupos from "src/pages/storesPages/grupo.store";
    import modalUpload from "src/pages/ModalUpload.vue";
    import { useDialogPluginComponent } from "quasar";
    import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
    import controlProduto from "src/pages/storesPages/produto.store";


    export default defineComponent({
      name: "adminPage",
      emits: [...useDialogPluginComponent.emits],
      setup() {
        const $q = useQuasar();
        const fileInput = ref(null);

        return {
          drawer: ref(false),
          gravadoComSucesso() {
            $q.notify({
              message: "As configurações foram gravadas com sucesso",
              color: "positive",
              icon: "done",
            });
          },
          configurarSistema() {
            $q.notify({
              message: "O sistema não está configurado.",
              color: "warning",
              textColor: "black",
              icon: "error",
              classes: "text-h6 q-btn",
            });
          },
        };
      },
      data() {
        return {
          fileInput: '',
          menuItemSelected: 'imagensIniciais',
          selectedImage: null,
          dadosGrupos: [],
          dadosProdutos: [],
          novaImagem: null,
          grupoSelecionado: null,
          produtosDestaque: [],
          autoplay: true,
          firstCarouselSlide: 1,
          secondCarouselSlide: 1,
          settings: {
            itemsToShow: 1,
            snapAlign: "center",
      },
        };

      },
      components: {
        ModalSenhaTecnica,

      },
      computed: {},
      async created() {
        await this.loadGrupos();
       await this.loadProdutos();
        this.carregarListaDeImagens();
        this.produtosDestaque = JSON.parse(
      localStorage.getItem("produtosDestaque")
    );
    this.loadProdutosAleatorios();

        console.log(this.produtosDestaque);

      },
      watch: {},
      methods: {
        async loadGrupos() {
          this.$q.loading.show();
          await controleGrupos.dispatch("LOAD_GRUPOS");
          this.dadosGrupos = controleGrupos.state.grupos;
          console.log(this.dadosGrupos);
          this.$q.loading.hide();
        },

        async loadProdutos() {
          await controlProduto.dispatch("LOAD_PRODUTOS");
          this.dadosProdutos = controlProduto.state.produtos;
          console.log(this.dadosProdutos);
        },


        async loadProdutosAleatorios() {
      await controlProduto.dispatch("LOAD_PRODUTOS");

      this.produtosDestaque = controlProduto.state.produtos.filter((produto) =>
        [474, 475, 476].includes(produto.id_produto)
      );
    },

        abrirModalUploadImagem(idGrupo) {
          console.log(idGrupo);
          this.grupoSelecionado = idGrupo;
          //typeof idGrupo;
          console.log(typeof idGrupo);
          console.log(this.grupoSelecionado);
          this.$q
            .dialog({
              component: modalUpload,
              componentProps: { idGrupo },
            })
            .onOk(() => {
              this.$q.loading.show();
              this.loadGrupos();
              this.$q.loading.hide();
              //reader.onload
            })
            .onCancel(() => {});
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
