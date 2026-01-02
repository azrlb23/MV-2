<script setup>
import HistoryHeader from '@/components/history/HistoryHeader.vue'
import HistoryTable from '@/components/history/HistoryTable.vue'
import { useTransactionHistory } from '@/composables/useTransactionHistory'

const { 
  transactions, 
  loading, 
  searchQuery, 
  currentPage, 
  totalItems 
} = useTransactionHistory(10)
</script>

<template>
  <div class="flex flex-col h-full gap-4 animate-enter overflow-hidden pb-4">
    
    <div class="flex-none pt-2 px-1">
      <HistoryHeader v-model="searchQuery" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto rounded-4xl relative hide-scrollbar">
      <HistoryTable 
        :transactions="transactions"
        :loading="loading"
        :current-page="currentPage"
        :total-items="totalItems"
        :items-per-page="10"
        @change-page="(newPage) => currentPage = newPage"
      />
    </div>

  </div>
</template>