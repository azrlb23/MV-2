import { ref, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export function useDashboard() {
  const filter = ref('today')
  const isLoading = ref(false)
  
  // Struktur Data Awal
  const stats = ref({ volume: 0, revenue: 0, vehicle: 0 })
  const feed = ref([])
  const chartData = ref([])
  const vehicleStats = ref([])
  const shiftStats = ref([])

  const fetchData = async () => {
    try {
      isLoading.value = true
      // Memanggil RPC Supabase
      const { data, error } = await supabase.rpc('get_dashboard_summary', { 
        p_filter: filter.value 
      })
      
      if (error) throw error

      if (data) {
        stats.value = data.stats
        feed.value = data.feed
        chartData.value = data.chart
        vehicleStats.value = data.vehicle_chart
        shiftStats.value = data.shift_chart
      }
    } catch (err) {
      console.error("Gagal load data dashboard:", err.message)
    } finally {
      isLoading.value = false
    }
  }

  // Setup Lifecycle & Polling
  let intervalId
  
  onMounted(() => {
    fetchData()
    intervalId = setInterval(fetchData, 30000) // Auto refresh tiap 30 detik
  })

  onUnmounted(() => clearInterval(intervalId))

  // Watcher Filter
  watch(filter, () => fetchData())

  return {
    filter,
    isLoading,
    stats,
    feed,
    chartData,
    vehicleStats,
    shiftStats
  }
}