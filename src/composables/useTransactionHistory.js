import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRoute } from 'vue-router'

export function useTransactionHistory(itemsPerPage = 10, options = {}) {
  
  const transactions = ref([])
  const loading = ref(false)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const searchQuery = ref('')
  
  const route = useRoute()

  
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

      
      if (searchQuery.value) {
        query = query.ilike('plat_nomor', `%${searchQuery.value}%`)
      }

      
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

  
  watch([currentPage, searchQuery], () => {
    fetchHistory()
  })

  
  
  watch(() => route.query.q, (newQuery) => {
    if (newQuery !== undefined) {
      searchQuery.value = newQuery
      
      
    }
  })

  
  onMounted(() => {
    
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