/** Vue main script */
import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Highcharts from 'highcharts';
import HighchartsStockModule from 'highcharts/modules/stock';
import HighchartsVue from 'highcharts-vue';
import Notifications from 'vue-notification';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import VueCarousel from 'vue-carousel';

import { store } from '@/stores';
import { openSocket } from './socket';

import router from '@/router';
import teleport from '@logue/vue2-helpers/teleport';

import '@/assets/tailwindcss.css';
import '@/assets/scss/main.scss';
import '@/assets/main.css';

import App from '@/App.vue';
import { PiniaVuePlugin } from 'pinia';
import { useGlobalStore } from '@/stores/global';
import { appHttp } from '@/axios';

Vue.config.productionTip = false;
Vue.component('Teleport', teleport);
Vue.filter('date_format', (value: Date | string) => {
  if (value === null) return 'None';
  const data = new Date(value);
  const year = data.getFullYear();
  const month = data.getMonth() + 1;
  const day = data.getDate();
  return `${year}/${month}/${day}`;
});
Vue.filter('time_format', (value: Date | string) => {
  if (value === null) return '';
  const data = new Date(value);
  const hour = data.getHours();
  const min = data.getMinutes();
  const sec = data.getSeconds();
  return `${hour}:${min}:${sec}`;
});
Vue.filter('number', (value: number) => {
  if (value == null) return 'None';
  return value.toFixed(2);
});
Vue.filter('integer', (value: number) => {
  if (value == null) return 'None';
  return value.toFixed();
});

if (localStorage.getItem('plant-iq-token')) {
  appHttp.defaults.headers.common.Authorization =
    localStorage.getItem('plant-iq-token');
}

// Bootstrap Config
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
// Notification Config
Vue.use(Notifications);

Vue.use(VueCarousel);

// Chart Config
HighchartsStockModule(Highcharts);
Vue.use(HighchartsVue);

// Pinia Config - Vuex Alternative
Vue.use(PiniaVuePlugin);

const vue = new Vue({
  router,
  render: h => h(App),
  pinia: store,
});

// Socket Config
openSocket();

// Run!
router
  .isReady()
  .then(() => {
    vue.$mount('#app');
  })
  .catch(e => console.error(e));
