import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store.js'
import iView from 'iview';
import './assets/iviewtheme/iview.css';
import locale from 'iview/dist/locale/en-US';
import VueResource  from 'vue-resource'
import ReadMore from 'vue-read-more';
import ECharts from 'vue-echarts/components/ECharts'

Vue.config.productionTip = false;
Vue.use(iView, { locale });
Vue.use(VueResource);
Vue.use(ReadMore);
Vue.component('chart', ECharts);



const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', { get(){return this.$root.bus} });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data:{bus},
  store,
  components: { App },
  template: '<App/>'
});
