import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

// State global untuk menyimpan ID user yang sedang online
const onlineUserIds = ref(new Set())

export function usePresence() {
  const authStore = useAuthStore()
  let channel = null

  // Fungsi 1: Wajib dipanggil di App.vue agar semua user "Lapor Diri" saat login
  const initPresence = () => {
    if (!authStore.user) return

    // Gabung ke channel global 'system-presence'
    channel = supabase.channel('system-presence')

    channel
      .on('presence', { event: 'sync' }, () => {
        // Saat ada perubahan status, update daftar user online
        const newState = channel.presenceState()
        const userIds = new Set()
        
        // Loop semua user yang ada di channel
        for (const id in newState) {
          // newState[id] berisi array session, kita ambil user_id dari tracking kita
          const sessions = newState[id]
          sessions.forEach(session => {
            if (session.user_id) userIds.add(session.user_id)
          })
        }
        
        onlineUserIds.value = userIds
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Setelah terkoneksi, kirim data diri (ID) ke channel
          await channel.track({ 
            user_id: authStore.user.id,
            online_at: new Date().toISOString()
          })
        }
      })
  }

  // Fungsi 2: Logout / Cleanup
  const leavePresence = async () => {
    if (channel) {
      await channel.unsubscribe()
      channel = null
    }
  }

  return {
    onlineUserIds,
    initPresence,
    leavePresence
  }
}