<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { toast } from 'vue3-toastify'
import { useCameraScanner } from '@/composables/useCameraScanner'
import { useTransactionAction } from '@/composables/useTransactionAction'

const props = defineProps({
  vehicleType: String,
  loading: Boolean
})

const emit = defineEmits(['submit', 'back'])

const { isScanning, isProcessing, stream, startCamera, stopCamera, scanPlateNumber } = useCameraScanner()
const { checkPlateStatus, checkingPlate } = useTransactionAction()

const videoRef = ref(null)
const platInputRef = ref(null)
const literInputRef = ref(null)

const isCameraFeatureEnabled = ref(false)

const subStep = ref('check_plate') // 'check_plate' | 'input_liter'
const showRefueledModal = ref(false)
const refueledInfo = ref(null)

const form = ref({
  plat_nomor: '',
  liter: ''
})

onMounted(() => {
  isCameraFeatureEnabled.value = localStorage.getItem('hj_pref_camera') === 'true'
  nextTick(() => {
    if (platInputRef.value) {
      platInputRef.value.focus()
    }
  })
})

const handleCheckPlate = async () => {
  if (!form.value.plat_nomor || !form.value.plat_nomor.trim()) {
    toast.warn("Mohon masukkan nomor plat kendaraan!")
    return
  }

  const res = await checkPlateStatus(form.value.plat_nomor)
  if (res.success) {
    form.value.plat_nomor = res.plat
    if (res.hasRefueledToday) {
      // JIKA SUDAH MENGISI: Tampilkan Modal Popup Peringatan & JANGAN ke form input liter
      refueledInfo.value = res
      showRefueledModal.value = true
    } else {
      // JIKA BELUM MENGISI: Lanjut ke form input liter
      subStep.value = 'input_liter'
      form.value.liter = ''
      await nextTick()
      if (literInputRef.value) {
        literInputRef.value.focus()
      }
    }
  }
}

const handleResetPlateCheck = () => {
  showRefueledModal.value = false
  refueledInfo.value = null
  form.value.plat_nomor = ''
  subStep.value = 'check_plate'
  emit('back') // Langsung kembali ke halaman pilih Motor atau Mobil
}

const handleBackToPlateCheck = () => {
  subStep.value = 'check_plate'
  nextTick(() => {
    if (platInputRef.value) {
      platInputRef.value.focus()
    }
  })
}

const handleStartCamera = async () => {
  const mediaStream = await startCamera()
  
  if (mediaStream) {
    await nextTick() 
    
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      
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
    await handleCheckPlate()
  } else {
    toast.warn("Coba lagi, pastikan gambar jelas.")
  }
}

const HARGA_PER_LITER = 10000 

const calculatedPrice = computed(() => {
  const liter = parseFloat(form.value.liter) || 0
  return liter * HARGA_PER_LITER
})

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const handleSubmit = () => {
  if (!form.value.liter || parseFloat(form.value.liter) <= 0) {
    toast.warn("Mohon masukkan jumlah liter!")
    return
  }

  emit('submit', {
    plat_nomor: form.value.plat_nomor,
    liter: form.value.liter,
    total_harga: calculatedPrice.value
  })
}
</script>

<template>
  <div class="w-full max-w-lg mx-auto animate-enter relative">
    
    <!-- HEADER BAR (TOMBOL KEMBALI HANYA IKON BESAR) -->
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <button 
        @click="$emit('back')" 
        class="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all shadow-md"
        title="Kembali ke Pilih Kendaraan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <span class="px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-white/10 border border-white/20 text-white capitalize tracking-wide shadow-sm">
        {{ vehicleType }}
      </span>
    </div>

    <!-- TAHAP 1: INPUT & CEK PLAT NOMOR -->
    <div v-if="subStep === 'check_plate'" class="space-y-6 animate-enter">
      <div class="text-center space-y-1">
        <h3 class="text-xl md:text-2xl font-bold text-white">Masukkan Nomor Polisi</h3>
        <p class="text-xs md:text-sm text-green-100/80">Sistem akan mengecek riwayat pengisian di database terlebih dahulu</p>
      </div>

      <div class="space-y-4">
        <div class="flex gap-2 items-stretch">
          <input 
            ref="platInputRef"
            v-model="form.plat_nomor"
            type="text" 
            placeholder="KT 0000 XX"
            @keydown.enter.prevent="handleCheckPlate"
            class="flex-1 w-full h-16 bg-white/10 border-2 border-white/30 rounded-2xl px-4 py-3 text-2xl font-black uppercase tracking-wider text-white text-center placeholder-white/30 focus:outline-none focus:bg-white/20 focus:border-white transition-all shadow-inner"
          />
        </div>

        <div class="flex gap-3">
          <button 
            type="button"
            @click.prevent="handleCheckPlate"
            :disabled="checkingPlate"
            class="flex-1 h-14 bg-white hover:bg-emerald-50 text-[#143d2e] font-black text-base md:text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            <span v-if="checkingPlate" class="loading loading-spinner loading-md"></span>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 text-[#143d2e]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span>CEK PLAT (ENTER)</span>
            </template>
          </button>

          <button 
            v-if="isCameraFeatureEnabled"
            @click.prevent="handleStartCamera" 
            type="button"
            class="w-14 h-14 shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            title="Scan Plat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- TAHAP 2: INPUT LITER & TRANSAKSI (HANYA DITAMPILKAN JIKA BELUM MENGISI) -->
    <form v-else-if="subStep === 'input_liter'" @submit.prevent="handleSubmit" class="space-y-5 animate-enter">
      
      <!-- Info Plat Terverifikasi -->
      <div class="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-xs text-white/70 font-bold uppercase tracking-wider">Plat Terverifikasi</div>
            <div class="text-xl font-black text-white tracking-wide">{{ form.plat_nomor }}</div>
          </div>
        </div>

        <button 
          type="button" 
          @click="handleBackToPlateCheck"
          class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition-all active:scale-95"
        >
          Ubah Plat
        </button>
      </div>

      <!-- Input Liter & Total Harga -->
      <div class="grid grid-cols-2 gap-3 md:gap-4">
        <div class="space-y-1.5">
          <label class="text-green-100 text-xs md:text-sm font-bold ml-1 uppercase">Jumlah Liter</label>
          <input 
            ref="literInputRef"
            v-model="form.liter" 
            type="number" 
            step="0.01" 
            placeholder="0.0" 
            class="w-full bg-white/10 border-2 border-white/30 rounded-2xl px-4 py-3 md:py-4 text-xl md:text-2xl font-black text-white placeholder-white/30 focus:outline-none focus:bg-white/20 focus:border-white text-center"
            required
          />
        </div>
        
        <div class="space-y-1.5">
          <label class="text-green-100 text-xs md:text-sm font-bold ml-1 uppercase">Total (Rp)</label>
          <div class="w-full bg-black/30 border border-white/20 rounded-2xl px-3 py-3 md:py-4 text-lg md:text-xl font-black text-white text-center flex items-center justify-center h-[56px] md:h-[64px]">
            {{ formatRupiah(calculatedPrice) }}
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="loading || !form.liter"
        class="w-full bg-white hover:bg-emerald-50 text-[#143d2e] font-black text-lg md:text-xl py-4 rounded-2xl shadow-xl transform active:scale-95 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="loading loading-spinner loading-md"></span>
        <span v-else>PROSES TRANSAKSI</span>
      </button>
    </form>

    <!-- MODAL POPUP KENDARAAN SUDAH MENGISI (PALET HIJAU & PUTIH) -->
    <Teleport to="body">
      <div v-if="showRefueledModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-enter">
        <div class="bg-gradient-to-br from-[#143d2e] via-[#1e5c45] to-[#143d2e] border-2 border-white/30 rounded-[2rem] md:rounded-[2.5rem] max-w-md w-full p-6 md:p-8 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center text-center relative overflow-hidden">
          
          <!-- Background Glow Elements (Hijau / Putih) -->
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Icon Badge (Putih & Transparan) -->
          <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/10 border-2 border-white/30 flex items-center justify-center text-white mb-4 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 md:w-12 md:h-12 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <!-- Modal Header -->
          <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-white/10 border border-white/20 text-white uppercase tracking-widest mb-2">
            Peringatan Pengisian Ganda
          </span>
          <h3 class="text-2xl md:text-3xl font-black text-white tracking-tight">
            KENDARAAN SUDAH MENGISI!
          </h3>
          <p class="text-xs md:text-sm text-white/80 mt-1 mb-5 leading-relaxed">
            Sistem mendeteksi transaksi pengisian BBM untuk kendaraan ini pada hari yang sama. Transaksi ditolak.
          </p>

          <!-- Details Card (Hijau & Putih) -->
          <div class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-5 text-left space-y-3 shadow-inner mb-6">
            <div class="flex justify-between items-center border-b border-white/15 pb-2.5">
              <span class="text-xs font-medium text-white/70">Nomor Polisi</span>
              <span class="text-xl font-black text-white tracking-wider">{{ refueledInfo?.plat }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-white/15 pb-2.5">
              <span class="text-xs font-medium text-white/70">Pengisian Hari Ini</span>
              <span class="text-sm font-bold text-white">{{ refueledInfo?.countToday }} Kali</span>
            </div>
            <div class="flex justify-between items-center border-b border-white/15 pb-2.5">
              <span class="text-xs font-medium text-white/70">Pengisian Terakhir</span>
              <span class="text-sm font-bold text-white">{{ refueledInfo?.lastTransaction?.liter }} Liter (Rp {{ formatRupiah(refueledInfo?.lastTransaction?.harga) }})</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-white/70">Waktu Terakhir</span>
              <span class="text-sm font-bold text-white">{{ refueledInfo?.timeFormatted }} WITA</span>
            </div>
          </div>

          <!-- Action Button (Putih Solid dengan Teks Hijau Gelap) -->
          <button 
            @click="handleResetPlateCheck"
            class="w-full bg-white hover:bg-emerald-50 text-[#143d2e] font-black text-base md:text-lg py-4 rounded-2xl shadow-xl hover:shadow-white/20 transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-[#143d2e]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>PILIH KENDARAAN LAIN</span>
          </button>

        </div>
      </div>
    </Teleport>

    <!-- CAMERA SCANNER MODAL (TELEPORT DILUAR FORM) -->
    <Teleport to="body">
      <div v-if="isScanning" class="fixed inset-0 z-[9999] bg-black flex flex-col">
        
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
    </Teleport>

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