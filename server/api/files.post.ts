import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import formidable from 'formidable'
import type { H3Event } from 'h3'
import { createFile } from '../utils/db'
import type { FileItem } from '../types'
import { uploadToStorage } from '../utils/storage'
import { requireUser } from '../utils/auth'

export const config = {
  api: {
    bodyParser: false
  }
}

async function parseForm(event: H3Event) {
  const form = formidable({ multiples: true })
  const files: any[] = []
  const fields: Record<string, any> = {}
  await new Promise<void>((resolve, reject) => {
    form.parse(event.node.req, (err, fieldsData, filesData) => {
      if (err) {
        reject(err)
        return
      }
      Object.assign(fields, fieldsData)
      const entries = Array.isArray(filesData.file) ? filesData.file : Object.values(filesData)
      entries.forEach((entry: any) => {
        if (Array.isArray(entry)) {
          entry.forEach(item => files.push(item))
        } else {
          files.push(entry)
        }
      })
      resolve()
    })
  })
  return { fields, files }
}

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const config = useRuntimeConfig()
  const isMock = config.public.mockMode

  if (event.node.req.headers['content-type']?.includes('multipart/form-data')) {
    const { fields, files } = await parseForm(event)
    const folderId = Array.isArray(fields.folderId) ? fields.folderId[0] : fields.folderId ?? 'root'
    const bucket = Array.isArray(fields.bucket) ? fields.bucket[0] : fields.bucket ?? 'documents'
    const results: FileItem[] = []

    const summaryField = Array.isArray(fields.summary) ? fields.summary[0] : fields.summary
    const aiSummaryField = Array.isArray(fields.aiSummary) ? fields.aiSummary[0] : fields.aiSummary
    const ocrTextField = Array.isArray(fields.ocrText) ? fields.ocrText[0] : fields.ocrText
    const aiTagsField = Array.isArray(fields.aiTags) ? fields.aiTags[0] : fields.aiTags

    for (const file of files) {
      const id = randomUUID()
      const fileName = file.originalFilename ?? file.newFilename
      const mime = file.mimetype ?? 'application/octet-stream'
      let storageLocation: { publicUrl?: string }

      if (!isMock) {
        const fileBuffer = await fs.promises.readFile(file.filepath)
        storageLocation = await uploadToStorage({
          bucket,
          path: `${folderId}/${id}-${fileName}`,
          file: fileBuffer,
          options: { contentType: mime }
        })
      } else {
        storageLocation = { publicUrl: file.filepath }
      }

      const newFile: FileItem = {
        id,
        name: fileName,
        type: mime,
        size: file.size,
        folderId,
        ownerId: user.sub,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: (() => {
          const raw = Array.isArray(fields.tags) ? fields.tags[0] : fields.tags
          if (!raw) return []
          try {
            return JSON.parse(String(raw))
          } catch {
            return String(raw).split(',').map(tag => tag.trim()).filter(Boolean)
          }
        })(),
        thumbnailUrl: undefined,
        versions: [],
        metadata: {
          summary: summaryField,
          aiSummary: aiSummaryField,
          aiTags: aiTagsField ? JSON.parse(String(aiTagsField)) : undefined,
          ocrText: ocrTextField
        },
        storage: {
          bucket,
          path: `${folderId}/${id}-${fileName}`,
          url: storageLocation?.publicUrl
        }
      }
      results.push(createFile(newFile))
    }

    return { files: results }
  }

  const body = await readBody(event)
  if (!body.name || !body.folderId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file metadata' })
  }
  const id = randomUUID()
  const file: FileItem = {
    id,
    name: body.name,
    type: body.type ?? 'application/octet-stream',
    size: body.size ?? 0,
    folderId: body.folderId,
    ownerId: user.sub,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: body.tags ?? [],
    thumbnailUrl: body.thumbnailUrl,
    versions: [],
    metadata: body.metadata ?? {},
    storage: body.storage ?? { bucket: 'documents', path: `${body.folderId}/${id}-${body.name}` }
  }
  createFile(file)
  return { file }
})
