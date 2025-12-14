<script setup>
const props = defineProps({
  transactions: Array,
  loading: Boolean,
  currentPage: Number,
  totalItems: Number,
  itemsPerPage: Number
})

const emit = defineEmits(['changePage'])

// Helper Formatters (Lokal di komponen ini saja karena hanya untuk display)
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Navigasi
const nextPage = () => {
  if ((props.currentPage * props.itemsPerPage) < props.totalItems) {
    emit('changePage', props.currentPage + 1)
  }
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('changePage', props.currentPage - 1)
  }
}
</script>

<template>
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
          <template v-if="loading">
            <tr v-for="n in 5" :key="n" class="border-b border-white/5">
              <td class="py-4 pl-2"><div class="skeleton h-4 w-24 bg-white/10 rounded"></div></td>
              <td class="py-4"><div class="skeleton h-6 w-16 bg-white/10 rounded-full"></div></td>
              <td class="py-4"><div class="skeleton h-4 w-20 bg-white/10 rounded"></div></td>
              <td class="py-4"><div class="skeleton h-4 w-12 bg-white/10 rounded"></div></td>
              <td class="py-4"><div class="skeleton h-4 w-24 bg-white/10 rounded"></div></td>
              <td class="py-4 pr-2 flex justify-end"><div class="skeleton h-6 w-16 bg-white/10 rounded-md"></div></td>
            </tr>
          </template>

          <template v-else-if="transactions.length > 0">
            <tr 
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
          </template>

          <tr v-else>
            <td colspan="6" class="py-12 text-center flex flex-col items-center justify-center text-green-100/50">
              <span class="text-4xl mb-2">🍃</span>
              <span class="italic">Tidak ada riwayat transaksi ditemukan.</span>
            </td>
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
</template>