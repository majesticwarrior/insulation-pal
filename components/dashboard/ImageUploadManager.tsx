'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Upload, X, Eye, Trash2, Plus } from 'lucide-react'
import Image from 'next/image'

interface ProjectImage {
  id: string
  title: string
  description: string
  service_type: string
  project_size_sqft?: number
  completion_date: string
  before_image_url?: string
  after_image_url?: string
  additional_images: string[]
  project_city: string
  project_state: string
  is_featured: boolean
  display_order: number
}

interface ImageUploadManagerProps {
  contractorId: string
}

export function ImageUploadManager({ contractorId }: ImageUploadManagerProps) {
  const [images, setImages] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectImage | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  // Form state for new/edit project
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: 'attic',
    project_size_sqft: '',
    project_city: '',
    project_state: 'AZ',
    completion_date: '',
    is_featured: false
  })
  
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null)
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null)
  const [beforeImagePreview, setBeforeImagePreview] = useState<string>('')
  const [afterImagePreview, setAfterImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadProjectImages()
  }, [contractorId])

  const loadProjectImages = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('contractor_portfolio')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('display_order', { ascending: true })

      if (error) throw error
      
      setImages(data || [])
    } catch (error) {
      console.error('Error loading portfolio images:', error)
      toast.error('Failed to load project images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: File, type: 'before' | 'after') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      if (type === 'before') {
        setBeforeImageFile(file)
        setBeforeImagePreview(preview)
      } else {
        setAfterImageFile(file)
        setAfterImagePreview(preview)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      console.log('🔄 Uploading image to Supabase Storage...', file.name)
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `contractor-portfolio/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('contractor_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Supabase Storage upload error:', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      console.log('✅ Image uploaded successfully:', data.path)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('contractor_images')
        .getPublicUrl(filePath)

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log('✅ Public URL generated:', urlData.publicUrl)
      return urlData.publicUrl
      
    } catch (error) {
      console.error('💥 Image upload failed:', error)
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    if (!beforeImageFile && !afterImageFile) {
      toast.error('Please upload at least one image')
      return
    }

    setIsUploading(true)
    try {
      let beforeImageUrl = ''
      let afterImageUrl = ''

      // Upload images
      if (beforeImageFile) {
        beforeImageUrl = await uploadImageToSupabase(beforeImageFile)
      }
      if (afterImageFile) {
        afterImageUrl = await uploadImageToSupabase(afterImageFile)
      }

      // Save to database
      const projectData = {
        contractor_id: contractorId,
        title: formData.title,
        description: formData.description,
        service_type: formData.service_type,
        project_size_sqft: formData.project_size_sqft ? parseInt(formData.project_size_sqft) : null,
        completion_date: formData.completion_date,
        before_image_url: beforeImageUrl || null,
        after_image_url: afterImageUrl || null,
        additional_images: [],
        project_city: formData.project_city,
        project_state: formData.project_state,
        is_featured: formData.is_featured,
        display_order: images.length
      }

      const { error } = await (supabase as any)
        .from('contractor_portfolio')
        .insert(projectData)

      if (error) throw error

      toast.success('Project added successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        service_type: 'attic',
        project_size_sqft: '',
        project_city: '',
        project_state: 'AZ',
        completion_date: '',
        is_featured: false
      })
      setBeforeImageFile(null)
      setAfterImageFile(null)
      setBeforeImagePreview('')
      setAfterImagePreview('')
      setIsAddingProject(false)
      
      // Reload images
      loadProjectImages()

    } catch (error) {
      console.error('Error adding project:', error)
      toast.error('Failed to add project. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('contractor_portfolio')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      toast.success('Project deleted successfully')
      loadProjectImages()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleToggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('contractor_portfolio')
        .update({ is_featured: !currentFeatured })
        .eq('id', projectId)

      if (error) throw error

      toast.success(currentFeatured ? 'Removed from featured' : 'Added to featured')
      loadProjectImages()
    } catch (error) {
      console.error('Error updating featured status:', error)
      toast.error('Failed to update featured status')
    }
  }

  const serviceTypeOptions = [
    { value: 'attic', label: 'Attic Insulation' },
    { value: 'wall', label: 'Wall Insulation' },
    { value: 'basement', label: 'Basement Insulation' },
    { value: 'crawl_space', label: 'Crawl Space Insulation' },
    { value: 'commercial', label: 'Commercial Project' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a4768] mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Project Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Project Gallery</h3>
          <p className="text-gray-600">Showcase your completed insulation projects</p>
        </div>
        <Button
          onClick={() => setIsAddingProject(true)}
          className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Project Grid */}
      {images.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h4>
            <p className="text-gray-600 mb-4">
              Start building your portfolio by adding photos of your completed projects
            </p>
            <Button
              onClick={() => setIsAddingProject(true)}
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
            >
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                {project.after_image_url ? (
                  <Image
                    src={project.after_image_url}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : project.before_image_url ? (
                  <Image
                    src={project.before_image_url}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                {project.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedProject(project)
                        setIsViewModalOpen(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="capitalize">{project.service_type.replace('_', ' ')}</span>
                  <span>{project.project_city}, {project.project_state}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {new Date(project.completion_date).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                    className="text-xs"
                  >
                    {project.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Attic Insulation - 2500 sq ft"
                />
              </div>
              <div>
                <Label htmlFor="service_type">Service Type *</Label>
                <select
                  id="service_type"
                  value={formData.service_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {serviceTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project, challenges, and results..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project_size_sqft">Project Size (sq ft)</Label>
                <Input
                  id="project_size_sqft"
                  type="number"
                  value={formData.project_size_sqft}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_size_sqft: e.target.value }))}
                  placeholder="2500"
                />
              </div>
              <div>
                <Label htmlFor="project_city">City</Label>
                <Input
                  id="project_city"
                  value={formData.project_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_city: e.target.value }))}
                  placeholder="Phoenix"
                />
              </div>
              <div>
                <Label htmlFor="completion_date">Completion Date</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Before Image</Label>
                <div className="mt-2">
                  {beforeImagePreview ? (
                    <div className="relative">
                      <Image
                        src={beforeImagePreview}
                        alt="Before preview"
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <button
                        onClick={() => {
                          setBeforeImageFile(null)
                          setBeforeImagePreview('')
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-gray-400">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload before image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'before')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label>After Image</Label>
                <div className="mt-2">
                  {afterImagePreview ? (
                    <div className="relative">
                      <Image
                        src={afterImagePreview}
                        alt="After preview"
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <button
                        onClick={() => {
                          setAfterImageFile(null)
                          setAfterImagePreview('')
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-gray-400">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload after image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'after')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsAddingProject(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isUploading ? 'Uploading...' : 'Add Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Project Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.before_image_url && (
                    <div>
                      <h4 className="font-semibold mb-2">Before</h4>
                      <Image
                        src={selectedProject.before_image_url}
                        alt="Before"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded"
                      />
                    </div>
                  )}
                  {selectedProject.after_image_url && (
                    <div>
                      <h4 className="font-semibold mb-2">After</h4>
                      <Image
                        src={selectedProject.after_image_url}
                        alt="After"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Project Details</h4>
                  <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Service Type:</span> {selectedProject.service_type.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {selectedProject.project_city}, {selectedProject.project_state}
                    </div>
                    {selectedProject.project_size_sqft && (
                      <div>
                        <span className="font-medium">Size:</span> {selectedProject.project_size_sqft} sq ft
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Completed:</span> {new Date(selectedProject.completion_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
