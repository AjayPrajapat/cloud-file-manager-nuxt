<template>
  <div
    class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center transition hover:border-primary-400 dark:border-slate-700 dark:bg-slate-900/60"
    :class="{ 'border-primary-500 bg-primary-50/50 dark:border-primary-500/60': isDragging }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="flex flex-col items-center gap-3">
      <svg class="h-12 w-12 text-primary-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V3.75m0 0L8.25 7.5M12 3.75l3.75 3.75" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 9v9.75a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25V9" />
      </svg>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Drag & drop files here or
        <button class="font-semibold text-primary-600 hover:underline" @click.prevent="openFileDialog">browse</button>
      </p>
      <p class="text-xs text-slate-400">Supports PDF, images, markdown up to 25MB each.</p>
    </div>
    <input ref="fileInput" class="hidden" type="file" :multiple="multiple" @change="onFileChange" />
    <div v-if="progressValue > 0" class="mt-6 w-full">
      <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Uploading...</span>
        <span>{{ progressValue }}%</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div class="h-full rounded-full bg-primary-500 transition-all" :style="{ width: `${progressValue}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ multiple?: boolean; progress?: number }>()
const emit = defineEmits<{ (event: 'files-selected', files: FileList): void }>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const progressValue = computed(() => props.progress ?? 0)

function onDragEnter() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  if (event.dataTransfer?.files?.length) {
    emit('files-selected', event.dataTransfer.files)
    isDragging.value = false
  }
}

function openFileDialog() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    emit('files-selected', target.files)
    target.value = ''
  }
}
</script>
