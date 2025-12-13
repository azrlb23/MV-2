<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
    
    <div class="relative overflow-hidden bg-gradient-to-br from-[#143d2e] to-[#258f62] rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-green-900/10 hover:scale-[1.01] transition-transform duration-300">
      <p class="text-green-100 text-sm font-medium mb-2">total volume</p>
      <h3 class="text-4xl md:text-5xl font-bold mb-4">{{ stats.volume.toLocaleString() }} <span class="text-2xl font-normal opacity-70">L</span></h3>
      <div class="text-xs text-green-200 bg-white/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">↗ 12% improvement</div>
      <div class="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>

    <div class="relative overflow-hidden bg-gradient-to-br from-[#143d2e] to-[#258f62] rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-green-900/10 hover:scale-[1.01] transition-transform duration-300">
      <p class="text-green-100 text-sm font-medium mb-2">total revenue</p>
      <h3 class="text-3xl md:text-4xl font-bold mb-4 truncate">{{ formatRupiah(stats.revenue) }}</h3>
      <div class="text-xs text-green-200 bg-white/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">↗ 5% improvement</div>
      <div class="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>

    <div class="relative overflow-hidden bg-gradient-to-br from-[#143d2e] to-[#258f62] rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-green-900/10 hover:scale-[1.01] transition-transform duration-300">
      <p class="text-green-100 text-sm font-medium mb-2">total vehicle</p>
      <h3 class="text-4xl md:text-5xl font-bold mb-4">{{ stats.vehicle }}</h3>
      <div class="text-xs text-green-200 bg-white/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">{{ stats.vehicle }} times</div>
      <div class="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>

  </div>
</template>