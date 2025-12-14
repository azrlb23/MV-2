<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue' // Import Layout di sini

const authStore = useAuthStore()
const route = useRoute()

// Deteksi apakah halaman ini butuh AdminLayout
const layout = computed(() => route.meta.layout || 'auth')

onMounted(() => {
  authStore.initialize()
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

  <RouterView v-else v-slot="{ Component }">
    <Transition name="content" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>