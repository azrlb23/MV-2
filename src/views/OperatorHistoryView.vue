<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import HistoryHeader from '@/components/history/HistoryHeader.vue'
import HistoryTable from '@/components/history/HistoryTable.vue'

// Reuse komponen yang sama = Tampilan & Animasi Konsisten

// State Management
const transactions = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// Fetch Logic (Mekanisme sama persis dengan Admin)
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
  <div class="flex flex-col gap-6 animate-enter pb-10">
    
    <div>
      <router-link to="/operator" class="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-bold mb-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Kembali ke Console
      </router-link>
    </div>

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