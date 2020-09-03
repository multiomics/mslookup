import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
import '@/assets/extra/theme.less'
import locale from 'view-design/dist/locale/en-US';
import VueResource  from 'vue-resource'

Vue.use(ViewUI, { locale });
Vue.use(VueResource)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
