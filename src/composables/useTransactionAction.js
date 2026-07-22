import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

export function useTransactionAction() {
  const loading = ref(false)
  const checkingPlate = ref(false)
  const authStore = useAuthStore()

  const checkPlateStatus = async (platNomor) => {
    if (!platNomor || !platNomor.trim()) {
      toast.warn("Mohon masukkan nomor plat terlebih dahulu!")
      return { success: false, reason: 'empty' }
    }

    const platClean = platNomor.trim().toUpperCase()
    checkingPlate.value = true

    try {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0).toISOString()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

      const { data: duplicates, error } = await supabase
        .from('transaksi_pertalite')
        .select('id, liter, harga, waktu_pencatatan, jenis_kendaraan')
        .eq('plat_nomor', platClean)
        .gte('waktu_pencatatan', startOfDay)
        .lte('waktu_pencatatan', endOfDay)
        .order('waktu_pencatatan', { ascending: false })

      if (error) throw error

      if (duplicates && duplicates.length > 0) {
        const last = duplicates[0]
        const dateObj = new Date(last.waktu_pencatatan)
        const timeFormatted = dateObj.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        })
        return {
          success: true,
          hasRefueledToday: true,
          countToday: duplicates.length,
          lastTransaction: last,
          timeFormatted,
          plat: platClean
        }
      } else {
        return {
          success: true,
          hasRefueledToday: false,
          countToday: 0,
          lastTransaction: null,
          plat: platClean
        }
      }
    } catch (err) {
      console.error("[checkPlateStatus] Error:", err)
      toast.error("Gagal memeriksa database: " + err.message)
      return { success: false, reason: 'error' }
    } finally {
      checkingPlate.value = false
    }
  }

  const submitTransaction = async (formData, vehicleType) => {
    const { plat_nomor, liter, total_harga } = formData
    const plat = plat_nomor ? plat_nomor.trim().toUpperCase() : ''

    if (!plat || !liter) {
      toast.warn("Mohon lengkapi data!")
      return false
    }

    loading.value = true

    try {
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
    checkingPlate,
    checkPlateStatus,
    submitTransaction
  }
}