import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient' // Pastikan file ini sudah ada dari langkah sebelumnya

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const isLoading = ref(false)

  // Aksi Login
  const login = async (email, password) => {
    isLoading.value = true
    try {
      // 1. Login ke Supabase Auth
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      user.value = session.user

      // 2. Cek Role (Menggunakan RPC yang sudah Anda buat di database)
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role')
      
      if (roleError) {
        console.error("Gagal mengambil role:", roleError)
        // Opsional: throw error jika role wajib ada
      }

      role.value = roleData
      return { success: true, role: roleData }

    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Aksi Logout
  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    role.value = null
    window.location.href = '/'
  }

  return { user, role, isLoading, login, logout }
})