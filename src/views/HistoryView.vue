<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import HistoryHeader from '@/components/history/HistoryHeader.vue'
import HistoryTable from '@/components/history/HistoryTable.vue'

// State Management
const transactions = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// Fetch Logic
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

// Watchers
watch([currentPage, searchQuery], () => {
  fetchHistory()
})

onMounted(() => {
  fetchHistory()
})
</script>

<template>
  <div class="flex flex-col gap-6 animate-enter">
    
    <HistoryHeader v-model="searchQuery" />

    <HistoryTable 
      :transactions="transactions"
      :loading="loading"
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @change-page="(newPage) => currentPage = newPage"
    />

  </div>
</template>