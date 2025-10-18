'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Image as ImageIcon, X, CheckCircle, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface ProjectImageUploadProps {
  leadAssignmentId: string
  contractorId: string
  customerName: string
  customerEmail: string
  projectDetails: {
    homeSize: number
    areasNeeded: string[]
    insulationTypes: string[]
    city: string
    state: string
  }
  onImagesUploaded: () => void
}

interface ProjectImage {
  id: string
  url: string
  caption?: string
  uploaded_at: string
}

export function ProjectImageUpload({ 
  leadAssignmentId, 
  contractorId, 
  customerName, 
  customerEmail, 
  projectDetails,
  onImagesUploaded 
}: ProjectImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [captions, setCaptions] = useState<{ [key: number]: string }>({})
  const [uploadedImages, setUploadedImages] = useState<ProjectImage[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select only image files')
      return
    }

    if (imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages(prev => [...prev, ...imageFiles])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setCaptions(prev => {
      const newCaptions = { ...prev }
      delete newCaptions[index]
      return newCaptions
    })
  }

  const updateCaption = (index: number, caption: string) => {
    setCaptions(prev => ({ ...prev, [index]: caption }))
  }

  const uploadImages = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setUploading(true)
    try {
      const uploadedUrls: ProjectImage[] = []

      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${leadAssignmentId}-${Date.now()}-${i}.${fileExt}`
        const filePath = `project-gallery/${contractorId}/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('contractor-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          toast.error(`Failed to upload ${file.name}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('contractor-images')
          .getPublicUrl(filePath)

        uploadedUrls.push({
          id: `${leadAssignmentId}-${i}`,
          url: publicUrl,
          caption: captions[i] || '',
          uploaded_at: new Date().toISOString()
        })
      }

      // Save to database
      const { error: dbError } = await (supabase as any)
        .from('project_gallery')
        .insert(uploadedUrls.map(img => ({
          lead_assignment_id: leadAssignmentId,
          contractor_id: contractorId,
          image_url: img.url,
          caption: img.caption,
          uploaded_at: img.uploaded_at
        })))

      if (dbError) {
        console.error('Database error:', dbError)
        toast.error('Failed to save image data')
        return
      }

      // Update lead assignment status to completed
      const { error: statusError } = await (supabase as any)
        .from('lead_assignments')
        .update({ 
          status: 'completed',
          project_completed_at: new Date().toISOString()
        })
        .eq('id', leadAssignmentId)

      if (statusError) {
        console.error('Status update error:', statusError)
      }

      // Send review request email to customer
      await sendReviewRequestEmail()

      setUploadedImages(prev => [...prev, ...uploadedUrls])
      setImages([])
      setCaptions({})
      setIsOpen(false)
      onImagesUploaded()
      
      toast.success('Project images uploaded successfully! Review request sent to customer.')
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const sendReviewRequestEmail = async () => {
    try {
      const reviewLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insulationpal.com'}/review/${contractorId}?leadId=${leadAssignmentId}`

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: customerEmail,
          subject: `How was your insulation project? - ${projectDetails.city}, ${projectDetails.state} - InsulationPal`,
          template: 'project-completion-review',
          data: {
            customerName: customerName,
            projectDetails: projectDetails,
            reviewLink: reviewLink,
            leadAssignmentId: leadAssignmentId
          }
        })
      })

      console.log('✅ Review request email sent successfully')
    } catch (error) {
      console.error('❌ Error sending review request email:', error)
      // Don't throw - email failure shouldn't prevent image upload
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Camera className="h-4 w-4 mr-2" />
          Add Project Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Add Project Completion Images
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Customer:</span> {customerName}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {projectDetails.city}, {projectDetails.state}
                </div>
                <div>
                  <span className="font-medium">Home Size:</span> {projectDetails.homeSize.toLocaleString()} sq ft
                </div>
                <div>
                  <span className="font-medium">Areas:</span> {projectDetails.areasNeeded.join(', ')}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Insulation Types:</span> {projectDetails.insulationTypes.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <div>
            <Label htmlFor="image-upload" className="text-lg font-medium">
              Select Images (Max 10)
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload before/after photos, work in progress, and completed project images
            </p>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Image Previews</h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <Label htmlFor={`caption-${index}`} className="text-sm">
                            Caption (Optional)
                          </Label>
                          <Textarea
                            id={`caption-${index}`}
                            placeholder="Describe this image..."
                            value={captions[index] || ''}
                            onChange={(e) => updateCaption(index, e.target.value)}
                            className="mt-1 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Uploaded Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.map((image, index) => (
                  <Card key={image.id}>
                    <CardContent className="p-4">
                      <img
                        src={image.url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      {image.caption && (
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadImages}
              disabled={uploading || images.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images & Send Review Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
