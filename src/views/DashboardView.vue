<script setup>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardLiveFeed from '@/components/dashboard/DashboardLiveFeed.vue'

// GANTI: Hapus DashboardCharts, Import 2 komponen baru
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
  <div class="flex flex-col h-full overflow-hidden bg-[#f5f5f5]"> 
    
    <div class="flex-none flex flex-col gap-4 p-4 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0 z-10">
      <div class="animate-enter" style="animation-delay: 100ms">
        <DashboardHeader v-model="filter" />
      </div>
      <div class="hidden md:block animate-enter" style="animation-delay: 200ms">
        <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
      </div>
    </div>

    <div class="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6 lg:p-8 pt-4 md:pt-6">
      
      <div class="flex flex-row gap-4 md:gap-6 h-full items-stretch animate-enter w-max" style="animation-delay: 300ms">
        
        <div class="md:hidden flex-none w-[90vw] max-w-[350px]">
           <DashboardStats :stats="stats" :filter="filter" :loading="isLoading" />
        </div>
        
        <DashboardLiveFeed :items="feed" class="w-[320px] md:w-[400px] flex-none" />

        <DashboardTrend :data="trendStats" class="flex-none" />

        <DashboardRevenueShare :data="revenueShareStats" class="flex-none" />

        <DashboardShift :data="shiftStats" class="flex-none" />

        <DashboardVehicle :data="vehicleStats" class="flex-none" />

        <DashboardTicketSize :data="ticketSizeStats" class="flex-none" />

        <DashboardPeakHours :data="peakHourStats" class="flex-none" />

        <DashboardLoyalty :customers="loyalStats" class="flex-none" />
        
        <div class="w-4"></div> 
      </div>
    </div>

  </div>
</template>