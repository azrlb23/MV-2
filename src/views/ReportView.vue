<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue3-toastify'
import * as XLSX from 'xlsx'

// Import Komponen Pecahan
import ReportHeader from '@/components/report/ReportHeader.vue' // Komponen Baru
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import HistoryTable from '@/components/history/HistoryTable.vue'

// --- STATE ---
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const exportLoading = ref(false)
const progress = ref(0) 

const stats = ref({ volume: 0, revenue: 0, vehicle: 0, volume_growth: 0, revenue_growth: 0 })
const transactions = ref([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// --- HELPERS ---
const setDefaultDates = () => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const today = new Date() 
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
}

const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// --- ACTIONS ---
const handleFetch = () => {
  currentPage.value = 1
  fetchReport()
}

const fetchReport = async () => {
  if (!startDate.value || !endDate.value) {
    toast.warn("Harap pilih rentang tanggal yang valid.")
    return
  }

  loading.value = true
  
  try {
    // 1. STATISTIK via RPC
    const { data: summary, error: rpcError } = await supabase
      .rpc('get_report_summary', { 
        start_date: `${startDate.value}T00:00:00`, 
        end_date: `${endDate.value}T23:59:59` 
      })

    if (rpcError) throw rpcError

    stats.value = {
      volume: summary.volume || 0,
      revenue: summary.revenue || 0,
      vehicle: summary.vehicle || 0,
      volume_growth: 0,
      revenue_growth: 0
    }

    // 2. DATA TABEL
    await fetchTableData()

  } catch (err) {
    console.error(err)
    toast.error("Gagal memuat laporan: " + err.message)
  } finally {
    loading.value = false
  }
}

const fetchTableData = async () => {
  const from = (currentPage.value - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, count, error } = await supabase
    .from('transaksi_pertalite')
    .select('*', { count: 'exact' })
    .gte('waktu_pencatatan', `${startDate.value}T00:00:00`)
    .lte('waktu_pencatatan', `${endDate.value}T23:59:59`)
    .order('waktu_pencatatan', { ascending: false })
    .range(from, to)

  if (error) throw error

  transactions.value = data
  totalItems.value = count
}

const downloadExcel = async () => {
  if (!startDate.value || !endDate.value) return
  
  exportLoading.value = true
  progress.value = 0
  
  try {
    let allData = []
    let page = 0
    let pageSize = 1000 
    let hasMore = true

    while (hasMore) {
      const from = page * pageSize
      const to = from + pageSize - 1
      
      const { data, error } = await supabase
        .from('transaksi_pertalite')
        .select('*')
        .gte('waktu_pencatatan', `${startDate.value}T00:00:00`)
        .lte('waktu_pencatatan', `${endDate.value}T23:59:59`)
        .order('waktu_pencatatan', { ascending: true })
        .range(from, to)

      if (error) throw error

      if (data.length > 0) {
        allData = [...allData, ...data]
        progress.value = allData.length
        page++
      }
      
      if (data.length < pageSize) hasMore = false
    }

    if (allData.length === 0) {
      toast.info("Tidak ada data untuk diexport.")
      return
    }

    const formattedData = allData.map(item => ({
      'ID': item.id,
      'Waktu': formatDate(item.waktu_pencatatan),
      'Jenis': item.jenis_kendaraan,
      'Plat Nomor': item.plat_nomor,
      'Volume (L)': item.liter,
      'Harga (Rp)': item.harga,
      'Operator': item.operator_id || '-'
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const colWidths = [{wch:8}, {wch:22}, {wch:10}, {wch:15}, {wch:12}, {wch:15}, {wch:30}]
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi")

    XLSX.writeFile(workbook, `Laporan_${startDate.value}_${endDate.value}.xlsx`)
    toast.success(`Berhasil mengunduh ${allData.length} data!`)

  } catch (err) {
    console.error(err)
    toast.error("Gagal export: " + err.message)
  } finally {
    exportLoading.value = false
    progress.value = 0
  }
}

watch(currentPage, () => {
  if (startDate.value && endDate.value) fetchTableData()
})

onMounted(() => {
  setDefaultDates()
  fetchReport()
})
</script>

<template>
  <div class="flex flex-col gap-6 animate-enter pb-10">
    
    <ReportHeader 
      v-model:startDate="startDate"
      v-model:endDate="endDate"
      :loading="loading"
      :exportLoading="exportLoading"
      @fetch="handleFetch"
      @export="downloadExcel"
    />

    <div v-if="exportLoading" class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div 
        class="bg-green-600 h-2.5 rounded-full transition-all duration-300 animate-pulse" 
        :style="{ width: '100%' }"
      ></div>
      <p class="text-xs text-center mt-1 text-gray-500">Sedang mengambil {{ progress }} data...</p>
    </div>

    <DashboardStats 
      :stats="stats" 
      filter="custom" 
      :loading="loading" 
    />

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