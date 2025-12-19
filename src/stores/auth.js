import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const isLoading = ref(false)

  const initialize = async () => {
    isLoading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      user.value = session.user
      const { data: roleData } = await supabase.rpc('get_user_role')
      role.value = roleData
    }
    isLoading.value = false
  }

  const login = async (email, password) => {
    isLoading.value = true
    try {
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      
      user.value = session.user

      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role')
      if (roleError) console.error("Gagal ambil role:", roleError)

      role.value = roleData
      return { success: true, role: roleData }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    role.value = null
    window.location.href = '/' 
  }

  return { user, role, isLoading, login, logout, initialize }
})