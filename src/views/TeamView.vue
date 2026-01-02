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
      
      
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
      <TeamTable :members="teamMembers" :loading="loading" />
    </div>

  </div>
</template>