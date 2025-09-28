import { deleteFile, listFiles } from '../utils/db'
import { requireUser } from '../utils/auth'
import { removeFromStorage } from '../utils/storage'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const config = useRuntimeConfig()
  const isMock = config.public.mockMode
  const body = await readBody<{ ids: string[] }>(event)

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file ids provided' })
  }

  const files = listFiles().filter(file => body.ids.includes(file.id))
  files.forEach(file => {
    if (user.role !== 'admin' && file.ownerId !== user.sub) {
      throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions to delete file' })
    }
  })

  for (const file of files) {
    if (!isMock && file.storage?.bucket && file.storage?.path) {
      await removeFromStorage(file.storage.bucket, file.storage.path)
    }
    deleteFile(file.id)
  }

  return { deleted: body.ids }
})
