// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App';
import router from './router';
import store from './store';
import VueTribute from 'vue-tribute';

import axios from 'axios';
import VueAxios from 'vue-axios';
// import VueSocketIO from 'vue-socket.io';
import Notifications from 'vue-notification';
import LoadingIndication from './components/shared/LoadingIndication.vue';
// import './scss/minty-theme.css';
import './scss/material-theme.css';
import './scss/tribute.css';

import './scss/global.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPencilAlt,
  faTrashAlt,
  faSave,
  faThumbsUp,
  faThumbsDown,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
// @import '~vuetify/src/stylus/main' // Ensure you are using stylus-loader

Vue.use(Vuetify);

library.add(
  faPencilAlt,
  faTrashAlt,
  faSave,
  faThumbsUp,
  faThumbsDown,
  faSearch
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import ErrorMessage from './plugins/ErrorMessagePlugin';
import Loader from './plugins/Loader';

Vue.use(Notifications);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(ErrorMessage);
Vue.use(Loader);

Vue.component('loading-indication', LoadingIndication);

Vue.config.productionTip = false;

if (process.env.BACKEND_URL) {
  Vue.axios.defaults.baseURL = process.env.BACKEND_URL;
}

// Vue.use(VueSocketIO, process.env.BACKEND_URL.replace(/^http/, 'ws'), {
//   reconnection: true,
//   reconnectionDelay: 3000
// });

/* eslint-disable no-new */
export const eventBus = new Vue();

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App, VueTribute }
});
