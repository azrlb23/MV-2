<script setup>
import { usePresence } from '@/composables/usePresence'

defineProps({
  members: Array,
  loading: Boolean
})

// Menggunakan logic real-time dari composable
const { onlineUserIds } = usePresence()

const getRoleBadge = (role) => {
  if (!role) return 'bg-gray-100 text-gray-600 border-gray-200'
  return role.toLowerCase() === 'manajer' 
    ? 'bg-purple-100 text-purple-700 border-purple-200' 
    : 'bg-blue-100 text-blue-700 border-blue-200'
}

// Cek apakah user ID ada di daftar online
const isUserOnline = (userId) => {
  return onlineUserIds.value.has(userId)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Belum pernah login'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="w-full">
    
    <div class="block md:hidden space-y-3 p-3">
      
      <div v-if="loading" class="py-10 text-center">
        <span class="loading loading-dots loading-md text-gray-400"></span>
      </div>

      <div v-else-if="members.length === 0" class="py-10 text-center text-gray-400 italic">
        Tidak ada data tim.
      </div>

      <div 
        v-else
        v-for="member in members" 
        :key="member.id" 
        class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3 relative overflow-hidden"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5" 
             :class="member.role === 'manajer' ? 'bg-purple-500' : 'bg-blue-500'">
        </div>

        <div class="flex items-center gap-3 pl-2">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200 text-sm">
            {{ member.email?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-gray-900 truncate text-sm">{{ member.email?.split('@')[0] }}</p>
            <p class="text-xs text-gray-500 truncate">{{ member.email }}</p>
          </div>
          
          <div class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
            <span 
              class="w-2 h-2 rounded-full transition-all duration-300" 
              :class="isUserOnline(member.id) ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-gray-300'"
            ></span>
            <span 
              class="text-[10px] font-bold uppercase transition-colors"
              :class="isUserOnline(member.id) ? 'text-green-700' : 'text-gray-400'"
            >
              {{ isUserOnline(member.id) ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>

        <div class="h-px bg-gray-100 w-full ml-2"></div>

        <div class="flex justify-between items-center pl-2">
          <span 
            class="px-2.5 py-1 rounded-lg text-xs font-bold border capitalize"
            :class="getRoleBadge(member.role)"
          >
            {{ member.role || 'No Role' }}
          </span>
          
          <div class="text-right">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last Login</p>
            <p class="text-xs text-gray-700 font-mono">{{ formatDate(member.last_sign_in_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr class="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
            <th class="py-4 pl-6 font-bold">User / Email</th>
            <th class="py-4 font-bold">Role Access</th>
            <th class="py-4 font-bold">Status</th>
            <th class="py-4 pr-6 font-bold text-right">Terakhir Login</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-gray-100 bg-white">
          <tr v-if="loading">
            <td colspan="4" class="py-8 text-center text-gray-400">
              <span class="loading loading-dots loading-md"></span>
            </td>
          </tr>
          
          <tr v-else-if="members.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-400 italic">
              Tidak ada data tim ditemukan.
            </td>
          </tr>

          <tr 
            v-for="member in members" 
            :key="member.id" 
            class="hover:bg-gray-50 transition-colors group"
          >
            <td class="py-4 pl-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 border border-gray-200 shrink-0">
                  {{ member.email?.charAt(0).toUpperCase() || '?' }}
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-900 truncate">{{ member.email?.split('@')[0] }}</p>
                  <p class="text-xs text-gray-400 font-medium truncate">{{ member.email }}</p>
                </div>
              </div>
            </td>
            
            <td class="py-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold border capitalize"
                :class="getRoleBadge(member.role)"
              >
                {{ member.role || 'No Role' }}
              </span>
            </td>

            <td class="py-4">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2.5 h-2.5 rounded-full transition-all duration-300" 
                  :class="isUserOnline(member.id) ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-gray-300'"
                ></span>
                <span 
                  class="font-medium capitalize text-xs transition-colors"
                  :class="isUserOnline(member.id) ? 'text-green-700 font-bold' : 'text-gray-400'"
                >
                  {{ isUserOnline(member.id) ? 'Online' : 'Offline' }}
                </span>
              </div>
            </td>

            <td class="py-4 pr-6 text-right text-gray-500 font-mono text-xs">
              {{ formatDate(member.last_sign_in_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>