<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Import useRouter
import { useAuthStore } from '@/stores/auth'

const isSidebarOpen = ref(false)
const router = useRouter() // Init Router
const route = useRoute()
const authStore = useAuthStore()

// State untuk Global Search
const globalSearch = ref('')

// Data User Dinamis
const userEmail = computed(() => authStore.user?.email || 'User')
const userRole = computed(() => authStore.role || 'Guest')
const userName = computed(() => userEmail.value.split('@')[0])

const handleLogout = async () => {
  await authStore.logout()
}

// FUNGSI BARU: Handle Global Search
const handleGlobalSearch = () => {
  if (globalSearch.value.trim()) {
    // Redirect ke halaman history dengan query parameter 'q'
    router.push({ 
      name: 'history', 
      query: { q: globalSearch.value } 
    })
    // Opsional: Kosongkan search bar setelah enter
    // globalSearch.value = '' 
  }
}

// Menu Items... (biarkan tetap sama)
const menuItems = [
  // ... item menu Anda ...
  { 
    name: 'Dashboard', 
    route: '/dashboard',
    iconPath: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' 
  },
  { 
    name: 'History', 
    route: '/history',
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' 
  },
  { 
    name: 'Laporan', 
    route: '/laporan', 
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' 
  },
  { 
    name: 'Team', 
    route: '/team',
    iconPath: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' 
  },
  { 
    name: 'Bantuan IT', 
    route: '/support',  
    iconPath: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' 
  },
]
</script>

<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans text-gray-800 overflow-hidden">
    
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
      @click="isSidebarOpen = false"
    ></div>

    <aside 
      class="fixed inset-y-0 left-0 z-30 w-64 bg-[#f5f5f5] p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static border-r border-gray-200/50 flex flex-col h-full overflow-y-auto"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
        <div class="mb-10 flex items-center gap-3 px-2 flex-none">
            <img src="@/assets/HJ_dark.png" alt="Habi Jaya Logo" class="w-12 h-12" />
            <div>
            <h1 class="text-xl font-black tracking-tighter text-green-800 leading-none">HABI JAYA</h1>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Management</p>
            </div>
        </div>

        <nav class="space-y-1 flex-1">
            <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Menu</p>
            <router-link 
            v-for="item in menuItems" 
            :key="item.name" 
            :to="item.route"
            class="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group"
            :class="route.path === item.route 
                ? 'bg-gray-200/50 font-bold text-black' 
                : 'font-medium text-gray-500 hover:bg-gray-200/50 hover:text-black'"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.iconPath" />
            </svg>
            {{ item.name }}
            </router-link>
            
            <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-8">General</p>
            
            <button @click="handleLogout" class="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-red-500 hover:bg-red-50 transition-all text-left">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Logout
            </button>
        </nav>
    </aside>

    <div class="flex-1 flex flex-col h-full overflow-hidden relative w-full">
      
      <header class="flex-none flex items-center justify-between p-4 md:px-8 md:py-6 bg-[#f5f5f5] z-10">
        <button @click="isSidebarOpen = true" class="md:hidden p-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </button>

        <div class="hidden md:flex items-center bg-gradient-to-r from-[#143d2e] to-[#1e5c45] rounded-full px-6 py-3 w-96 shadow-lg shadow-green-900/20 transition-all focus-within:ring-2 focus-within:ring-green-400 focus-within:w-[28rem]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white/70 mr-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            v-model="globalSearch"
            @keyup.enter="handleGlobalSearch"
            type="text" 
            placeholder="Cari Plat Nomor (Tekan Enter)" 
            class="bg-transparent text-white placeholder-white/70 outline-none w-full text-sm font-medium" 
          />
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right md:block">
            <p class="text-sm font-bold leading-tight capitalize">{{ userName }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-600">
             {{ userName.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <slot></slot>
      </main>

    </div>
  </div>
</template>