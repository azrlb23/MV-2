<script setup>
import { computed } from 'vue'

const props = defineProps({
  vehicleData: { type: Array, default: () => [] },
  shiftData: { type: Array, default: () => [] }
})

// === LOGIKA CHART 1: SHIFT DISTRIBUTION ===
// Menghitung % Shift 2 (Warna Hitam)
const shiftChartStyle = computed(() => {
  const total = props.shiftData.reduce((acc, curr) => acc + curr.value, 0)
  if (!total) return { background: 'white' }

  // Cari jumlah Shift 2 (asumsi label di DB adalah angka 1 atau 2)
  const shift2 = props.shiftData.find(s => s.label == 2)?.value || 0
  const percent = Math.round((shift2 / total) * 100)

  // White = Shift 1, Black = Shift 2
  // Rumus conic-gradient: Putih dari 0% sampai X%, Hitam sisanya
  return { 
    background: `conic-gradient(white 0% ${100 - percent}%, black ${100 - percent}% 100%)` 
  }
})

// === LOGIKA CHART 2: VEHICLE TYPE ===
// Menghitung % Mobil (Warna Hitam)
const vehicleChartStyle = computed(() => {
  const total = props.vehicleData.reduce((acc, curr) => acc + curr.value, 0)
  if (!total) return { background: 'white' }

  // Cari jumlah Mobil (sesuaikan string 'Mobil' dengan isi database Anda, case sensitive)
  // Jika database pakai 'mobil' (huruf kecil), ganti jadi s.label === 'mobil'
  const mobil = props.vehicleData.find(s => s.label === 'Mobil' || s.label === 'mobil')?.value || 0
  const percent = Math.round((mobil / total) * 100)

  // White = Motor, Black = Mobil
  return { 
    background: `conic-gradient(white 0% ${100 - percent}%, black ${100 - percent}% 100%)` 
  }
})
</script>

<template>
  <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-[2rem] p-6 md:p-8 text-white shadow-lg lg:col-span-1 flex flex-col items-center">
    <h4 class="font-bold text-lg mb-6 self-start">shift distribution</h4>
    
    <div 
      class="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500"
      :style="shiftChartStyle"
    >
      </div>
    
    <div class="flex gap-4 mt-6">
      <div class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-white rounded-full"></span> Shift 1</div>
      <div class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-black rounded-full"></span> Shift 2</div>
    </div>
  </div>

  <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-[2rem] p-6 md:p-8 text-white shadow-lg lg:col-span-1 flex flex-col items-center">
    <h4 class="font-bold text-lg mb-6 self-start">vehicle type</h4>
    
    <div 
      class="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500"
      :style="vehicleChartStyle"
    >
    </div>

    <div class="flex gap-4 mt-6">
      <div class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-white rounded-full"></span> Motor</div>
      <div class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-black rounded-full"></span> Mobil</div>
    </div>
  </div>
</template>