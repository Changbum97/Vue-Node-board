import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRouter);

import MainPage from './pages/Main.vue'
import BoardPage from './pages/Board.vue'
import WritePage from './pages/Write.vue'
import ContentPage from './pages/Content.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path:'/',
      component: MainPage,
    }, {
      path: '/board/:id',
      component: BoardPage,
    }, {
      path: '/board/:id/write',
      component: WritePage,
    }, {
      path: '/board/:id/content',
      component: ContentPage,
    }
  ]
});

new Vue({
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app')
