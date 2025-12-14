// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import store
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, layout: 'auth' } // Layout Auth (Kosong)
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, role: 'manajer', layout: 'admin' } // Pakai Sidebar
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { requiresAuth: true, role: 'manajer', layout: 'admin' } // Pakai Sidebar
    },
    {
      path: '/operator',
      name: 'operator',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true, role: 'operator', layout: 'operator' } // Ganti ke 'operator'
    },
    {
      path: '/operator/history',
      name: 'operator-history',
      component: () => import('../views/OperatorHistoryView.vue'),
      meta: { requiresAuth: true, role: 'operator', layout: 'operator' } // Layout Operator
    }
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Jika user belum terload (misal saat refresh page), tunggu initialize selesai
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initialize()
  }

  const isAuthenticated = !!authStore.user
  const userRole = authStore.role

  // 1. Cek apakah halaman butuh login
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Belum login -> lempar ke login
      return next({ name: 'login' })
    }

    // 2. Cek Role (Jika halaman spesifik butuh role tertentu)
    if (to.meta.role && to.meta.role !== userRole) {
      // Login tapi salah kamar -> kembalikan ke tempat yang sesuai
      if (userRole === 'manajer') return next({ name: 'dashboard' })
      if (userRole === 'operator') return next({ name: 'operator' })
      return next({ name: 'login' }) 
    }
  }

  // 3. Jika sudah login tapi buka halaman login, lempar ke dashboard masing-masing
  if (to.name === 'login' && isAuthenticated) {
    if (userRole === 'manajer') return next({ name: 'dashboard' })
    if (userRole === 'operator') return next({ name: 'operator' })
  }

  next()
})

export default router