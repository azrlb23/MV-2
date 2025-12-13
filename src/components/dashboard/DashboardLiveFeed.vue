<script setup>
import { defineProps } from 'vue'

// Props: Menerima array transaksi dari Supabase (via Parent)
const props = defineProps({
  items: {
    type: Array,
    default: () => [] 
  }
})

// Fungsi Helper: Mengubah tanggal menjadi "x hours ago"
const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    return `${diffInMinutes} mins ago`
  }
  return `${diffInHours} hours ago`
}
</script>

<template>
  <div class="bg-gradient-to-br from-[#143d2e] to-[#1e5c45] rounded-[2rem] p-6 md:p-8 text-white shadow-lg lg:col-span-1 h-full">
    <h4 class="font-bold text-lg mb-6">live transaction</h4>
    
    <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      
      <div 
        v-for="(item, index) in items" 
        :key="item.id || index" 
        class="flex justify-between items-center border-b border-white/10 pb-3 last:border-0"
      >
        <div>
          <p class="font-mono font-bold text-lg">
            {{ item.plat_nomor || 'Unknown' }}
          </p>
          
          <p class="text-xs text-green-200/70">
            {{ item.fuel_type }} • {{ item.liter }}L
          </p>
        </div>
        
        <span class="text-xs font-medium opacity-50">
          {{ formatTimeAgo(item.created_at) }}
        </span>
      </div>

      <div v-if="items.length === 0" class="text-center py-4 opacity-50 text-sm">
        Belum ada data transaksi
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 10px; }
</style>