<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ folder?.name || 'Folder' }}</h1>
        <p class="text-sm text-slate-500">Browse files and manage metadata.</p>
      </div>
      <NuxtLink class="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:border-primary-400 hover:text-primary-500 dark:border-slate-700" to="/dashboard">
        Back to dashboard
      </NuxtLink>
    </div>
    <SearchBar v-model="filters" :tags="fileStore.tags" @filter="refreshFiles" />
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
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const fileStore = useFileStore()
const filters = reactive({ search: '', type: '', tag: '' })

const folder = computed(() => fileStore.folders.find(item => item.id === route.params.id))

onMounted(async () => {
  if (!fileStore.folders.length) {
    await fileStore.fetchFolders()
  }
  if (!folder.value) {
    router.push('/dashboard')
    return
  }
  fileStore.setCurrentFolder(folder.value.id)
  await fileStore.fetchTags()
  await refreshFiles()
})

watch(
  () => route.params.id,
  async (id) => {
    if (typeof id === 'string') {
      fileStore.setCurrentFolder(id)
      await refreshFiles()
    }
  }
)

async function refreshFiles() {
  fileStore.pagination.page = 1
  await fileStore.fetchFiles({ ...filters, folderId: route.params.id })
}

function changePage(page: number) {
  fileStore.pagination.page = page
  fileStore.fetchFiles({ ...filters, folderId: route.params.id })
}
</script>
