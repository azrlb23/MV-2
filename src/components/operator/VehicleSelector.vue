<script setup>
defineEmits(['select'])
</script>

<template>
  <div class="flex flex-col items-center animate-enter w-full space-y-2 md:space-y-4">
    <div class="text-center space-y-1 mb-2">
      <h3 class="text-xl md:text-2xl font-bold text-white tracking-tight">Pilih Jenis Kendaraan</h3>
      <p class="text-xs md:text-sm text-green-100/80">Silakan pilih kategori kendaraan yang akan diisi BBM</p>
    </div>
    
    <div class="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-2xl justify-center">
      
      <button 
        @click="$emit('select', 'Motor')" 
        class="group relative flex-1 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 flex items-center justify-center hover:scale-[1.02] md:hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
      >
        <span class="text-xl md:text-2xl font-black text-white tracking-wider uppercase">Motor</span>
      </button>

      <button 
        @click="$emit('select', 'Mobil')" 
        class="group relative flex-1 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 flex items-center justify-center hover:scale-[1.02] md:hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
      >
        <span class="text-xl md:text-2xl font-black text-white tracking-wider uppercase">Mobil</span>
      </button>
    
    </div>
  </div>
</template>