import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'

import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
export const eventBus = new Vue();

Vue.config.productionTip = false;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(BootstrapVueIcons);
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
