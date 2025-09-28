import { randomUUID } from 'node:crypto'
import { createFolder } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Folder name is required' })
  }
  const folder = createFolder({
    id: randomUUID(),
    name: body.name,
    parentId: body.parentId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: user.sub
  })
  return folder
})
