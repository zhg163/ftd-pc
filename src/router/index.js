import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GlobalFarmsView from '../views/GlobalFarmsView.vue'
import LocaDemo from '../views/LocaDemo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/global-farms',
      name: 'globalFarms',
      component: GlobalFarmsView
    },
    {
      path: '/loca-demo',
      name: 'locaDemo',
      component: LocaDemo
    }
  ]
})

export default router 