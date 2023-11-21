const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/TelaInicial.vue") },
      {
        path: "index",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
      },

      {
        path: "carrinho",
        name: "carrinho",
        component: () => import("pages/CarrinhoPage.vue"),
      },
      { path: "configura", component: () => import("pages/ConfiguraPage.vue") },
      {
        path: "painelPedidos",
        component: () => import("pages/PainelPedidos.vue"),
      },
      {
        path: "admin",
        name: "admin",
        component: () => import("pages/adminPage.vue"),
      },
      { path: "teste", component: () => import("pages/TesteCarrousel.vue") },
      {
        path: "lancamento",
        component: () => import("pages/LancamentoComanda.vue"),
      },
      {
        path: "finalizacao",
        component: () => import("pages/FinalizacaoPage.vue"),
      },
      { path: "feed", component: () => import("pages/FeedPage.vue") },
      { path: "nutricao", component: () => import("components/InfoNutricional.vue") },
      { path: "confirm", component: () => import("pages/ConfirmPage.vue") },
      { path: "cartoes", component: () => import("components/ModalCartoes.vue") },
      { path: "agendamento", component: () => import("components/ModalAgendamento.vue") },
      { path: "finaliza", component: () => import("components/ModalFinalizarPedido.vue") },
      { path: "pedidos", component: () => import("pages/PedidosPage.vue") },


    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
