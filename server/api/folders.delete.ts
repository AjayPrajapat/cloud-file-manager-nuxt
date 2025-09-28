import { deleteFolder, listFiles, listFolders } from '../utils/db'
import { requireRole } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')
  const body = await readBody<{ id: string }>(event)
  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: 'Folder id required' })
  }
  const hasChildren = listFolders().some(folder => folder.parentId === body.id)
  const hasFiles = listFiles().some(file => file.folderId === body.id)
  if (hasChildren || hasFiles) {
    throw createError({ statusCode: 400, statusMessage: 'Folder is not empty' })
  }
  deleteFolder(body.id)
  return { status: 'ok' }
})
