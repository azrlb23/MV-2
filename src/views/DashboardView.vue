<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue' // <--- Jangan lupa import 'watch'
import { supabase } from '@/lib/supabaseClient'

import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'

// State
const filter = ref('today') // Nilai bisa: 'today', 'weekly', 'monthly'
const stats = ref({ volume: 0, revenue: 0, vehicle: 0 })
const feed = ref([])
const isLoading = ref(false)
const chartData = ref([])
const vehicleStats = ref([]) // Variable baru
const shiftStats = ref([])
// Fungsi Fetch Data dengan Parameter
const fetchData = async () => {
  try {
    isLoading.value = true
    
    // Kirim parameter filter.value ke database
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
    console.error("Gagal load data:", err.message)
  } finally {
    isLoading.value = false
  }
}

// WATCHER: Otomatis ambil data ulang saat filter berubah
watch(filter, () => {
  fetchData()
})

// Lifecycle
let intervalId
onMounted(() => {
  fetchData()
  intervalId = setInterval(fetchData, 30000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<template>
  <div class="h-full flex flex-col"> <div class="animate-enter" style="animation-delay: 100ms">
      <DashboardHeader v-model="filter" />
    </div>

    <div class="animate-enter" style="animation-delay: 200ms">
      <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch animate-enter flex-1" style="animation-delay: 300ms">
      <DashboardLiveFeed :items="feed" class="h-full" />
      <DashboardCharts 
        :shift-data="shiftStats" 
        :vehicle-data="vehicleStats" 
        class="lg:col-span-2 h-full"
      />
    </div>

  </div>
</template>