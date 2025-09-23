'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { isValidImageFile, isValidImageSize } from '@/lib/watermark'

interface ImageUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSizeInMB?: number
  disabled?: boolean
  existingImages?: string[]
  onRemove?: (index: number) => void
}

export function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSizeInMB = 5,
  disabled = false,
  existingImages = [],
  onRemove
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      if (!isValidImageFile(file)) {
        toast.error(`${file.name} is not a valid image format`)
        continue
      }

      if (!isValidImageSize(file, maxSizeInMB)) {
        toast.error(`${file.name} is too large. Maximum size is ${maxSizeInMB}MB`)
        continue
      }

      if (existingImages.length + previews.length + validFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`)
        break
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setPreviews(prev => [...prev, ...newPreviews])
      
      onUpload(validFiles)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExisting = (index: number) => {
    onRemove?.(index)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`
          border-2 border-dashed transition-colors cursor-pointer
          ${dragActive 
            ? 'border-[#0a4768] bg-blue-50' 
            : 'border-gray-300 hover:border-[#0a4768]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Project Images
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop images here, or click to select files
          </p>
          <p className="text-sm text-gray-400">
            PNG, JPG, JPEG, WebP up to {maxSizeInMB}MB each (max {maxFiles} images)
          </p>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            disabled={disabled}
          >
            Select Images
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Existing image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExisting(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-[#F5DD22] text-[#0a4768] px-2 py-1 rounded text-xs font-semibold">
                  Current
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Images */}
      {previews.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">New Images (Will be watermarked)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePreview(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  New
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <ImageIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Image Guidelines:</strong>
            <ul className="mt-1 space-y-1">
              <li>• All uploaded images will be automatically watermarked with the Insulation Pal logo</li>
              <li>• Use high-quality images that showcase your work clearly</li>
              <li>• Before and after shots are particularly effective</li>
              <li>• Make sure images are well-lit and show the completed work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
