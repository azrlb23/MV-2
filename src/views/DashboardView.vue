<script setup>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import { useDashboard } from '@/composables/useDashboard'

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
  <div class="flex flex-col h-full overflow-hidden gap-3 pb-2 animate-enter">
    
    <div class="flex-none pt-1">
      <DashboardHeader v-model="filter" />
    </div>

    <div class="flex-none">
      <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
    </div>

    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
      
      <DashboardLiveFeed :items="feed" class="h-full overflow-hidden" />
      
      <DashboardCharts 
        :shift-data="shiftStats" 
        :vehicle-data="vehicleStats" 
        class="lg:col-span-2 h-full overflow-hidden"
      />
    </div>

  </div>
</template>