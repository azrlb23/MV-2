<script setup>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed.vue'
import DashboardShift from '@/components/dashboard/DashboardShift.vue'
import DashboardVehicle from '@/components/dashboard/DashboardVehicle.vue'
import DashboardPeakHours from '@/components/dashboard/DashboardPeakHours.vue'
import DashboardLoyalty from '@/components/dashboard/DashboardLoyalty.vue'
import DashboardTrend from '@/components/dashboard/DashboardTrend.vue'
import DashboardTicketSize from '@/components/dashboard/DashboardTicketSize.vue'
import DashboardRevenueShare from '@/components/dashboard/DashboardRevenueShare.vue'

import { useDashboard } from '@/composables/useDashboard'

const { 
  filter, stats, feed, 
  vehicleStats, shiftStats, peakHourStats, loyalStats,
  trendStats, ticketSizeStats, revenueShareStats,
  isLoading 
} = useDashboard()
</script>

<template>
  <div class="flex flex-col bg-[#f5f5f5] min-h-screen"> 
    
    <div class="flex-none flex flex-col gap-4 p-4 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0 z-10">
      <div class="animate-enter" style="animation-delay: 100ms">
        <DashboardHeader v-model="filter" />
      </div>
      <div class="hidden md:block animate-enter" style="animation-delay: 200ms">
        <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
      </div>
    </div>

    <div class="flex-1 p-4 md:p-6 lg:p-8 pt-4 md:pt-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-enter w-full pb-12" style="animation-delay: 300ms">
        
        <div class="md:hidden w-full">
           <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
        </div>
        
        <DashboardLiveFeed :items="feed" class="w-full" />

        <DashboardTrend :data="trendStats" class="w-full" />

        <DashboardRevenueShare :data="revenueShareStats" class="w-full" />

        <DashboardShift :data="shiftStats" class="w-full" />

        <DashboardVehicle :data="vehicleStats" class="w-full" />

        <DashboardTicketSize :data="ticketSizeStats" class="w-full" />

        <DashboardPeakHours :data="peakHourStats" class="w-full" />

        <DashboardLoyalty :customers="loyalStats" class="w-full" />
        
      </div>
    </div>

  </div>
</template>
<style scoped>
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;  
}

.custom-scrollbar::-webkit-scrollbar {
  display: none; 
}
</style>}