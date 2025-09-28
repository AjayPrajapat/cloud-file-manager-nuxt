import { sampleFiles, sampleFolders, sampleTags, sampleUsers } from '../data/sample-data'
import type { FileItem, FolderItem, TagItem, User } from '../types'

interface Database {
  users: User[]
  files: FileItem[]
  folders: FolderItem[]
  tags: TagItem[]
}

const db: Database = {
  users: [...sampleUsers],
  files: [...sampleFiles],
  folders: [...sampleFolders],
  tags: [...sampleTags]
}

export function getUserByEmail(email: string) {
  return db.users.find(user => user.email === email)
}

export function addUser(user: User) {
  db.users.push(user)
  return user
}

export function listFolders() {
  return db.folders
}

export function createFolder(folder: FolderItem) {
  db.folders.push(folder)
  return folder
}

export function deleteFolder(id: string) {
  const index = db.folders.findIndex(folder => folder.id === id)
  if (index !== -1) {
    db.folders.splice(index, 1)
  }
}

export function listFiles() {
  return db.files
}

export function createFile(file: FileItem) {
  db.files.push(file)
  return file
}

export function updateFile(fileId: string, payload: Partial<FileItem>) {
  const file = db.files.find(item => item.id === fileId)
  if (!file) {
    return null
  }
  Object.assign(file, payload, { updatedAt: new Date().toISOString() })
  return file
}

export function deleteFile(fileId: string) {
  const index = db.files.findIndex(item => item.id === fileId)
  if (index !== -1) {
    db.files.splice(index, 1)
  }
}

export function listTags() {
  return db.tags
}

export function addTag(tag: TagItem) {
  db.tags.push(tag)
  return tag
}

export function resetDb() {
  db.users = [...sampleUsers]
  db.files = [...sampleFiles]
  db.folders = [...sampleFolders]
  db.tags = [...sampleTags]
}

export type { Database }
