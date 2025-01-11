import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue')
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue')
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/AlertsView.vue')
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue')
    },
    {
      path: '/global-farms',
      name: 'globalFarms',
      component: () => import('../views/GlobalFarmsView.vue')
    },
    {
      path: '/loca-demo',
      name: 'locaDemo',
      component: () => import('../views/LocaDemo.vue')
    },
    {
      path: '/scale-map',
      name: 'scaleMap',
      component: () => import('../views/ScaleMapView.vue')
    }
  ]
})

export default router 