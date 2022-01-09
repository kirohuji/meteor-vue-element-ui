import Vue from 'vue'

import '../imports/ui/plugins'
import { BaseEnterProvider } from "lourd-components";
import App from '../imports/ui/App.vue'
import router from "../imports/ui/router";
import store from './store'
import "normalize.css/normalize.css"; // a modern alternative to CSS
import "../imports/ui/styles/variables.scss";
import "../imports/ui/styles/index.scss";
import permission from "../imports/ui/directive/permission";
import PermissionCheck from "../imports/ui/components/PermissionCheck";
Vue.use(permission);
Vue.use(BaseEnterProvider);
Vue.component("permission-check", PermissionCheck);
function createApp() {
  return new Vue({
    el: "#app",
    router,
    store,
    ...App,
  });
}
export default createApp;
