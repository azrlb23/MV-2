<script setup>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import { useDashboard } from '@/composables/useDashboard'

// Satu baris untuk mengambil semua logika dashboard!
const { 
  filter, 
  stats, 
  feed, 
  vehicleStats, 
  shiftStats, 
  isLoading 
} = useDashboard()
</script>

<template>
  <div class="h-full flex flex-col"> 
    <div class="animate-enter" style="animation-delay: 100ms">
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