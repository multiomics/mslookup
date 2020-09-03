import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'search',
      component: () => import(/* webpackChunkName: "editor" */ './views/Search.vue')
    },
    // {
    //   path: '/',
    //   redirect: to => {
    //       return { name: 'home'}
    //   }
    // },
  ]
})
