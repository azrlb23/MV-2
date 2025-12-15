<script setup>
defineProps({
  startDate: String,
  endDate: String,
  loading: Boolean,
  exportLoading: Boolean
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'fetch', 'export'])
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
    
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-[#143d2e]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-900 leading-none">Laporan Operasional</h2>
        <p class="text-xs text-gray-500 mt-0.5">Analisis & Export Data</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      
      <div class="flex items-center bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-100">
        <input 
          :value="startDate"
          @input="emit('update:startDate', $event.target.value)"
          type="date" 
          class="bg-transparent outline-none text-xs font-bold text-gray-600 w-24" 
        />
        <span class="text-gray-300 mx-1">-</span>
        <input 
          :value="endDate"
          @input="emit('update:endDate', $event.target.value)"
          type="date" 
          class="bg-transparent outline-none text-xs font-bold text-gray-600 w-24" 
        />
      </div>

      <div class="h-8 w-px bg-gray-200 mx-1"></div>

      <button 
        @click="emit('fetch')"
        :disabled="loading"
        class="bg-[#143d2e] hover:bg-[#0f2e23] text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50"
        title="Tampilkan Data"
      >
        <span v-if="loading" class="loading loading-spinner loading-xs"></span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>

      <button 
        @click="emit('export')"
        :disabled="exportLoading"
        class="bg-green-600 hover:bg-green-700 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-50"
        title="Export Excel"
      >
        <span v-if="exportLoading" class="loading loading-spinner loading-xs"></span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>

    </div>
  </div>
</template>