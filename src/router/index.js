import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Registry from '@/components/Registry'
import NotFound from '@/components/NotFound'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: location.hostname.match(/localhost/)?'':'/',
  routes: [
      {
        path: '/',
        name: 'Registry',
        component: Registry

      },
      {
        path:'*',
        name: 'NotFound',
        component: NotFound,
      },
  ]
})
