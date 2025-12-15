<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userEmail = computed(() => authStore.user?.email || 'Operator')
const userName = computed(() => userEmail.value.split('@')[0])

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="h-screen w-full bg-[#f0fdf4] font-sans text-gray-800 flex flex-col overflow-hidden">
    
    <header class="bg-white/80 backdrop-blur-md border-b border-green-100 flex-none z-50">
      <div class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        <div class="flex items-center gap-3">
          <img src="@/assets/HJ_dark.png" alt="Logo" class="w-8 h-8" />
          <div>
            <h1 class="font-black text-lg tracking-tight text-[#143d2e] leading-none">HABI JAYA</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operator Console</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:block text-right">
            <p class="text-sm font-bold capitalize">{{ userName }}</p>
            <p class="text-xs text-gray-500">Shift Operasional</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-200">
            {{ userName.charAt(0).toUpperCase() }}
          </div>
          <button 
            @click="handleLogout"
            class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col overflow-y-auto relative">
      <slot></slot>
    </main>

    <footer class="flex-none text-center py-4 text-xs text-gray-400 bg-[#f0fdf4]">
      &copy; {{ new Date().getFullYear() }} Habi Jaya System
    </footer>
  </div>
</template>