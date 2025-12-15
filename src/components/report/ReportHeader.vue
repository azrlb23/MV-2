<script setup>
// Menerima props dari Parent (View)
defineProps({
  startDate: String,
  endDate: String,
  loading: Boolean,
  exportLoading: Boolean
})

// Mengirim update ke Parent
const emit = defineEmits(['update:startDate', 'update:endDate', 'fetch', 'export'])
</script>

<template>
  <div class="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
    
    <div>
      <h2 class="text-3xl font-extrabold text-black tracking-tight">Laporan Operasional</h2>
      <p class="text-gray-500 text-sm">Analisis performa & unduh data transaksi.</p>
    </div>

    <div class="w-full xl:w-auto flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
      
      <div class="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex-1">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase">Dari</span>
          <input 
            :value="startDate"
            @input="emit('update:startDate', $event.target.value)"
            type="date" 
            class="bg-transparent outline-none text-sm font-bold text-gray-700 w-full" 
          />
        </div>
        <div class="w-px h-8 bg-gray-300 mx-2"></div>
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase">Sampai</span>
          <input 
            :value="endDate"
            @input="emit('update:endDate', $event.target.value)"
            type="date" 
            class="bg-transparent outline-none text-sm font-bold text-gray-700 w-full" 
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button 
          @click="emit('fetch')"
          :disabled="loading"
          class="flex-1 bg-[#143d2e] hover:bg-[#0f2e23] text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          <span v-else>Tampilkan</span>
        </button>

        <button 
          @click="emit('export')"
          :disabled="exportLoading"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-green-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="exportLoading" class="loading loading-spinner loading-xs"></span>
          <span v-else class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </span>
        </button>
      </div>
    </div>
  </div>
</template>