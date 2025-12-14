<script setup>
defineEmits(['select'])
</script>

<template>
  <div class="flex flex-col items-center animate-enter w-full">
    <h3 class="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-center text-white">Pilih Jenis Kendaraan</h3>
    
    <div class="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-2xl justify-center">
      
      <button @click="$emit('select', 'Motor')" class="group relative flex-1 bg-white/10 hover:bg-yellow-500/20 border-2 border-white/20 hover:border-yellow-400 rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 flex flex-row md:flex-col items-center justify-center gap-4 hover:scale-[1.02] md:hover:scale-105 active:scale-95">
        <span class="text-4xl md:text-5xl">🛵</span>
        <span class="text-lg md:text-xl font-bold text-white group-hover:text-yellow-300">Motor</span>
      </button>

      <button @click="$emit('select', 'Mobil')" class="group relative flex-1 bg-white/10 hover:bg-blue-500/20 border-2 border-white/20 hover:border-blue-400 rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 flex flex-row md:flex-col items-center justify-center gap-4 hover:scale-[1.02] md:hover:scale-105 active:scale-95">
        <span class="text-4xl md:text-5xl">🚗</span>
        <span class="text-lg md:text-xl font-bold text-white group-hover:text-blue-300">Mobil</span>
      </button>
    
    </div>
  </div>
</template>