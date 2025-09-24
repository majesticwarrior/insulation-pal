'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { getCountyNames, getCitiesForCounty, getCountyForCity } from '@/lib/arizona-locations'

interface Contractor {
  id: string
  business_name: string
  license_number?: string
  bio?: string
  founded_year?: number
  employee_count?: number
  business_address?: string
  business_city?: string
  business_state?: string
  business_zip?: string
  credits: number
  profile_image?: string
  lead_delivery_preference?: string
  contact_phone?: string
  contact_email?: string
}

interface ProfileEditFormProps {
  contractor: Contractor
  onUpdate: (updatedContractor: Contractor) => void
}

export function ProfileEditForm({ contractor, onUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // County and service area management
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const availableCounties = getCountyNames()
  const [formData, setFormData] = useState({
    business_name: contractor.business_name || '',
    license_number: contractor.license_number || '',
    bio: contractor.bio || '',
    founded_year: contractor.founded_year?.toString() || '',
    employee_count: contractor.employee_count?.toString() || '',
    business_address: contractor.business_address || '',
    business_city: contractor.business_city || '',
    business_state: contractor.business_state || '',
    business_zip: contractor.business_zip || '',
    lead_delivery_preference: contractor.lead_delivery_preference || 'email',
    contact_phone: contractor.contact_phone || '',
    contact_email: contractor.contact_email || ''
  })

  const [servicesOffered, setServicesOffered] = useState<string[]>([])
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoMethod, setLogoMethod] = useState<'upload' | 'url'>('upload')

  const availableServiceTypes = [
    'attic',
    'wall',
    'basement',
    'crawl_space',
    'commercial'
  ]

  const availableInsulationTypes = [
    'Fiberglass',
    'Cellulose', 
    'Spray Foam',
    'Mineral Wool',
    'Rigid Foam Board',
    'Roll & Batt'
  ]

  // County and city handling functions
  const handleCountyChange = (county: string) => {
    setSelectedCounty(county)
    const cities = getCitiesForCounty(county)
    setAvailableCities(cities)
    // Clear current service areas when county changes
    setServiceAreas([])
  }

  const handleCityToggle = (city: string) => {
    setServiceAreas(prev => {
      const cityWithState = `${city}, AZ`
      return prev.includes(cityWithState)
        ? prev.filter(area => area !== cityWithState)
        : [...prev, cityWithState]
    })
  }

  const availableCertifications = [
    'BBB Accreditation',
    'ENERGY STAR Partner', 
    'BPI Certified',
    'Licensed, Bonded & Insured'
  ]

  useEffect(() => {
    loadContractorDetails()
  }, [contractor.id])

  // Update form data when contractor prop changes (e.g., after credit updates)
  useEffect(() => {
    console.log('🔄 ProfileEditForm contractor prop changed:', contractor)
    console.log('📝 Updating form data with contractor:', {
      business_name: contractor.business_name,
      license_number: contractor.license_number,
      bio: contractor.bio,
      contact_phone: contractor.contact_phone,
      contact_email: contractor.contact_email
    })
    
    setFormData({
      business_name: contractor.business_name || '',
      license_number: contractor.license_number || '',
      bio: contractor.bio || '',
      founded_year: contractor.founded_year?.toString() || '',
      employee_count: contractor.employee_count?.toString() || '',
      business_address: contractor.business_address || '',
      business_city: contractor.business_city || '',
      business_state: contractor.business_state || '',
      business_zip: contractor.business_zip || '',
      lead_delivery_preference: contractor.lead_delivery_preference || 'email',
      contact_phone: contractor.contact_phone || '',
      contact_email: contractor.contact_email || ''
    })
    
    console.log('✅ Form data updated')
  }, [contractor])

  const loadContractorDetails = async () => {
    try {
      console.log('🔄 loadContractorDetails called for contractor:', contractor.id)
      
      // Load service areas
      console.log('📍 Loading service areas...')
      const { data: areas } = await (supabase as any)
        .from('contractor_service_areas')
        .select('city, state')
        .eq('contractor_id', contractor.id)

      console.log('📍 Service areas loaded:', areas)

      if (areas && areas.length > 0) {
        const serviceAreaStrings = areas.map((area: any) => `${area.city}, ${area.state}`)
        console.log('📍 Setting service areas:', serviceAreaStrings)
        setServiceAreas(serviceAreaStrings)
        
        // Auto-detect county from first city
        const firstCity = areas[0].city
        const detectedCounty = getCountyForCity(firstCity)
        console.log('🏛️ Detected county for', firstCity, ':', detectedCounty)
        if (detectedCounty) {
          setSelectedCounty(detectedCounty)
          const citiesInCounty = getCitiesForCounty(detectedCounty)
          setAvailableCities(citiesInCounty)
          console.log('🏛️ Set county and cities:', detectedCounty, citiesInCounty.length, 'cities')
        }
      } else {
        console.log('📍 No service areas found')
      }

      // TEMPORARY: Skip contractor_services query to avoid 401 error
      console.log('⚠️ Temporarily skipping contractor_services query due to RLS 401 error')
      console.log('💡 Will restore after fixing RLS policies')
      
      // Set empty defaults for now
      setServicesOffered([])
      setServiceTypes([])
      
      // // Load services offered and insulation types
      // const { data: services } = await (supabase as any)
      //   .from('contractor_services')
      //   .select('service_type, insulation_types')
      //   .eq('contractor_id', contractor.id)

      // if (services && services.length > 0) {
      //   // Extract unique service areas
      //   setServicesOffered(services.map((service: any) => service.service_type))
      //   
      //   // Extract unique insulation types from all services
      //   const allInsulationTypes = services.reduce((acc: string[], service: any) => {
      //     if (service.insulation_types && Array.isArray(service.insulation_types)) {
      //       return [...acc, ...service.insulation_types]
      //     }
      //     return acc
      //   }, [])
      //   setServiceTypes(Array.from(new Set(allInsulationTypes))) // Remove duplicates
      // }

      // Load certifications (for now, just set defaults - could be stored in a separate table)
      setCertifications([])  // Will be enhanced when certifications are stored in database

    } catch (error) {
      console.error('Error loading contractor details:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleServiceTypeToggle = (serviceType: string) => {
    setServiceTypes(prev => 
      prev.includes(serviceType)
        ? prev.filter(type => type !== serviceType)
        : [...prev, serviceType]
    )
  }


  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('🔍 Starting profile update for contractor:', contractor.id)
      console.log('📝 Form data:', formData)
      
      // Update contractor profile
      const updateData = {
        business_name: formData.business_name,
        license_number: formData.license_number || null,
        bio: formData.bio || null,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        business_address: formData.business_address || null,
        business_city: formData.business_city || null,
        business_state: formData.business_state || null,
        business_zip: formData.business_zip || null,
        lead_delivery_preference: formData.lead_delivery_preference || 'email',
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        updated_at: new Date().toISOString()
      }

      console.log('📤 Update data being sent:', updateData)

      const { error: updateError, data: updateResult } = await (supabase as any)
        .from('contractors')
        .update(updateData)
        .eq('id', contractor.id)
        .select()

      console.log('📥 Update result:', { updateResult, updateError })

      if (updateError) {
        console.error('❌ Profile update error:', updateError)
        console.error('Error details:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        })
        throw updateError
      }

      // TEMPORARY: Skip service areas and services updates to avoid 401 errors
      console.log('⚠️ Temporarily skipping service areas and services updates due to 401 RLS errors')
      console.log('💡 Core contractor profile updated successfully, service data will be restored after RLS fix')
      
      // // Update service areas
      // // First delete existing areas
      // await (supabase as any)
      //   .from('contractor_service_areas')
      //   .delete()
      //   .eq('contractor_id', contractor.id)

      // // Insert new areas
      // if (serviceAreas.length > 0) {
      //   const areaInserts = serviceAreas.map(area => {
      //     const [city, state] = area.split(', ')
      //     return {
      //       contractor_id: contractor.id,
      //       city: city.trim(),
      //       state: state?.trim() || 'AZ'
      //     }
      //   })

      //   await (supabase as any)
      //     .from('contractor_service_areas')
      //     .insert(areaInserts)
      // }

      // // Update services offered and insulation types
      // // First delete existing services
      // await (supabase as any)
      //   .from('contractor_services')
      //   .delete()
      //   .eq('contractor_id', contractor.id)

      // // Insert new services offered (areas like attic, wall, basement, etc.)
      // if (servicesOffered.length > 0) {
      //   const serviceInserts = servicesOffered.map(serviceArea => ({
      //     contractor_id: contractor.id,
      //     service_type: serviceArea,
      //     insulation_types: serviceTypes, // Include insulation types for each service area
      //     starting_price_per_sqft: 1.50 // Default price
      //   }))

      //   await (supabase as any)
      //     .from('contractor_services')
      //     .insert(serviceInserts)
      // }

      // Update local contractor data
      const updatedContractor: Contractor = {
        ...contractor,
        business_name: updateData.business_name,
        license_number: updateData.license_number || undefined,
        bio: updateData.bio || undefined,
        founded_year: updateData.founded_year || undefined,
        employee_count: updateData.employee_count || undefined,
        business_address: updateData.business_address || undefined,
        business_city: updateData.business_city || undefined,
        business_state: updateData.business_state || undefined,
        business_zip: updateData.business_zip || undefined
      }

      // Handle logo update (either file upload or URL)
      let logoUpdateError = false
      
      if (logoMethod === 'upload' && logoFile) {
        try {
          const fileExt = logoFile.name.split('.').pop()
          const fileName = `${contractor.id}-logo.${fileExt}`
          const filePath = `contractor-logos/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('contractor_images')
            .upload(filePath, logoFile, {
              cacheControl: '3600',
              upsert: true, // Allow overwriting existing logo
            })

          if (uploadError) throw uploadError

          const { data: publicUrlData } = supabase.storage
            .from('contractor_images')
            .getPublicUrl(filePath)

          if (publicUrlData?.publicUrl) {
            // Update contractor with new logo URL
            await (supabase as any)
              .from('contractors')
              .update({ profile_image: publicUrlData.publicUrl })
              .eq('id', contractor.id)
            
            updatedContractor.profile_image = publicUrlData.publicUrl
          }
        } catch (logoError) {
          console.error('Error uploading logo:', logoError)
          toast.error('Profile updated but logo upload failed. Please try uploading the logo again.')
          logoUpdateError = true
        }
      } else if (logoMethod === 'url' && logoUrl) {
        try {
          // Update contractor with logo URL
          await (supabase as any)
            .from('contractors')
            .update({ profile_image: logoUrl })
            .eq('id', contractor.id)
          
          updatedContractor.profile_image = logoUrl
        } catch (logoError) {
          console.error('Error updating logo URL:', logoError)
          toast.error('Profile updated but logo URL update failed. Please check the URL and try again.')
          logoUpdateError = true
        }
      }

      onUpdate(updatedContractor)
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('💥 Profile update failed:', error)
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        
        // Provide specific error message based on error type
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          toast.error('Update failed: Business name or license number already exists.')
        } else if (error.message.includes('check constraint') || error.message.includes('invalid input')) {
          toast.error('Update failed: Invalid data format. Please check your input values.')
        } else if (error.message.includes('foreign key') || error.message.includes('violates')) {
          toast.error('Update failed: Data validation error. Please contact support.')
        } else {
          toast.error(`Update failed: ${error.message}`)
        }
      } else {
        console.error('Unknown error type:', error)
        toast.error('Failed to update profile. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      business_name: contractor.business_name || '',
      license_number: contractor.license_number || '',
      bio: contractor.bio || '',
      founded_year: contractor.founded_year?.toString() || '',
      employee_count: contractor.employee_count?.toString() || '',
      business_address: contractor.business_address || '',
      business_city: contractor.business_city || '',
      business_state: contractor.business_state || '',
      business_zip: contractor.business_zip || '',
      lead_delivery_preference: contractor.lead_delivery_preference || 'email',
      contact_phone: contractor.contact_phone || '',
      contact_email: contractor.contact_email || ''
    })
    setLogoFile(null)
    setLogoPreview(null)
    setLogoUrl('')
    setLogoMethod('upload')
    setServicesOffered([])
    setServiceTypes([])
    setServiceAreas([])
    setCertifications([])
    setSelectedCounty('')
    setAvailableCities([])
    setIsEditing(false)
    loadContractorDetails() // Reload original data
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div>
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div>
            <Label htmlFor="logo">Business Logo</Label>
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {logoPreview || logoUrl || contractor.profile_image ? (
                  <img 
                    src={logoPreview || logoUrl || contractor.profile_image} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-gray-500 text-center">No Logo</span>
                )}
              </div>
              {isEditing && (
                <div className="flex-1 space-y-4">
                  {/* Logo Method Selection */}
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="upload-method"
                        name="logo-method"
                        value="upload"
                        checked={logoMethod === 'upload'}
                        onChange={(e) => setLogoMethod(e.target.value as 'upload' | 'url')}
                        className="w-4 h-4 text-[#0a4768] border-gray-300 focus:ring-[#0a4768]"
                      />
                      <Label htmlFor="upload-method" className="text-sm font-normal">Upload File</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="url-method"
                        name="logo-method"
                        value="url"
                        checked={logoMethod === 'url'}
                        onChange={(e) => setLogoMethod(e.target.value as 'upload' | 'url')}
                        className="w-4 h-4 text-[#0a4768] border-gray-300 focus:ring-[#0a4768]"
                      />
                      <Label htmlFor="url-method" className="text-sm font-normal">Use Image URL</Label>
                    </div>
                  </div>

                  {/* Upload File Option */}
                  {logoMethod === 'upload' && (
                    <div>
                      <input
                        id="logo-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => document.getElementById('logo-file-input')?.click()}
                        className="bg-[#0a4768] hover:bg-[#083a56] text-white"
                      >
                        Choose File
                      </Button>
                      {logoFile && (
                        <p className="text-sm text-gray-600 mt-2">Selected: {logoFile.name}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG, or GIF. Max 2MB.</p>
                    </div>
                  )}

                  {/* URL Option */}
                  {logoMethod === 'url' && (
                    <div>
                      <Input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(e) => {
                          setLogoUrl(e.target.value)
                          if (e.target.value) {
                            setLogoPreview(null)
                            setLogoFile(null)
                          }
                        }}
                        className="mb-2"
                      />
                      <p className="text-xs text-gray-500">Enter the direct URL to your logo image.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Business Description</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Tell customers about your business, experience, and what makes you special..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="founded_year">Founded Year</Label>
              <Input
                id="founded_year"
                type="number"
                value={formData.founded_year}
                onChange={(e) => handleInputChange('founded_year', e.target.value)}
                disabled={!isEditing}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <Label htmlFor="employee_count">Number of Employees</Label>
              <Input
                id="employee_count"
                type="number"
                value={formData.employee_count}
                onChange={(e) => handleInputChange('employee_count', e.target.value)}
                disabled={!isEditing}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Business Address</h4>
            <div>
              <Label htmlFor="business_address">Street Address</Label>
              <Input
                id="business_address"
                value={formData.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="business_city">City</Label>
                <Input
                  id="business_city"
                  value={formData.business_city}
                  onChange={(e) => handleInputChange('business_city', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="business_state">State</Label>
                <Input
                  id="business_state"
                  value={formData.business_state}
                  onChange={(e) => handleInputChange('business_state', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="business_zip">ZIP Code</Label>
                <Input
                  id="business_zip"
                  value={formData.business_zip}
                  onChange={(e) => handleInputChange('business_zip', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Lead Delivery Preferences */}
          <div className="space-y-4">
            <h4 className="font-semibold">Lead Delivery Preferences</h4>
            <div>
              <Label>How do you want leads delivered?</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="email"
                    name="lead_delivery_preference"
                    value="email"
                    checked={formData.lead_delivery_preference === 'email'}
                    onChange={(e) => handleInputChange('lead_delivery_preference', e.target.value)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-[#F5DD22] border-gray-300 focus:ring-[#F5DD22]"
                  />
                  <Label htmlFor="email" className="text-sm font-normal">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="text"
                    name="lead_delivery_preference"
                    value="text"
                    checked={formData.lead_delivery_preference === 'text'}
                    onChange={(e) => handleInputChange('lead_delivery_preference', e.target.value)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-[#F5DD22] border-gray-300 focus:ring-[#F5DD22]"
                  />
                  <Label htmlFor="text" className="text-sm font-normal">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="both"
                    name="lead_delivery_preference"
                    value="both"
                    checked={formData.lead_delivery_preference === 'both'}
                    onChange={(e) => handleInputChange('lead_delivery_preference', e.target.value)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-[#F5DD22] border-gray-300 focus:ring-[#F5DD22]"
                  />
                  <Label htmlFor="both" className="text-sm font-normal">Both</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">Phone # for Text Messages</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-gray-500 mt-1">For lead notifications only. Not displayed publicly.</p>
              </div>
              <div>
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="contractor@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">For lead notifications only. Not displayed publicly.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Select a county first, then choose the cities where you provide insulation services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* County Selection */}
          <div className="space-y-2">
            <Label htmlFor="county-select">County</Label>
            <Select
              value={selectedCounty}
              onValueChange={handleCountyChange}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectContent>
                {availableCounties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cities Selection */}
          {selectedCounty && availableCities.length > 0 && (
            <div className="space-y-3">
              <Label>Cities in {selectedCounty}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                {availableCities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={serviceAreas.includes(`${city}, AZ`)}
                      onCheckedChange={(checked) => {
                        if (isEditing) {
                          handleCityToggle(city)
                        }
                      }}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Service Areas Display */}
          {serviceAreas.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Service Areas ({serviceAreas.length})</Label>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span 
                    key={area} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>
            Select the areas where you provide insulation services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {['Attic', 'Walls', 'Basement', 'Crawl Space', 'Garage'].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={`service-${service}`}
                  checked={servicesOffered.includes(service.toLowerCase())}
                  onCheckedChange={(checked) => {
                    const serviceValue = service.toLowerCase()
                    if (checked) {
                      setServicesOffered(prev => [...prev, serviceValue])
                    } else {
                      setServicesOffered(prev => prev.filter(type => type !== serviceValue))
                    }
                  }}
                  disabled={!isEditing}
                />
                <Label htmlFor={`service-${service}`} className="text-sm font-normal">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Types of Insulation Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Types of Insulation Offered</CardTitle>
          <CardDescription>
            Select the types of insulation materials you work with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableInsulationTypes.map((insulationType) => (
              <div key={insulationType} className="flex items-center space-x-2">
                <Checkbox
                  id={insulationType}
                  checked={serviceTypes.includes(insulationType)}
                  onCheckedChange={() => isEditing && handleServiceTypeToggle(insulationType)}
                  disabled={!isEditing}
                />
                <Label htmlFor={insulationType} className="text-sm">
                  {insulationType}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Select your professional certifications and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableCertifications.map((certification) => (
              <div key={certification} className="flex items-center space-x-2">
                <Checkbox
                  id={certification}
                  checked={certifications.includes(certification)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCertifications(prev => [...prev, certification])
                    } else {
                      setCertifications(prev => prev.filter(cert => cert !== certification))
                    }
                  }}
                  disabled={!isEditing}
                />
                <Label htmlFor={certification} className="text-sm font-normal">
                  {certification}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
