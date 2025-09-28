<template>
  <form class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60" @submit.prevent="submit">
    <div class="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
      <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.64 5.64a7.5 7.5 0 0010.61 10.61z" />
      </svg>
      <input v-model="model.search" class="flex-1 bg-transparent text-sm outline-none" placeholder="Search files" type="search" />
    </div>
    <select v-model="model.type" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <option value="">All types</option>
      <option value="pdf">PDF</option>
      <option value="image">Images</option>
      <option value="markdown">Markdown</option>
    </select>
    <select v-model="model.tag" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <option value="">All tags</option>
      <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
    </select>
    <button type="submit" class="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-600">
      Filter
    </button>
  </form>
</template>

<script setup lang="ts">
import type { TagItem } from '~/server/types'

const props = defineProps<{ modelValue: { search: string; type: string; tag: string }; tags: TagItem[] }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: typeof props.modelValue): void; (event: 'filter'): void }>()

const model = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  value => {
    Object.assign(model, value)
  }
)

watch(model, value => emit('update:modelValue', { ...value }))

function submit() {
  emit('filter')
}
</script>
