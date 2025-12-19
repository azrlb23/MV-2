import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

export function useTransactionAction() {
  const loading = ref(false)
  const authStore = useAuthStore()

  const submitTransaction = async (formData, vehicleType) => {
    const { plat_nomor, liter, total_harga } = formData
    const plat = plat_nomor.toUpperCase()

    
    if (!plat || !liter) {
      toast.warn("Mohon lengkapi data!")
      return false
    }

    loading.value = true

    try {
      
      const today = new Date().toISOString().split('T')[0]
      const { data: duplicates } = await supabase
        .from('transaksi_pertalite')
        .select('id')
        .eq('plat_nomor', plat)
        .gte('waktu_pencatatan', `${today}T00:00:00`)
        .lte('waktu_pencatatan', `${today}T23:59:59`)
      
      if (duplicates && duplicates.length > 0) {
        const confirm = window.confirm("Kendaraan ini sudah mengisi BBM hari ini. Lanjutkan?")
        if (!confirm) return false
      }

      
      const { error } = await supabase.from('transaksi_pertalite').insert({
        plat_nomor: plat,
        liter: parseFloat(liter),
        harga: total_harga,
        jenis_kendaraan: vehicleType,
        operator_id: authStore.user?.id
      })

      if (error) throw error

      toast.success("Transaksi Berhasil!")
      return true 

    } catch (err) {
      console.error(err)
      toast.error("Gagal: " + err.message)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    submitTransaction
  }
}