<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <component :is="viewer" :file="file" />
    </div>
    <aside class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Metadata</h3>
        <dl class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div class="flex justify-between"><dt>File name</dt><dd class="font-medium text-slate-800 dark:text-white">{{ file.name }}</dd></div>
          <div class="flex justify-between"><dt>Type</dt><dd>{{ file.type }}</dd></div>
          <div class="flex justify-between"><dt>Size</dt><dd>{{ formattedSize }}</dd></div>
          <div class="flex justify-between"><dt>Uploaded</dt><dd>{{ formatDate(file.createdAt) }}</dd></div>
          <div class="flex justify-between"><dt>Owner</dt><dd>{{ file.ownerId }}</dd></div>
        </dl>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">AI Insights</h3>
        <p v-if="file.metadata.aiSummary" class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ file.metadata.aiSummary }}</p>
        <div v-if="file.metadata.aiTags?.length" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="tag in file.metadata.aiTags"
            :key="tag"
            class="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
      <div v-if="file.versions.length" class="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Version history</h3>
        <ul class="mt-3 space-y-3 text-sm">
          <li v-for="version in file.versions" :key="version.id" class="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-700 dark:text-slate-200">v{{ version.version }}</span>
              <span class="text-xs text-slate-400">{{ formatDate(version.createdAt) }}</span>
            </div>
            <p v-if="version.metadata.summary" class="mt-1 text-xs text-slate-500">{{ version.metadata.summary }}</p>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { FileItem } from '~/server/types'

const props = defineProps<{ file: FileItem }>()

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

const viewer = computed(() => {
  if (props.file.type.includes('pdf')) {
    return PdfViewer
  }
  if (props.file.type.includes('image')) {
    return ImageViewer
  }
  if (props.file.type.includes('markdown') || props.file.type.includes('text')) {
    return MarkdownViewer
  }
  return FallbackViewer
})

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}
</script>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import type { FileItem } from '~/server/types'

export default {}

const md = new MarkdownIt({ html: true, linkify: true })

export const PdfViewer = defineComponent({
  name: 'PdfViewer',
  props: {
    file: { type: Object as () => FileItem, required: true }
  },
  setup(props) {
    return () => (
      <iframe
        class="h-[70vh] w-full rounded-xl border border-slate-200"
        src={`${props.file.storage?.url ?? ''}#toolbar=0`}
        title="PDF preview"
      ></iframe>
    )
  }
})

export const ImageViewer = defineComponent({
  name: 'ImageViewer',
  props: {
    file: { type: Object as () => FileItem, required: true }
  },
  setup(props) {
    return () => (
      <img class="h-[70vh] w-full rounded-xl object-contain" src={props.file.storage?.url ?? props.file.thumbnailUrl} alt={props.file.name} />
    )
  }
})

export const MarkdownViewer = defineComponent({
  name: 'MarkdownViewer',
  props: {
    file: { type: Object as () => FileItem, required: true }
  },
  setup(props) {
    const content = ref('Loading markdown...')

    if (props.file.storage?.url) {
      fetch(props.file.storage.url)
        .then(response => response.text())
        .then(text => {
          content.value = md.render(text)
        })
        .catch(() => {
          content.value = 'Failed to load markdown content.'
        })
    }

    return () => <div class="prose max-w-none dark:prose-invert" innerHTML={content.value}></div>
  }
})

export const FallbackViewer = defineComponent({
  name: 'FallbackViewer',
  props: {
    file: { type: Object as () => FileItem, required: true }
  },
  setup(props) {
    return () => (
      <div class="flex h-[70vh] flex-col items-center justify-center gap-3 text-slate-500">
        <span class="text-4xl">📄</span>
        <p class="text-sm">Preview not available for {props.file.type}</p>
        {props.file.storage?.url ? (
          <a
            class="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
            href={props.file.storage.url}
            target="_blank"
          >
            Download
          </a>
        ) : null}
      </div>
    )
  }
})
</script>
