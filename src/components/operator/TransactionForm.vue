<script setup>
import { ref, computed, onMounted, nextTick } from 'vue' // Wajib ada nextTick
import { toast } from 'vue3-toastify'
import { useCameraScanner } from '@/composables/useCameraScanner'

const props = defineProps({
  vehicleType: String,
  loading: Boolean
})

const emit = defineEmits(['submit', 'back'])

// --- LOGIC KAMERA ---
const { isScanning, isProcessing, stream, startCamera, stopCamera, scanPlateNumber } = useCameraScanner()
const videoRef = ref(null)
const isCameraFeatureEnabled = ref(false)

onMounted(() => {
  isCameraFeatureEnabled.value = localStorage.getItem('hj_pref_camera') === 'true'
})

// FUNGSI UTAMA: Membuka Kamera & Memastikan Tampil
const handleStartCamera = async () => {
  // 1. Dapatkan Stream dulu
  const mediaStream = await startCamera()
  
  if (mediaStream) {
    // 2. Tunggu sampai Vue selesai merender elemen <video> (karena ada di dalam v-if)
    await nextTick() 
    
    // 3. Pasang Stream ke Video
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      
      // 4. PAKSA PLAY (PENTING! Solusi layar hitam)
      try {
        await videoRef.value.play()
      } catch (e) {
        console.error("Gagal auto-play video:", e)
      }
    } else {
      toast.error("Error: Element video tidak ditemukan")
    }
  }
}

const handleScan = async () => {
  const result = await scanPlateNumber(videoRef.value)
  if (result) {
    form.value.plat_nomor = result
    toast.success("Plat Terdeteksi: " + result)
  } else {
    toast.warn("Coba lagi, pastikan gambar jelas.")
  }
}
// --------------------

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
  <div class="w-full max-w-lg mx-auto animate-enter relative">
    
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <button @click="$emit('back')" class="text-sm text-green-200 hover:text-white flex items-center gap-2 transition-colors">
        ← Kembali
      </button>
      <span class="px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-white/10 border border-white/20 text-white capitalize">
        {{ vehicleType }}
      </span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
      
      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor Polisi</label>
        
        <div class="flex gap-3 items-stretch">
          <input 
            v-model="form.plat_nomor"
            type="text" 
            placeholder="KT 0000 XX"
            class="flex-1 w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xl font-bold uppercase text-gray-800 focus:outline-none focus:border-[#143d2e] focus:ring-1 focus:ring-[#143d2e] transition-all"
          />
          
          <button 
            v-if="isCameraFeatureEnabled"
            @click.prevent="handleStartCamera" 
            type="button"
            class="w-14 h-14 shrink-0 flex-none bg-[#143d2e] hover:bg-[#1e5c45] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/10 active:scale-95 transition-all"
            title="Scan Plat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </button>
        </div>
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
          <div class="w-full bg-black/20 border border-white/10 rounded-xl md:rounded-2xl px-3 py-3 md:px-4 md:py-3 text-lg md:text-xl font-bold text-green-300 text-center flex items-center justify-center h-[52px] md:h-[56px]">
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

    <div v-if="isScanning" class="fixed inset-0 z-50 bg-black flex flex-col">
      
      <div class="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button @click="stopCamera" class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white z-30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span class="text-white font-bold tracking-widest text-sm drop-shadow-md z-20">SCAN PLAT</span>
        <div class="w-10"></div>
      </div>

      <div class="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        
        <video 
          ref="videoRef" 
          autoplay 
          playsinline 
          muted 
          class="absolute inset-0 w-full h-full object-cover"
        ></video>
        
        <div class="relative w-72 h-40 border-2 border-white/30 rounded-2xl z-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-xl -mt-[2px] -ml-[2px]"></div>
          <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-xl -mt-[2px] -mr-[2px]"></div>
          <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-xl -mb-[2px] -ml-[2px]"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-xl -mb-[2px] -mr-[2px]"></div>
          <div class="absolute top-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-scan"></div>
        </div>
      </div>

      <div class="h-28 bg-black/90 flex items-center justify-center pb-6 pt-2 z-20">
        <button 
          @click.prevent="handleScan" 
          type="button"
          :disabled="isProcessing"
          class="w-16 h-16 rounded-full border-[5px] border-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
        >
          <div v-if="isProcessing" class="w-full h-full rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
          <div v-else class="w-12 h-12 bg-white rounded-full"></div>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}
.animate-scan {
  animation: scan 2s linear infinite;
}
</style>