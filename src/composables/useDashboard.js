import { ref, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export function useDashboard() {
  const filter = ref('today')
  const isLoading = ref(false)
  
  // State Data Lama
  const stats = ref({ volume: 0, revenue: 0, vehicle: 0 })
  const feed = ref([])
  const shiftStats = ref([])
  const vehicleStats = ref([])
  const peakHourStats = ref([]) 
  const loyalStats = ref([])    

  // State Data BARU
  const trendStats = ref([])       // Feature 1
  const ticketSizeStats = ref([])  // Feature 2
  const revenueShareStats = ref([]) // Feature 3

  const fetchData = async () => {
    try {
      isLoading.value = true
      console.log(`[Dashboard] Fetching data for filter: ${filter.value}...`)

      const { data, error } = await supabase.rpc('get_dashboard_summary', { 
        p_filter: filter.value 
      })
      
      if (error) {
        console.error("[Dashboard] Supabase RPC Error:", error)
        throw error
      }

      if (data) {
        stats.value = data.stats || { volume: 0, revenue: 0, vehicle: 0 }
        feed.value = data.feed || []
        shiftStats.value = data.shift_chart || []
        vehicleStats.value = data.vehicle_chart || []
        peakHourStats.value = data.peak_hours || []
        loyalStats.value = data.loyal_customers || []
        
        // Assign Data Baru
        trendStats.value = data.trend_7_days || []
        ticketSizeStats.value = data.ticket_size || []
        revenueShareStats.value = data.revenue_share || []
        
        console.log("[Dashboard] All stats updated.")
      }
    } catch (err) {
      console.error("[Dashboard] Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  let intervalId
  onMounted(() => {
    fetchData()
    intervalId = setInterval(fetchData, 30000)
  })

  onUnmounted(() => clearInterval(intervalId))

  watch(filter, () => fetchData())

  return {
    filter, isLoading, stats, feed, 
    shiftStats, vehicleStats, peakHourStats, loyalStats,
    // Return Data Baru
    trendStats, ticketSizeStats, revenueShareStats
  }
}