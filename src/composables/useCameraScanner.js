import { ref, onUnmounted } from 'vue'
import { toast } from 'vue3-toastify'
import Tesseract from 'tesseract.js'

export function useCameraScanner() {
  const isScanning = ref(false)
  const isProcessing = ref(false)
  const stream = ref(null)

  // Fungsi Start Camera yang "Kebal" Error
  const startCamera = async () => {
    isScanning.value = true
    
    // Matikan stream lama jika ada (Reset)
    if (stream.value) {
      stream.value.getTracks().forEach(t => t.stop())
    }

    try {
      // PERCOBAAN 1: Kamera Belakang (HP)
      try {
        stream.value = await navigator.mediaDevices.getUserMedia({ 
          audio: false, 
          video: { facingMode: { exact: "environment" } } 
        })
      } catch (err) {
        // PERCOBAAN 2: Fallback ke Kamera Apapun (Laptop/Webcam Standar)
        console.warn("Gagal akses kamera belakang, mencoba kamera standar...", err)
        stream.value = await navigator.mediaDevices.getUserMedia({ 
          audio: false, 
          video: true // Minta video apa saja yang ada
        })
      }

      return stream.value

    } catch (err) {
      console.error("Camera Fatal Error:", err)
      isScanning.value = false // Matikan mode scan jika gagal total
      
      // Pesan Error Manusiawi
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        toast.error("Izin kamera ditolak browser!")
      } else if (err.name === 'NotFoundError') {
        toast.error("Perangkat kamera tidak ditemukan!")
      } else {
        toast.error("Gagal buka kamera: " + err.message)
      }
      return null
    }
  }

  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    isScanning.value = false
    isProcessing.value = false
  }

  const validateAndFormat = (rawText) => {
    // 1. Bersihkan: Hapus semua simbol, spasi, dan paksa huruf besar
    // Contoh: "kt- 5476.. hj" -> "KT5476HJ"
    const clean = rawText.replace(/[^A-Z0-9]/gi, '').toUpperCase()

    // 2. REGEX (Pola) Plat Nomor Indonesia
    // ^[A-Z]{1,2}  : Awalan 1-2 Huruf (Kode Wilayah, misal KT, B, DA)
    // \d{1,4}      : Tengah 1-4 Angka (Nomor, misal 1234)
    // [A-Z]{1,3}$  : Akhiran 1-3 Huruf (Seri Belakang, misal AB, XYZ)
    const platePattern = /^([A-Z]{1,2})(\d{1,4})([A-Z]{1,3})$/

    // 3. Cek apakah cocok?
    const match = clean.match(platePattern)

    if (match) {
      // Jika COCOK, format jadi cantik: "KT 5476 HJ"
      // match[1] = KT, match[2] = 5476, match[3] = HJ
      return `${match[1]} ${match[2]} ${match[3]}`
    }

    // Jika TIDAK COCOK (misal: "XJ88" atau "ASPHALT"), kembalikan null
    return null
  }

  const scanPlateNumber = async (videoElement) => {
    if (!videoElement) return null
    isProcessing.value = true
    
    // Capture Image
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElement, 0, 0)
    
    try {
      const { data: { text } } = await Tesseract.recognize(canvas, 'eng', { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' })
      
      // Cleanup Text
      const cleanText = text.replace(/[^A-Z0-9]/gi, '').toUpperCase()
      
      isProcessing.value = false
      stopCamera() // Tutup kamera jika berhasil
      return cleanText
      
    } catch (err) {
      console.error(err)
      isProcessing.value = false
      toast.error("Gagal membaca teks")
      return null
    }
  }

  onUnmounted(() => {
    stopCamera()
  })

  return {
    isScanning,
    isProcessing,
    stream,
    startCamera,
    stopCamera,
    scanPlateNumber
  }
}