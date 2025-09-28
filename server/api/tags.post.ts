import { randomUUID } from 'node:crypto'
import { addTag } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Only admins can create tags' })
  }
  const body = await readBody<{ name: string; color?: string }>(event)
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Tag name required' })
  }
  const tag = addTag({
    id: randomUUID(),
    name: body.name,
    color: body.color ?? '#6366f1'
  })
  return tag
})
