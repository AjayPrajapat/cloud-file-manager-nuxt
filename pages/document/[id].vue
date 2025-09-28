<template>
  <div v-if="file" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ file.name }}</h1>
        <p class="text-sm text-slate-500">Preview the document, review AI metadata, and access version history.</p>
      </div>
      <NuxtLink class="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:border-primary-400 hover:text-primary-500 dark:border-slate-700" to="/dashboard">
        Back to dashboard
      </NuxtLink>
    </div>
    <DocumentPreview :file="file" />
  </div>
  <div v-else class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
    {{ statusMessage }}
  </div>
</template>

<script setup lang="ts">
import type { FileItem } from '~/server/types'

const route = useRoute()
const file = ref<FileItem | null>(null)
const statusMessage = ref('Loading document...')

onMounted(async () => {
  const { data, error } = await useFetch('/api/files', {
    params: { id: route.params.id },
    transform: (payload: any) => payload?.data ?? []
  })
  if (error.value) {
    statusMessage.value = error.value.statusMessage ?? 'Failed to load document'
    return
  }
  const list = data.value as FileItem[]
  file.value = list[0] ?? null
  statusMessage.value = file.value ? 'Loading document...' : 'Document not found'
})
</script>
