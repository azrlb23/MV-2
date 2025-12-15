<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  shiftData: { type: Array, default: () => [] },
  vehicleData: { type: Array, default: () => [] }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  borderWidth: 0,
  plugins: { legend: { display: false }, tooltip: { enabled: true } }
}

// ... (logika computed data shiftChartData & vehicleChartData SAMA SEPERTI SEBELUMNYA) ...
// Saya skip bagian computed datanya agar hemat tempat, salin saja dari file lama Anda.
const shiftChartData = computed(() => {
  const labels = props.shiftData.map(item => `Shift ${item.shift}`)
  const dataValues = props.shiftData.map(item => item.count)
  return {
    labels,
    datasets: [{ backgroundColor: ['#34d399', '#ffffff', '#fbbf24'], data: dataValues.length ? dataValues : [1] }]
  }
})

const vehicleChartData = computed(() => {
  const labels = props.vehicleData.map(item => item.label || 'Unknown')
  const dataValues = props.vehicleData.map(item => item.count)
  return {
    labels,
    datasets: [{ backgroundColor: ['#ffffff', '#34d399', '#10b981'], data: dataValues.length ? dataValues : [1] }]
  }
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
    
    <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-2xl p-4 text-white shadow-lg flex flex-col items-center justify-between relative overflow-hidden group h-full">
      <div class="w-full flex justify-between items-center z-10 mb-2">
        <h4 class="font-bold text-sm tracking-tight">Shift</h4>
        <span class="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-medium text-green-100">Today</span>
      </div>
      
      <div class="relative w-full flex-1 min-h-[120px] max-h-[180px] z-10 flex justify-center items-center">
        <Doughnut :data="shiftChartData" :options="chartOptions" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-2xl font-black text-white">{{ props.shiftData.reduce((a, b) => a + b.count, 0) }}</span>
        </div>
      </div>
      
      <div class="flex flex-wrap justify-center gap-3 mt-2 z-10">
        <div v-for="(item, index) in props.shiftData" :key="index" class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: shiftChartData.datasets[0].backgroundColor[index] }"></span>
          <span class="text-[10px] text-white/80">Shift {{ item.shift }}</span>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-2xl p-4 text-white shadow-lg flex flex-col items-center justify-between relative overflow-hidden group h-full">
      <div class="w-full flex justify-between items-center z-10 mb-2">
        <h4 class="font-bold text-sm tracking-tight">Vehicle</h4>
        <span class="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-medium text-green-100">Live</span>
      </div>
      
      <div class="relative w-full flex-1 min-h-[120px] max-h-[180px] z-10 flex justify-center items-center">
        <Doughnut :data="vehicleChartData" :options="chartOptions" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-2xl font-black text-white">{{ props.vehicleData.reduce((a, b) => a + b.count, 0) }}</span>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mt-2 z-10">
        <div v-for="(item, index) in props.vehicleData" :key="index" class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: vehicleChartData.datasets[0].backgroundColor[index] }"></span>
          <span class="text-[10px] text-white/80 capitalize">{{ item.label }}</span>
        </div>
      </div>
    </div>

  </div>
</template>