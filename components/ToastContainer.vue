<template>
  <transition-group name="toast" tag="div" class="fixed right-6 top-20 z-50 flex w-80 flex-col gap-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition',
        toast.type === 'success'
          ? 'border-green-200 bg-green-50/90 text-green-800 dark:border-green-900/40 dark:bg-green-900/40 dark:text-green-200'
          : 'border-red-200 bg-red-50/90 text-red-800 dark:border-red-900/40 dark:bg-red-900/40 dark:text-red-200'
      ]"
    >
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-medium">{{ toast.message }}</p>
        <button class="text-xs uppercase tracking-wide" @click="dismiss(toast.id)">Close</button>
      </div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
