<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  vehicleType: String,
  loading: Boolean
})

const emit = defineEmits(['submit', 'back'])

const form = ref({
  plat_nomor: '',
  liter: ''
})


const HARGA_PER_LITER = 10000

const calculatedPrice = computed(() => {
  const liter = parseFloat(form.value.liter) || 0
  return liter * HARGA_PER_LITER
})

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const handleSubmit = () => {
  emit('submit', {
    plat_nomor: form.value.plat_nomor,
    liter: form.value.liter,
    total_harga: calculatedPrice.value
  })
}
</script>

<template>
  <div class="w-full max-w-lg mx-auto animate-enter">
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <button @click="$emit('back')" class="text-sm text-green-200 hover:text-white flex items-center gap-2 transition-colors">
        ← Kembali
      </button>
      <span class="px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-white/10 border border-white/20 text-white">
        {{ vehicleType }}
      </span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
      <div class="space-y-1 md:space-y-2">
        <label class="text-green-100 text-xs md:text-sm font-bold ml-1">PLAT NOMOR</label>
        <input 
          v-model="form.plat_nomor" 
          type="text" 
          placeholder="KT 1234 ABC" 
          class="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xl md:text-2xl font-mono text-white placeholder-white/30 focus:outline-none focus:bg-white/20 focus:border-green-400 uppercase transition-all text-center tracking-widest"
          required
          autofocus
        />
      </div>

      <div class="grid grid-cols-2 gap-3 md:gap-4">
        <div class="space-y-1 md:space-y-2">
          <label class="text-green-100 text-xs md:text-sm font-bold ml-1">LITER</label>
          <input 
            v-model="form.liter" 
            type="number" 
            step="0.01" 
            placeholder="0.0" 
            class="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-3 py-3 md:px-4 md:py-3 text-lg md:text-xl font-bold text-white placeholder-white/30 focus:outline-none focus:bg-white/20 focus:border-green-400 text-center"
            required
          />
        </div>
        
        <div class="space-y-1 md:space-y-2 opacity-80">
          <label class="text-green-100 text-xs md:text-sm font-bold ml-1">TOTAL (Rp)</label>
          <div class="w-full bg-black/20 border border-white/10 rounded-xl md:rounded-2xl px-3 py-3 md:px-4 md:py-3 text-lg md:text-xl font-bold text-green-300 text-center flex items-center justify-center h-[52px] md:h-[54px]">
            {{ formatRupiah(calculatedPrice) }}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-emerald-900 font-black text-lg md:text-xl py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg transform active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="loading loading-spinner loading-md"></span>
        <span v-else>PROSES TRANSAKSI</span>
      </button>
    </form>
  </div>
</template>