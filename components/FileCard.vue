<template>
  <div
    class="group relative flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
    :class="{ 'ring-2 ring-primary-400': selected }"
    @click="toggle"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200/70 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
        <component :is="icon" class="h-7 w-7" />
      </div>
      <button
        class="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-slate-500 opacity-0 transition hover:border-slate-300 group-hover:opacity-100"
        @click.stop="download"
      >
        Download
      </button>
    </div>
    <div class="mt-4 space-y-2">
      <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ file.name }}</p>
      <p class="text-xs text-slate-500 dark:text-slate-400">{{ file.type }} · {{ formattedSize }}</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in file.tags"
          :key="tag"
          class="rounded-full bg-primary-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
        >
          {{ tagLabel(tag) }}
        </span>
      </div>
    </div>
    <div v-if="selected" class="absolute inset-0 rounded-2xl border-2 border-primary-400"></div>
  </div>
</template>

<script setup lang="tsx">
import type { FileItem, TagItem } from '~/server/types'

const props = defineProps<{
  file: FileItem
  tags?: TagItem[]
  selected?: boolean
}>()

const emit = defineEmits(['toggle'])

const icon = computed(() => {
  if (props.file.type.includes('pdf')) {
    return PdfIcon
  }
  if (props.file.type.includes('image')) {
    return ImageIcon
  }
  if (props.file.type.includes('markdown') || props.file.type.includes('text')) {
    return TextIcon
  }
  return DocumentIcon
})

const formattedSize = computed(() => {
  const size = props.file.size ?? 0
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(1)} ${units[i]}`
})

function toggle() {
  emit('toggle', props.file.id)
}

function tagLabel(id: string) {
  return props.tags?.find(tag => tag.id === id)?.name ?? id
}

async function download() {
  if (props.file.storage?.url) {
    window.open(props.file.storage.url, '_blank')
  }
}
</script>

<script lang="tsx">
import { defineComponent } from 'vue'

const baseIcon = (path: string) =>
  defineComponent({
    name: 'FileIcon',
    setup() {
      return () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={path}></path>
        </svg>
      )
    }
  })

const PdfIcon = baseIcon('M12 21V3m0 0l-3 3m3-3l3 3M6 9v9a3 3 0 003 3h6a3 3 0 003-3V9')
const ImageIcon = baseIcon('M3 16l5-5 4 4 6-6 3 3v5a3 3 0 01-3 3H6a3 3 0 01-3-3z')
const TextIcon = baseIcon('M4.5 6.75h15M4.5 12h9m-9 5.25h15')
const DocumentIcon = baseIcon('M6 2.25h7.5L19.5 8.25V21a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75z')

export default {}
</script>
