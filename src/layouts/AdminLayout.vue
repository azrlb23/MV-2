<script setup>
import { ref, computed } from 'vue' // Tambah computed
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const isSidebarOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

// Data User Dinamis
const userEmail = computed(() => authStore.user?.email || 'User')
const userRole = computed(() => authStore.role || 'Guest')
// Ambil bagian depan email sebagai username sementara
const userName = computed(() => userEmail.value.split('@')[0])

const handleLogout = async () => {
  await authStore.logout()
  // Router push tidak diperlukan karena di store kita pakai window.location.href
}

// Menu (Bisa disesuaikan jika Operator punya menu beda)
const menuItems = [
  { name: 'Dashboard', icon: '', active: true },
  { name: 'History', icon: '', active: false },
  { name: 'Report', icon: '', active: false },
  { name: 'Team', icon: '', active: false },
]
</script>

<template>
  <div class="flex min-h-screen bg-[#f5f5f5] font-sans text-gray-800">
    <aside 
      class="fixed inset-y-0 left-0 z-30 w-64 bg-[#f5f5f5] p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:overflow-y-auto border-r border-gray-200/50"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="mb-10 flex items-center gap-3 px-2">
        <img src="@/assets/HJ_dark.png" alt="Habi Jaya Logo" class="w-12 h-12" />
        
        <div>
          <h1 class="text-xl font-black tracking-tighter text-green-800 leading-none">HABI JAYA</h1>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{{ userRole }}</p>
        </div>
      </div>

      <nav class="space-y-1">
        <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Menu</p>
        <a v-for="item in menuItems" :key="item.name" href="#" 
           class="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group"
           :class="item.active ? 'font-bold text-black' : 'font-medium text-gray-500 hover:bg-gray-200/50 hover:text-black'">
          <span class="text-lg">{{ item.icon }}</span> {{ item.name }}
        </a>
        
        <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-8">General</p>
        <button @click="handleLogout" class="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-red-500 hover:bg-red-50 transition-all text-left">
          <span></span> Logout
        </button>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <header class="flex items-center justify-between p-4 md:px-8 md:py-6 bg-[#f5f5f5]">
        <button @click="isSidebarOpen = true" class="md:hidden p-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </button>

        <div class="hidden md:flex items-center bg-gradient-to-r from-[#143d2e] to-[#1e5c45] rounded-full px-6 py-3 w-96 shadow-lg shadow-green-900/20">
          <input type="text" placeholder="search" class="bg-transparent text-white placeholder-white/70 outline-none w-full text-sm" />
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right md:block">
            <p class="text-sm font-bold leading-tight capitalize">{{ userRole }}</p>
            <p class="text-xs text-gray-500">{{ userEmail }}</p>
          </div>
          <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-600">
             {{ userName.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8 pt-0">
        <slot></slot>
      </main>
    </div>
  </div>
</template>