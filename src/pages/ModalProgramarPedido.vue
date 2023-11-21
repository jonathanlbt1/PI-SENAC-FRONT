<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    @before-show="onShowModal"
    persistent
  >
    <q-card
      class="q-dialog-plugin bg-yellow-10"
      style="
        max-height: 100vh;
        width: 100%;
        max-width: 680px;
        position: absolute;
        border: 1px solid red-10;
      "
      bordered
    >
      <q-card-section class="bg-orange-10 flex justify-between">
        <div class="text-white text-h6">
          <q-icon
            class="q-mr-md"
            name="question_mark"
            color="white"
            size="2rem"
          />
          Tipo de Registro
        </div>
        <div>
          <q-btn
            round
            dense
            color="red"
            icon="close"
            @click="fecharTelaTipo()"
          />
        </div>
      </q-card-section>

      <q-card-section class="bg-white text-body1">
        <q-card-section>
          <q-select
            filled
            v-model="model"
            :options="options"
            label="Tipo de Registro"
          />
        </q-card-section>

        <q-card-section v-if="model.value == 1">
          <div
            class="row bg-blue-3 q-pa-sm q-mb-sm"
            style="border: 1px solid blue"
          >
            <div class="row">{{ dadosCliente.razao_cliente }}</div>
            <hr />
            <div class="col-12 text-blue-10">Endereço de entrega:</div>
            <div class="row">{{ dadosCliente.end_cliente }},</div>
            <div class="row">{{ dadosCliente.num_cliente }} -</div>
            <div class="row">{{ dadosCliente.complemneto_cliente }}</div>
            <div class="row">{{ dadosCliente.bairro_cliente }} -</div>
            <div class="row">{{ dadosCliente.cidade }} -</div>
            <div class="row">{{ dadosCliente.estado }}</div>
          </div>

          <q-input
            filled
            v-model="text"
            class="q-mb-md"
            input-class="text-right "
            label="Taxa de Entrega do Cliente"
          />

          <q-table
            :rows="dadosBairroEntrega"
            :columns="columns"
            row-key="id_bairro"
            selection="single"
            v-model:selected="selected"
          />

          <div class="row q-mt-md" v-if="false">
            Selected: {{ JSON.stringify(selected) }}
          </div>
        </q-card-section>
        <q-card-section v-if="model.value == 3">
          <div class="q-pa-md" style="max-width: 100%">
            <q-input v-model="date" class="text-h6">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" mask="DD/MM/YYYY HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Fechar"
                          color="blue-10"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="date" mask="DD/MM/YYYY HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Fechar"
                          color="blue-10"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <div class="row q-mt-md text-right">
          <q-space />
          <q-btn
            color="green-10"
            icon="done"
            size="lg"
            @click="selecionarTipo"
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
import controllerCliente from "./storesPages/cliente.store";
import dataHora from "src/mixins/dataHoraMixin.js";
import ModalAdicionar from "src/pages/ModalAdicionarCliente";
import controlleBairroEntrega from "src/pages/storesPages/bairroDeEntrega";

export default {
  name: "ModalClientes",
  mixins: [dataHora],
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onCancelClick: onDialogCancel,
      date: ref(new Date()),
      tipoVazio() {
        $q.notify({
          position: "top",
          classes: "text-h6 q-btn",
          message: "Selecione um tipo",
          color: "warning",
          icon: "warning",
        });
      },
    };
  },

  data() {
    return {
      text: "",
      model: ref({ label: "Selecione um Tipo", value: 0 }),
      options: [
        { label: "Selecione um tipo", value: 0 },
        { label: "Entrega", value: 1 },
        { label: "Balcão", value: 2 },
        { label: "Retirada", value: 3 },
      ],
      columns: [
        {
          name: "nom_bairro",
          required: true,
          label: "Bairro",
          align: "left",
          field: "nom_bairro",
          sortable: true,
        },
        {
          name: "taxa_bairro",
          align: "right",
          label: "Taxa de entrega",
          field: "taxa_bairro",
          sortable: true,
        },
      ],
      dadosBairroEntrega: [],
      dadosCliente: [],
      selected: ref([]),
    };
  },
  watch: {
    selected() {
      if (this.selected.length > 0) {
        this.text = this.selected[0].taxa_bairro;
      } else {
        this.text = this.dadosCliente.taxa_entrega_cliente;
      }
    },
  },

  methods: {
    async onShowModal() {
      this.date = this.dataHoraBR();
      await controlleBairroEntrega.dispatch("LOAD_BAIRROENTREGA");
      this.dadosBairroEntrega = controlleBairroEntrega.state.bairroDeEntrega;

      if ("msg" in this.dadosBairroEntrega) {
        alert(this.dadosBairroEntrega.msg);
        this.dadosBairroEntrega = [];
      } else {
        this.selected = this.dadosBairroEntrega.filter((d) => {
          return (
            d.id_bairro == controllerCliente.state.selecionado[0].id_bairro
          );
        });
      }

      this.dadosCliente = controllerCliente.state.selecionado[0];
      this.text = this.dadosCliente.taxa_entrega_cliente;
    },

    async selecionarTipo() {
      if (this.model.value == 0) {
        this.tipoVazio();
        return false;
      }
      this.tipoDeRegistro();
    },

    fecharTelaTipo() {
      this.$q
        .dialog({
          title: "Deseja fechar a programação do pedido ?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onCancelClick();
        });
    },

    tipoDeRegistro() {
      if (parseInt(this.text) == 0 && this.model.value == 1) {
        this.$q
          .dialog({
            title: "Sem o valor da taxa de entrega deseja continuar?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.finalizar();
          });
      } else {
        this.finalizar();
      }
    },

    async finalizar() {
      const upComanda = [
        {
          id_comanda: controller.state.comanda[0].id_comanda,
          id_cliente: controllerCliente.state.selecionado[0].id_cliente,
          num_comanda: controller.state.comanda[0].num_comanda,
          tipo: controller.state.comanda[0].tipo,
          fl_comanda: controller.state.comanda[0].fl_comanda,
          origem_comanda: this.model.value,
          dtentrega_comanda: this.dataBD(this.date),
          hrentrega_comanda: this.horaBD(this.date).substring(0, 5),
        },
      ];

      controller.commit("SET_COMANDA", upComanda);
      await controller.dispatch("ATUALIZAR_COMANDA", upComanda[0]);

      //seta os valore ao cliente
      controllerCliente.state.selecionado[0].taxa_entrega_cliente = this.text;
      controllerCliente.state.selecionado[0].id_bairro =
        this.selected.length > 0 ? this.selected[0].id_bairro : 0;
      await controllerCliente.dispatch(
        "ALTERAR_CLIENTE",
        controllerCliente.state.selecionado[0]
      );

      this.onDialogOK();
    },
  },
};
</script>
