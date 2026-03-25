import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { deletePublicImageByUrl, uploadPublicImage, validateImageFile } from '@/lib/storage'

interface ImageUploadFieldProps {
  label: string
  folder: string
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

const ImageUploadField = ({ label, folder, value, onChange, disabled = false }: ImageUploadFieldProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setError(t(`uploads.${validationError}`))
      event.target.value = ''
      return
    }

    setError('')
    setUploading(true)

    try {
      const previousUrl = value
      const nextUrl = await uploadPublicImage(folder, file)
      onChange(nextUrl)
      await deletePublicImageByUrl(previousUrl)
    } catch (uploadError) {
      console.error(uploadError)
      setError(t('uploads.upload_failed'))
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <Label className="font-arabic">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={value || '/placeholder.svg'}
              alt={label}
              className="h-20 w-20 rounded-2xl border border-border bg-background object-cover"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground font-arabic">{value ? t('uploads.image_ready') : t('uploads.no_image_selected')}</p>
              <p className="text-xs text-muted-foreground font-arabic">{t('uploads.helper_text')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="font-arabic" disabled={disabled || uploading} onClick={() => inputRef.current?.click()}>
              <Upload size={14} className="me-2" />
              {uploading ? t('uploads.uploading') : value ? t('uploads.replace_image') : t('uploads.upload_image')}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                className="font-arabic text-muted-foreground"
                disabled={disabled || uploading}
                onClick={() => onChange('')}
              >
                <X size={14} className="me-2" />
                {t('uploads.remove_image')}
              </Button>
            )}
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive font-arabic">{error}</p>}
      </div>
    </div>
  )
}

export default ImageUploadField