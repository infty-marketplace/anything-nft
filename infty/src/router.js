import Vue from "vue";
import Router from "vue-router";

import CreatePage from "./pages/CreatePage.vue";
import MainPage from "./pages/MainPage.vue";
import Marketplace from "./pages/Marketplace";
import DetailPage from "./pages/DetailPage";
Vue.use(Router);
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: MainPage,
    },
    {
      path: "/marketplace",
      component: Marketplace,
    },
    {
      path: "/mine/create",
      component: CreatePage,
    },
    {
      path: "/card/:id",
      name: "card-detail",
      component: DetailPage,
      props: true,
    },
  ],
});
