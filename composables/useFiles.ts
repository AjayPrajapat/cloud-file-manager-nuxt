import { defineStore } from 'pinia'
import type { FileItem, FolderItem, PaginatedResponse, TagItem } from '~/server/types'
import { useAuthHeaders } from './useAuth'

export const useFileStore = defineStore('files', {
  state: () => ({
    currentFolderId: 'root',
    selected: new Set<string>(),
    files: [] as FileItem[],
    folders: [] as FolderItem[],
    tags: [] as TagItem[],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0
    },
    loading: false,
    error: ''
  }),
  getters: {
    selectedFiles(state) {
      return state.files.filter(file => state.selected.has(file.id))
    },
    folderTree(state) {
      const map = new Map<string, FolderItem & { children: FolderItem[] }>()
      state.folders.forEach(folder => {
        map.set(folder.id, { ...folder, children: [] })
      })
      const tree: (FolderItem & { children: FolderItem[] })[] = []
      map.forEach(folder => {
        if (folder.parentId && map.has(folder.parentId)) {
          map.get(folder.parentId)!.children.push(folder)
        } else {
          tree.push(folder)
        }
      })
      return tree
    }
  },
  actions: {
    setCurrentFolder(id: string) {
      this.currentFolderId = id
    },
    toggleSelection(id: string) {
      const next = new Set(this.selected)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      this.selected = next
    },
    clearSelection() {
      this.selected = new Set()
    },
    async fetchFolders() {
      const { data } = await useFetch<FolderItem[]>('/api/folders')
      this.folders = data.value ?? []
    },
    async fetchTags() {
      const { data } = await useFetch<TagItem[]>('/api/tags')
      this.tags = data.value ?? []
    },
    async fetchFiles(params?: Record<string, any>) {
      this.loading = true
      this.error = ''
      try {
        const query = {
          folderId: this.currentFolderId,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        }
        const { data, error } = await useFetch<PaginatedResponse<FileItem>>('/api/files', { params: query })
        if (error.value) {
          throw error.value
        }
        this.files = data.value?.data ?? []
        this.clearSelection()
        if (data.value) {
          this.pagination = {
            page: data.value.page,
            pageSize: data.value.pageSize,
            total: data.value.total
          }
        }
      } catch (err: any) {
        this.error = err?.data?.statusMessage ?? err.message ?? 'Failed to load files'
      } finally {
        this.loading = false
      }
    },
    async uploadFiles(formData: FormData) {
      this.loading = true
      try {
        const headers = useAuthHeaders()
        const response = await $fetch('/api/files', {
          method: 'POST',
          body: formData,
          headers
        })
        await this.fetchFiles()
        return response
      } finally {
        this.loading = false
      }
    },
    async deleteSelected() {
      const headers = {
        'Content-Type': 'application/json',
        ...useAuthHeaders()
      }
      const ids = Array.from(this.selected)
      await $fetch('/api/files', {
        method: 'DELETE',
        body: { ids },
        headers
      })
      this.clearSelection()
      await this.fetchFiles()
    }
  }
})
