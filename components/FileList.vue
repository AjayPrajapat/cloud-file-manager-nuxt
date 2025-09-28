<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Documents</h2>
      <div class="text-xs text-slate-500">{{ pagination.total }} files • page {{ pagination.page }}</div>
    </div>
    <div v-if="loading" class="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-10 text-slate-500 dark:border-slate-700">
      <svg class="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
        <path class="opacity-75" stroke-width="4" d="M4 12a8 8 0 018-8"></path>
      </svg>
      <span class="ml-3 text-sm">Loading files...</span>
    </div>
    <div v-else>
      <div v-if="files.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FileCard
          v-for="file in files"
          :key="file.id"
          :file="file"
          :tags="tags"
          :selected="selected.has(file.id)"
          @toggle="id => $emit('toggle', id)"
        />
      </div>
      <div v-else class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
        No files found in this folder.
      </div>
      <div class="mt-6 flex items-center justify-between text-sm text-slate-500">
        <button
          class="rounded-full border border-slate-300 px-4 py-2 transition hover:border-primary-400 hover:text-primary-500 dark:border-slate-700"
          :disabled="pagination.page === 1"
          @click="$emit('change-page', pagination.page - 1)"
        >
          Previous
        </button>
        <div>Page {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.pageSize) || 1 }}</div>
        <button
          class="rounded-full border border-slate-300 px-4 py-2 transition hover:border-primary-400 hover:text-primary-500 dark:border-slate-700"
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
          @click="$emit('change-page', pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileItem, TagItem } from '~/server/types'

defineProps<{ files: FileItem[]; tags: TagItem[]; pagination: { page: number; pageSize: number; total: number }; loading: boolean; selected: Set<string> }>()

defineEmits<{ (event: 'toggle', id: string): void; (event: 'change-page', page: number): void }>()
</script>
