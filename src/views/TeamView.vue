<script setup>
import { useTeam } from '@/composables/useTeam'
import TeamTable from '@/components/team/TeamTable.vue'

const { teamMembers, loading } = useTeam()
</script>

<template>
  <div class="flex flex-col h-full gap-6 animate-enter overflow-hidden pb-4">
    
    <div class="flex-none px-1 flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-extrabold text-black tracking-tight mb-1">Team Management</h2>
        <p class="text-gray-500 text-sm">Daftar akun yang memiliki akses ke sistem Habi Jaya.</p>
      </div>
      
      <button class="bg-[#143d2e] hover:bg-[#0f2e23] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/10 flex items-center gap-2 transition-all active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add User
      </button>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
      <TeamTable :members="teamMembers" :loading="loading" />
    </div>

  </div>
</template>