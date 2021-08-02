import Vue from "vue";
import Router from "vue-router";

import CreatePage from "./pages/CreatePage.vue";
import MainPage from "./pages/MainPage.vue";
import Marketplace from "./pages/Marketplace";
import Collections from "./pages/Collections.vue";
import DetailPage from "./pages/DetailPage.vue";
import RafflePage from "./pages/RafflePage"
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
      path: "/mine/collections",
      component: Collections,
    },
    {
        path: "/raffles",
        component: RafflePage
    },
    {
      path: "/card/:id",
      name: "card-detail",
      component: DetailPage,
      props: true,
    },
  ],
});
