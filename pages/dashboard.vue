<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p class="text-sm text-slate-500">Manage folders, files, and AI metadata.</p>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink class="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:border-primary-400 hover:text-primary-500 dark:border-slate-700" to="/document/file-001">
          Open sample document
        </NuxtLink>
        <button class="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-primary-400 hover:text-primary-500 dark:border-slate-700" @click="logout">
          Logout
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div class="space-y-6">
        <FolderTree v-model="fileStore.currentFolderId" :tree="fileStore.folderTree" @update:model-value="refreshFiles" />
        <div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Upload files</h3>
          <FileUpload :progress="uploadProgress" :multiple="true" @files-selected="onFilesSelected" />
        </div>
      </div>
      <div class="space-y-6">
        <SearchBar v-model="filters" :tags="fileStore.tags" @filter="refreshFiles" />
        <div class="flex items-center justify-between text-sm text-slate-500">
          <div>
            <span v-if="fileStore.selected.size">{{ fileStore.selected.size }} selected</span>
          </div>
          <div class="flex gap-2">
            <button
              class="rounded-full border border-slate-300 px-3 py-1 text-xs uppercase tracking-wide hover:border-primary-400 hover:text-primary-500 dark:border-slate-700"
              :disabled="!fileStore.selected.size"
              @click="downloadSelected"
            >
              Download
            </button>
            <button
              class="rounded-full border border-red-300 px-3 py-1 text-xs uppercase tracking-wide text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!fileStore.selected.size"
              @click="deleteSelected"
            >
              Delete
            </button>
          </div>
        </div>
        <FileList
          :files="fileStore.files"
          :tags="fileStore.tags"
          :pagination="fileStore.pagination"
          :loading="fileStore.loading"
          :selected="fileStore.selected"
          @toggle="fileStore.toggleSelection"
          @change-page="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const fileStore = useFileStore()

const filters = reactive({ search: '', type: '', tag: '' })
const uploadProgress = ref(0)

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  await Promise.all([fileStore.fetchFolders(), fileStore.fetchTags()])
  await refreshFiles()
})

watch(
  () => fileStore.currentFolderId,
  async () => {
    await refreshFiles()
  }
)

async function refreshFiles() {
  fileStore.pagination.page = 1
  await fileStore.fetchFiles(filters)
}

function changePage(page: number) {
  fileStore.pagination.page = page
  fileStore.fetchFiles(filters)
}

async function onFilesSelected(files: FileList) {
  if (!files.length) {
    return
  }
  const formData = new FormData()
  Array.from(files).forEach(file => {
    formData.append('file', file)
  })
  formData.append('folderId', fileStore.currentFolderId)
  try {
    uploadProgress.value = 20
    await fileStore.uploadFiles(formData)
    uploadProgress.value = 100
    toast.push('Files uploaded successfully', 'success')
    setTimeout(() => (uploadProgress.value = 0), 800)
  } catch (error: any) {
    uploadProgress.value = 0
    toast.push(error?.data?.statusMessage ?? 'Upload failed', 'error')
  }
}

async function deleteSelected() {
  try {
    await fileStore.deleteSelected()
    toast.push('Files deleted', 'success')
  } catch (error: any) {
    toast.push(error?.data?.statusMessage ?? 'Failed to delete files', 'error')
  }
}

function downloadSelected() {
  fileStore.selectedFiles.forEach(file => {
    if (file.storage?.url) {
      window.open(file.storage.url, '_blank')
    }
  })
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
