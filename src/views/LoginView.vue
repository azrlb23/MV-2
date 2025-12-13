<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.warn("Mohon isi email dan password!")
    return
  }

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    toast.success("Login Berhasil!")
    // Redirect logis berdasarkan role
    if (result.role === 'manajer') {
      router.push('/dashboard')
    } else if (result.role === 'operator') {
      router.push('/operator')
    } else {
      router.push('/')
    }
  } else {
    toast.error(`Gagal: ${result.error}`)
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#12442D] to-[#2DAA71] p-4 font-sans">
    
    <div class="bg-white w-full max-w-[400px] p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col justify-center animate-fade-in-up">
      
      <h1 class="text-3xl font-bold text-center text-black mb-10 tracking-tight">Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-8">
        
        <div class="relative group">
          <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="nama@email.com"
            class="w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#1e1b4b] transition-colors bg-transparent text-base"
            required 
          />
        </div>

        <div class="relative group">
          <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#1e1b4b] transition-colors bg-transparent text-base"
            required 
          />
        </div>

        <div class="pt-6 flex justify-center">
          <button 
            type="submit" 
            :disabled="authStore.isLoading"
            class="w-full md:w-3/4 py-3 rounded-full text-white font-bold text-lg bg-gradient-to-r from-[#12442D] to-[#2DAA71] shadow-lg hover:shadow-xl hover:opacity-90 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ authStore.isLoading ? 'Memproses...' : 'Log In' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<style scoped>
/* Animasi masuk halus saat halaman dimuat */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>