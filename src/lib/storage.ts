import { supabase } from '@/lib/supabase'

export const MEDIA_BUCKET = 'media'
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg']

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return 'invalid-type'
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'file-too-large'
  }

  return null
}

export async function uploadPublicImage(folder: string, file: File) {
  const fileName = sanitizeFileName(file.name)
  const path = `${folder}/${crypto.randomUUID()}-${fileName}`

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deletePublicImageByUrl(url: string | null | undefined) {
  if (!url) return

  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const markerIndex = url.indexOf(marker)

  if (markerIndex === -1) return

  const path = decodeURIComponent(url.slice(markerIndex + marker.length))
  if (!path) return

  await supabase.storage.from(MEDIA_BUCKET).remove([path])
}