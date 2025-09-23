'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Contractor {
  id: string
  business_name: string
  license_number?: string
  phone?: string
  bio?: string
  website_url?: string
  founded_year?: number
  employee_count?: number
  business_address?: string
  business_city?: string
  business_state?: string
  business_zip?: string
  credits: number
}

interface ProfileEditFormProps {
  contractor: Contractor
  onUpdate: (updatedContractor: Contractor) => void
}

export function ProfileEditForm({ contractor, onUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    business_name: contractor.business_name || '',
    license_number: contractor.license_number || '',
    phone: contractor.phone || '',
    bio: contractor.bio || '',
    website_url: contractor.website_url || '',
    founded_year: contractor.founded_year?.toString() || '',
    employee_count: contractor.employee_count?.toString() || '',
    business_address: contractor.business_address || '',
    business_city: contractor.business_city || '',
    business_state: contractor.business_state || '',
    business_zip: contractor.business_zip || ''
  })

  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [newServiceArea, setNewServiceArea] = useState('')

  const availableServiceTypes = [
    'attic',
    'wall',
    'basement',
    'crawl_space',
    'commercial'
  ]

  const availableInsulationTypes = [
    'fiberglass',
    'cellulose',
    'spray_foam',
    'rigid_foam',
    'mineral_wool',
    'recycled_denim'
  ]

  useEffect(() => {
    loadContractorDetails()
  }, [contractor.id])

  const loadContractorDetails = async () => {
    try {
      // Load service areas
      const { data: areas } = await (supabase as any)
        .from('contractor_service_areas')
        .select('city, state')
        .eq('contractor_id', contractor.id)

      if (areas) {
        setServiceAreas(areas.map((area: any) => `${area.city}, ${area.state}`))
      }

      // Load service types
      const { data: services } = await (supabase as any)
        .from('contractor_services')
        .select('service_type')
        .eq('contractor_id', contractor.id)

      if (services) {
        setServiceTypes(services.map((service: any) => service.service_type))
      }

    } catch (error) {
      console.error('Error loading contractor details:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceTypeToggle = (serviceType: string) => {
    setServiceTypes(prev => 
      prev.includes(serviceType)
        ? prev.filter(type => type !== serviceType)
        : [...prev, serviceType]
    )
  }

  const addServiceArea = () => {
    if (newServiceArea.trim() && !serviceAreas.includes(newServiceArea.trim())) {
      setServiceAreas(prev => [...prev, newServiceArea.trim()])
      setNewServiceArea('')
    }
  }

  const removeServiceArea = (area: string) => {
    setServiceAreas(prev => prev.filter(a => a !== area))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update contractor profile
      const updateData = {
        business_name: formData.business_name,
        license_number: formData.license_number || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
        website_url: formData.website_url || null,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        business_address: formData.business_address || null,
        business_city: formData.business_city || null,
        business_state: formData.business_state || null,
        business_zip: formData.business_zip || null,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await (supabase as any)
        .from('contractors')
        .update(updateData)
        .eq('id', contractor.id)

      if (updateError) throw updateError

      // Update service areas
      // First delete existing areas
      await (supabase as any)
        .from('contractor_service_areas')
        .delete()
        .eq('contractor_id', contractor.id)

      // Insert new areas
      if (serviceAreas.length > 0) {
        const areaInserts = serviceAreas.map(area => {
          const [city, state] = area.split(', ')
          return {
            contractor_id: contractor.id,
            city: city.trim(),
            state: state?.trim() || 'AZ'
          }
        })

        await (supabase as any)
          .from('contractor_service_areas')
          .insert(areaInserts)
      }

      // Update service types
      // First delete existing services
      await (supabase as any)
        .from('contractor_services')
        .delete()
        .eq('contractor_id', contractor.id)

      // Insert new services
      if (serviceTypes.length > 0) {
        const serviceInserts = serviceTypes.map(serviceType => ({
          contractor_id: contractor.id,
          service_type: serviceType,
          starting_price_per_sqft: 1.50 // Default price
        }))

        await (supabase as any)
          .from('contractor_services')
          .insert(serviceInserts)
      }

      // Update local contractor data
      const updatedContractor = {
        ...contractor,
        ...updateData,
        founded_year: updateData.founded_year,
        employee_count: updateData.employee_count
      }

      onUpdate(updatedContractor)
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      business_name: contractor.business_name || '',
      license_number: contractor.license_number || '',
      phone: contractor.phone || '',
      bio: contractor.bio || '',
      website_url: contractor.website_url || '',
      founded_year: contractor.founded_year?.toString() || '',
      employee_count: contractor.employee_count?.toString() || '',
      business_address: contractor.business_address || '',
      business_city: contractor.business_city || '',
      business_state: contractor.business_state || '',
      business_zip: contractor.business_zip || ''
    })
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                disabled={!isEditing}
                placeholder="https://yourwebsite.com"
              />
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
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Manage the cities and areas where you provide services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <div className="flex space-x-2">
              <Input
                value={newServiceArea}
                onChange={(e) => setNewServiceArea(e.target.value)}
                placeholder="Enter city, state (e.g., Phoenix, AZ)"
                onKeyPress={(e) => e.key === 'Enter' && addServiceArea()}
              />
              <Button onClick={addServiceArea} type="button">
                Add Area
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2">
                <span>{area}</span>
                {isEditing && (
                  <button
                    onClick={() => removeServiceArea(area)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Types */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>
            Select the types of insulation services you provide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableServiceTypes.map((serviceType) => (
              <div key={serviceType} className="flex items-center space-x-2">
                <Checkbox
                  id={serviceType}
                  checked={serviceTypes.includes(serviceType)}
                  onCheckedChange={() => isEditing && handleServiceTypeToggle(serviceType)}
                  disabled={!isEditing}
                />
                <Label htmlFor={serviceType} className="capitalize">
                  {serviceType.replace('_', ' ')} Insulation
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
