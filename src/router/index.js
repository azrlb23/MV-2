import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue' // Import LoginView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    // Placeholder untuk rute masa depan
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue') // Sementara arahkan ke HomeView dulu
    },
    {
      path: '/operator',
      name: 'operator',
      component: () => import('../views/HomeView.vue') // Sementara arahkan ke HomeView dulu
    }
  ],
})

export default router