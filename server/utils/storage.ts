import { createClient } from '@supabase/supabase-js'

interface UploadPayload {
  bucket: string
  path: string
  file: Buffer | Blob | ArrayBuffer | Uint8Array
  options?: {
    contentType?: string
  }
}

export function getSupabaseClient() {
  const config = useRuntimeConfig()
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('Supabase credentials are missing. Set SUPABASE_URL and SUPABASE_KEY in .env')
  }
  return createClient(config.supabaseUrl, config.supabaseKey)
}

export async function uploadToStorage({ bucket, path, file, options }: UploadPayload) {
  const client = getSupabaseClient()
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: options?.contentType
  })
  if (error) {
    throw error
  }
  const { data: publicUrl } = client.storage.from(bucket).getPublicUrl(path)
  return {
    path: data.path,
    publicUrl: publicUrl.publicUrl
  }
}

export async function removeFromStorage(bucket: string, path: string) {
  const client = getSupabaseClient()
  const { error } = await client.storage.from(bucket).remove([path])
  if (error) {
    throw error
  }
}
