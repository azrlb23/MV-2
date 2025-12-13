<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import AdminLayout from '@/layouts/AdminLayout.vue'

// State
const transactions = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// Helper Formatters
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Fetch Data dengan Pagination & Search
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

// Watcher untuk Search & Pagination
watch([currentPage, searchQuery], () => {
  fetchHistory()
})

onMounted(() => {
  fetchHistory()
})

// Navigasi Halaman
const nextPage = () => {
  if ((currentPage.value * itemsPerPage) < totalItems.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <AdminLayout>
    <div class="flex flex-col gap-6">
      
      <div class="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-black tracking-tight mb-1">transaction history</h2>
          <p class="text-gray-500 text-sm">Rekapitulasi seluruh transaksi operasional</p>
        </div>

        <div class="relative w-full md:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari Plat Nomor..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#143d2e] focus:border-transparent shadow-sm text-sm transition-all"
          >
          <span class="absolute left-3.5 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-[2rem] p-6 md:p-8 shadow-xl shadow-green-900/10 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none"></div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-green-100/70 text-xs uppercase tracking-wider border-b border-white/10">
                <th class="pb-4 pl-2 font-medium">Waktu</th>
                <th class="pb-4 font-medium">Kendaraan</th>
                <th class="pb-4 font-medium">Plat Nomor</th>
                <th class="pb-4 font-medium">Volume</th>
                <th class="pb-4 font-medium">Revenue</th>
                <th class="pb-4 pr-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="6" class="py-8 text-center text-green-100/50">Memuat data...</td>
              </tr>
              <tr 
                v-else-if="transactions.length > 0"
                v-for="trx in transactions" 
                :key="trx.id" 
                class="group hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0"
              >
                <td class="py-4 pl-2 text-green-50 font-medium">{{ formatDate(trx.waktu_pencatatan) }}</td>
                <td class="py-4">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" 
                    :class="trx.jenis_kendaraan === 'Mobil' ? 'bg-blue-500/20 text-blue-100' : 'bg-yellow-500/20 text-yellow-100'">
                    {{ trx.jenis_kendaraan }}
                  </span>
                </td>
                <td class="py-4 font-mono text-white/90">{{ trx.plat_nomor }}</td>
                <td class="py-4 text-white/80">{{ trx.liter }} L</td>
                <td class="py-4 font-bold text-white">{{ formatRupiah(trx.harga) }}</td>
                <td class="py-4 pr-2 text-right">
                  <span class="text-xs text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded-md">Success</span>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6" class="py-8 text-center text-green-100/50 italic">Tidak ada riwayat transaksi ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <span class="text-xs text-green-100/60">
            Menampilkan {{ transactions.length ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - 
            {{ Math.min(currentPage * itemsPerPage, totalItems) }} dari {{ totalItems }} data
          </span>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition-all"
            >
              Prev
            </button>
            <button 
              @click="nextPage" 
              :disabled="(currentPage * itemsPerPage) >= totalItems"
              class="px-4 py-2 rounded-full bg-white text-[#143d2e] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition-all shadow-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>