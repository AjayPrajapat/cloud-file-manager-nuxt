export type Role = 'admin' | 'user'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: Role
}

export interface FolderItem {
  id: string
  name: string
  parentId: string | null
  createdAt: string
  updatedAt: string
  ownerId: string
}

export interface FileMetadata {
  summary?: string
  aiSummary?: string
  aiTags?: string[]
  ocrText?: string
}

export interface StorageLocation {
  bucket: string
  path: string
  url?: string
}

export interface VersionEntry {
  id: string
  fileId: string
  version: number
  createdAt: string
  metadata: {
    summary?: string
    tags?: string[]
    ocrText?: string
  }
  location: StorageLocation
}

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  folderId: string
  ownerId: string
  createdAt: string
  updatedAt: string
  tags: string[]
  thumbnailUrl?: string
  versions: VersionEntry[]
  metadata: FileMetadata
  storage: StorageLocation
}

export interface TagItem {
  id: string
  name: string
  color: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}
