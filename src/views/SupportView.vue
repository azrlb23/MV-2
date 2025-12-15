<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  kategori: 'Bug Sistem',
  prioritas: 'Medium',
  subjek: '',
  deskripsi: ''
})

const userEmail = computed(() => authStore.user?.email || '')

const handleSubmit = async () => {
  if (!form.value.subjek || !form.value.deskripsi) {
    toast.warn("Mohon lengkapi subjek dan deskripsi laporan.")
    return
  }

  loading.value = true

  try {
    const { error } = await supabase.from('support_tickets').insert({
      user_id: authStore.user.id,
      kategori: form.value.kategori,
      prioritas: form.value.prioritas,
      subjek: form.value.subjek,
      deskripsi: form.value.deskripsi,
      status: 'Open'
    })

    if (error) throw error

    toast.success("Laporan berhasil dikirim ke Tim IT!")
    
    // Reset Form
    form.value = {
      kategori: 'Bug Sistem',
      prioritas: 'Medium',
      subjek: '',
      deskripsi: ''
    }

  } catch (err) {
    console.error(err)
    toast.error("Gagal mengirim laporan: " + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 animate-enter pb-10">
    
    <div>
      <h2 class="text-3xl font-extrabold text-black tracking-tight">Pusat Bantuan IT</h2>
      <p class="text-gray-500 text-sm">Laporkan kendala sistem atau ajukan permintaan fitur baru.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <div class="lg:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>

        <form @submit.prevent="handleSubmit" class="relative z-10 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
              <div class="relative">
                <select v-model="form.kategori" class="w-full bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                  <option>Bug Sistem</option>
                  <option>Request Fitur</option>
                  <option>Masalah Akun</option>
                  <option>Masalah Hardware</option>
                  <option>Lainnya</option>
                </select>
                <div class="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Prioritas</label>
              <div class="flex gap-2">
                <button type="button" @click="form.prioritas = 'Low'" 
                  class="flex-1 py-3 rounded-xl text-sm font-bold border transition-all"
                  :class="form.prioritas === 'Low' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'">
                  Low
                </button>
                <button type="button" @click="form.prioritas = 'Medium'" 
                  class="flex-1 py-3 rounded-xl text-sm font-bold border transition-all"
                  :class="form.prioritas === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'">
                  Normal
                </button>
                <button type="button" @click="form.prioritas = 'High'" 
                  class="flex-1 py-3 rounded-xl text-sm font-bold border transition-all"
                  :class="form.prioritas === 'High' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'">
                  Urgent
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subjek Masalah</label>
            <input 
              v-model="form.subjek" 
              type="text" 
              placeholder="Contoh: Tidak bisa export data excel" 
              class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder-gray-400"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Deskripsi Detail</label>
            <textarea 
              v-model="form.deskripsi" 
              rows="5"
              placeholder="Jelaskan kronologi masalah atau detail fitur yang diinginkan..." 
              class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder-gray-400 resize-none"
            ></textarea>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full bg-[#143d2e] hover:bg-[#0f2e23] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Kirim Laporan
              </span>
            </button>
          </div>

        </form>
      </div>

      <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-[2rem] p-8 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
        
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          Kontak Darurat
        </h3>
        
        <div class="space-y-6 text-green-50 text-sm leading-relaxed">
          <p>
            Untuk kendala kritis yang menyebabkan operasional SPBU berhenti total, silakan hubungi langsung via WhatsApp.
          </p>
          
          <div class="bg-white/10 rounded-xl p-4 border border-white/10">
            <p class="text-[10px] font-bold uppercase tracking-widest text-green-300 mb-1">IT Support Head</p>
            <p class="text-lg font-bold">Pak Budi Santoso</p>
            <p class="font-mono mt-1 opacity-90">+62 812-3456-7890</p>
          </div>

          <div class="pt-4 border-t border-white/10">
            <p class="text-xs opacity-70 mb-2">Logged in as:</p>
            <p class="font-bold truncate">{{ userEmail }}</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>