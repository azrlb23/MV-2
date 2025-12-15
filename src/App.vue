<script setup>
import { onMounted, onUnmounted, computed, watch } from 'vue' // Tambahkan onUnmounted & watch
import { useAuthStore } from '@/stores/auth'
import { usePresence } from '@/composables/usePresence' // Import Presence
import { useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import OperatorLayout from '@/layouts/OperatorLayout.vue'

const authStore = useAuthStore()
const { initPresence, leavePresence } = usePresence() // Gunakan Presence
const route = useRoute()

const layout = computed(() => route.meta.layout || 'auth')

onMounted(async () => {
  await authStore.initialize()
  // Jika user sudah login saat refresh, langsung init presence
  if (authStore.user) {
    initPresence()
  }
})

// Pantau perubahan user (Login/Logout)
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    initPresence() // User login -> Lapor Online
  } else {
    leavePresence() // User logout -> Lapor Offline
  }
})

// Cleanup saat window ditutup
onUnmounted(() => {
  leavePresence()
})
</script>

<template>
  <AdminLayout v-if="layout === 'admin'">
    <RouterView v-slot="{ Component }">
      <Transition name="content" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </AdminLayout>

  <OperatorLayout v-else-if="layout === 'operator'">
    <RouterView v-slot="{ Component }">
      <Transition name="content" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </OperatorLayout>

  <RouterView v-else v-slot="{ Component }">
    <Transition name="content" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>