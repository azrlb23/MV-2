import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRoute } from 'vue-router'

export function useTransactionHistory(itemsPerPage = 10, options = {}) {
  // State
  const transactions = ref([])
  const loading = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const searchQuery = ref('')
  
  const route = useRoute()

  // 1. DEKLARASI FUNGSI FETCH (Namanya fetchHistory)
  const fetchHistory = async () => {
    loading.value = true
    try {
      const from = (currentPage.value - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      let query = supabase
        .from('transaksi_pertalite')
        .select('*', { count: 'exact' })
        .order('waktu_pencatatan', { ascending: false })
        .range(from, to)

      // Filter Search
      if (searchQuery.value) {
        query = query.ilike('plat_nomor', `%${searchQuery.value}%`)
      }

      // Filter Date (Opsional)
      if (options.dateFilter) {
        const today = new Date().toISOString().split('T')[0]
        query = query.gte('waktu_pencatatan', `${today}T00:00:00`)
                     .lte('waktu_pencatatan', `${today}T23:59:59`)
      }

      const { data, count, error } = await query

      if (error) throw error
      
      transactions.value = data
      totalItems.value = count
    } catch (err) {
      console.error('Error fetching history:', err.message)
    } finally {
      loading.value = false
    }
  }

  // 2. WATCHER UTAMA (Otomatis fetch saat page/search berubah)
  watch([currentPage, searchQuery], () => {
    fetchHistory()
  })

  // 3. WATCHER GLOBAL SEARCH (Tambahan Baru)
  // Ini akan mendeteksi perubahan URL (?q=...) dan mengupdate searchQuery
  watch(() => route.query.q, (newQuery) => {
    if (newQuery !== undefined) {
      searchQuery.value = newQuery
      // Tidak perlu panggil fetchHistory() manual, 
      // karena Watcher Nomor 2 di atas akan otomatis jalan saat searchQuery berubah.
    }
  })

  // Lifecycle
  onMounted(() => {
    // Cek URL saat pertama kali load
    if (route.query.q) {
      searchQuery.value = route.query.q
    }
    fetchHistory()
  })

  return {
    transactions,
    loading,
    totalItems,
    currentPage,
    searchQuery,
    fetchHistory
  }
}