import { listFiles } from '../utils/db'
import type { FileItem } from '../types'

function filterFiles(files: FileItem[], query: Record<string, string | undefined>) {
  const { id, folderId, search, type, tag, page = '1', pageSize = '20' } = query
  let filtered = files
  if (id) {
    filtered = filtered.filter(file => file.id === id)
  }
  if (folderId) {
    filtered = filtered.filter(file => file.folderId === folderId)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(file => file.name.toLowerCase().includes(q))
  }
  if (type) {
    filtered = filtered.filter(file => file.type.includes(type))
  }
  if (tag) {
    filtered = filtered.filter(file => file.tags.includes(tag))
  }
  const pageNum = Number(page)
  const sizeNum = Number(pageSize)
  const start = (pageNum - 1) * sizeNum
  const end = start + sizeNum
  const paginated = filtered.slice(start, end)
  return {
    data: paginated,
    page: pageNum,
    pageSize: sizeNum,
    total: filtered.length
  }
}

export default defineEventHandler((event) => {
  const files = listFiles()
  const query = getQuery(event)
  return filterFiles(files, query)
})
