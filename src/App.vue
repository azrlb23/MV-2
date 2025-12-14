<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import OperatorLayout from '@/layouts/OperatorLayout.vue' // Import Layout Baru

const authStore = useAuthStore()
const route = useRoute()

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