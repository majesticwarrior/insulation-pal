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
import {
  getCountiesByState,
  getCountyForCity,
  getCitiesForCountyId,
  makeCountyId,
  parseCountyId,
  getCountyById,
  getStatesWithCountyData
} from '@/lib/us-counties'
import { ReviewsBadge } from '@/components/dashboard/ReviewsBadge'
import { X } from 'lucide-react'
import { searchCities, USCity } from '@/lib/us-cities'
const STATE_OPTIONS = getStatesWithCountyData()

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
  certifications?: string[]
  bbb_accredited?: boolean
}

interface ProfileEditFormProps {
  contractor: Contractor
  onUpdate: (updatedContractor: Contractor) => void
}

interface CityOption {
  id: string
  name: string
  stateAbbr: string
  countyId: string
  countyName: string
  population: number
}

export function ProfileEditForm({ contractor, onUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // County and service area management
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [serviceAreas, setServiceAreas] = useState<string[]>([])
  const [serviceAreaState, setServiceAreaState] = useState<string>(() => {
    const candidate = (contractor.business_state || '').toUpperCase()
    if (candidate && getCountiesByState(candidate).length > 0) {
      return candidate
    }
    return STATE_OPTIONS[0]?.stateAbbr || candidate || 'AL'
  })
  const stateOptions = STATE_OPTIONS
  const countyOptions = getCountiesByState(serviceAreaState).map((county) => ({
    id: makeCountyId(county.stateAbbr, county.county),
    label: county.county,
    stateAbbr: county.stateAbbr
  }))
  const selectedCountyIdsForState = selectedCounties.filter(
    (id) => parseCountyId(id).stateAbbr === serviceAreaState
  )
  const selectedCountyNamesForState = selectedCountyIdsForState
    .map((id) => getCountyById(id)?.county)
    .filter((name): name is string => Boolean(name))
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
    contact_email: contractor.contact_email || '',
    bbb_accredited: contractor.bbb_accredited || false
  })

  const [servicesOffered, setServicesOffered] = useState<string[]>([])
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoMethod, setLogoMethod] = useState<'upload' | 'url'>('upload')
  
  // City autocomplete state
  const [citySuggestions, setCitySuggestions] = useState<USCity[]>([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)

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

  const PRIORITY_CITY_WHITELIST = new Set([
    'Tolleson',
    'Fountain Hills',
    'Carefree',
    'Ahwatukee',
    'Litchfield Park',
    'Sun City',
    'Sun City West',
    'Paradise Valley',
    'Laveen',
    'El Mirage',
    'Youngtown',
    'Cave Creek'
  ])

  // County and city handling functions
  const handleCountyToggle = (countyId: string) => {
    setSelectedCounties(prev => {
      if (prev.includes(countyId)) {
        const county = getCountyById(countyId)
        if (county) {
          setServiceAreas(areas =>
            areas.filter(area => {
              if (!area.endsWith(`, ${county.stateAbbr}`)) {
                return true
              }
              const cityName = area.split(',')[0].trim()
              return !county.cities.some(city => city.name === cityName)
            })
          )
        }
        return prev.filter(id => id !== countyId)
      }
      return [...prev, countyId]
    })
  }

  const handleCityToggle = (city: CityOption) => {
    const cityWithState = `${city.name}, ${city.stateAbbr}`
    setServiceAreas(prev =>
      prev.includes(cityWithState)
        ? prev.filter(area => area !== cityWithState)
        : [...prev, cityWithState]
    )
    setSelectedCounties(prev => {
      if (prev.includes(city.countyId)) {
        return prev
      }
      return [...prev, city.countyId]
    })
    const normalizedState = city.stateAbbr.toUpperCase()
    setServiceAreaState(normalizedState)
  }

  const availableCityOptions: CityOption[] = (() => {
    const cityMap = new Map<string, CityOption>()

    // Cities from selected counties
    selectedCounties.forEach(countyId => {
      const county = getCountyById(countyId)
      if (!county || county.stateAbbr !== serviceAreaState) {
        return
      }
      county.cities.forEach(city => {
        if (city.population < 40000 && !PRIORITY_CITY_WHITELIST.has(city.name)) {
          return
        }
        const key = `${city.name}|${county.stateAbbr}`
        if (!cityMap.has(key)) {
          cityMap.set(key, {
            id: key,
            name: city.name,
            stateAbbr: county.stateAbbr,
            countyId,
            countyName: county.county,
            population: city.population
          })
        }
      })
    })

    // Cities already selected (in case their counties aren't currently selected)
    serviceAreas.forEach(area => {
      const [cityName, stateAbbr = ''] = area.split(',').map(part => part.trim())
      const countyRecord = getCountyForCity(cityName, stateAbbr.toUpperCase())
      if (!countyRecord) {
        return
      }
      const countyId = makeCountyId(countyRecord.stateAbbr, countyRecord.county)
      const cityRecord = countyRecord.cities.find(city => city.name === cityName)
      if (!cityRecord) {
        return
      }
      if (cityRecord.population < 40000 && !PRIORITY_CITY_WHITELIST.has(cityName)) {
        return
      }
      const key = `${cityName}|${countyRecord.stateAbbr}`
      if (!cityMap.has(key)) {
        cityMap.set(key, {
          id: key,
          name: cityName,
          stateAbbr: countyRecord.stateAbbr,
          countyId,
          countyName: countyRecord.county,
          population: cityRecord.population
        })
      }
    })

    return Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  })()

  const availableCertifications = [
    'BBB Accreditation',
    'BPI Certified',
    'ENERGY STAR Partner',
    'Licensed, Bonded & Insured',
    'OSHA Safety Certified'
  ]

  useEffect(() => {
    loadContractorDetails()
  }, [contractor.id])

  // Update form data when contractor prop changes (e.g., after credit updates)
  useEffect(() => {
    console.log('🔄 ProfileEditForm contractor prop changed:', contractor)
    console.log('📝 Current formData before update:', formData)
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
      contact_email: contractor.contact_email || '',
      bbb_accredited: contractor.bbb_accredited || false
    })
    
    console.log('✅ Form data updated')
    console.log('📝 New formData after update:', {
      business_name: contractor.business_name || '',
      license_number: contractor.license_number || '',
      bio: contractor.bio || ''
    })

    const contractorState = (contractor.business_state || '').toUpperCase()
    if (contractorState && getCountiesByState(contractorState).length > 0) {
      setServiceAreaState(contractorState)
    }
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
        
        // Auto-detect counties from all cities
        const detectedCounties = new Set<string>()
        const detectedStates = new Set<string>()
        areas.forEach((area: any) => {
          const upperState = (area.state || '').toUpperCase()
          if (upperState) {
            detectedStates.add(upperState)
          }
          const county = getCountyForCity(area.city, upperState)
          if (county) {
            detectedCounties.add(makeCountyId(county.stateAbbr, county.county))
          }
        })
        console.log('🏛️ Detected counties:', Array.from(detectedCounties))
        if (detectedCounties.size > 0) {
          setSelectedCounties(Array.from(detectedCounties))
          console.log('🏛️ Set counties:', Array.from(detectedCounties))
        }
        if (detectedStates.size > 0) {
          const preferredState = (contractor.business_state || '').toUpperCase()
          const stateToUse = preferredState && detectedStates.has(preferredState)
            ? preferredState
            : Array.from(detectedStates)[0]
          if (stateToUse && getCountiesByState(stateToUse).length > 0) {
            setServiceAreaState(stateToUse)
          }
        }
      } else {
        console.log('📍 No service areas found')
      }

      // Load services offered and insulation types with error handling
      try {
        console.log('🔧 Loading contractor services...')
        const { data: services, error: servicesError } = await (supabase as any)
          .from('contractor_services')
          .select('service_type, insulation_types')
          .eq('contractor_id', contractor.id)

        if (servicesError) {
          console.warn('⚠️ Failed to load contractor services (RLS issue):', servicesError)
          // Set empty defaults
          setServicesOffered([])
          setServiceTypes([])
        } else if (services && services.length > 0) {
          console.log('✅ Loaded contractor services:', services)
          // Extract unique service areas
          setServicesOffered(services.map((service: any) => service.service_type))
          
          // Extract unique insulation types from all services
          const allInsulationTypes = services.reduce((acc: string[], service: any) => {
            if (service.insulation_types && Array.isArray(service.insulation_types)) {
              return [...acc, ...service.insulation_types]
            }
            return acc
          }, [])
          setServiceTypes(Array.from(new Set(allInsulationTypes))) // Remove duplicates
        } else {
          console.log('📝 No existing services found for contractor')
          setServicesOffered([])
          setServiceTypes([])
        }
      } catch (error) {
        console.warn('⚠️ Error loading contractor services:', error)
        setServicesOffered([])
        setServiceTypes([])
      }

      // Load project types from contractor data
      try {
        const { data: contractorData, error: contractorError } = await (supabase as any)
          .from('contractors')
          .select('project_types')
          .eq('id', contractor.id)
          .single()

        if (!contractorError && contractorData?.project_types) {
          console.log('✅ Loaded project types:', contractorData.project_types)
          setProjectTypes(Array.isArray(contractorData.project_types) ? contractorData.project_types : [])
        } else {
          console.log('📝 No existing project types found')
          setProjectTypes([])
        }
      } catch (error) {
        console.warn('⚠️ Error loading project types:', error)
        setProjectTypes([])
      }

      // Load certifications from contractor data
      if (contractor.certifications && Array.isArray(contractor.certifications)) {
        console.log('📜 Loading existing certifications:', contractor.certifications)
        setCertifications(contractor.certifications)
      } else {
        console.log('📜 No existing certifications found')
        setCertifications([])
      }

    } catch (error) {
      console.error('Error loading contractor details:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Handle city autocomplete
    if (field === 'business_city') {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      if (value.length > 0) {
        // Search US cities with population 50,000+
        const suggestions = searchCities(value, 10)
        setCitySuggestions(suggestions)
        setShowCitySuggestions(true)
      } else {
        setCitySuggestions([])
        setShowCitySuggestions(false)
      }
    } else if (field === 'business_state') {
      // Handle state autocomplete - auto-capitalize state abbreviation
      const upperValue = value.toUpperCase().slice(0, 2) // Limit to 2 characters
    setFormData(prev => ({ ...prev, [field]: upperValue }))
    if (upperValue && getCountiesByState(upperValue).length > 0) {
      setServiceAreaState(upperValue)
    }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }
  
  const handleCitySelect = (city: USCity) => {
    setFormData(prev => ({
      ...prev,
      business_city: city.name,
      business_state: city.stateAbbr // Auto-populate state abbreviation from city data
    }))
    setShowCitySuggestions(false)
    setCitySuggestions([])
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
      console.log('📋 Current contractor object:', contractor)
      console.log('🚀 About to update contractors table...')
      
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
        certifications: certifications, // Add certifications to save data
        // Auto-verify license when license number is provided (for green checkmark)
        license_verified: formData.license_number ? true : false,
        // Only set insurance_verified when "Licensed, Bonded & Insured" certification is checked
        insurance_verified: certifications.includes('Licensed, Bonded & Insured'),
        // Set BBB accredited when certification is checked
        bbb_accredited: certifications.includes('BBB Accreditation'),
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

      // Update service areas with error handling
      try {
        console.log('🏠 Updating service areas...')
        
        // First delete existing areas
        const { error: deleteAreasError } = await (supabase as any)
          .from('contractor_service_areas')
          .delete()
          .eq('contractor_id', contractor.id)

        if (deleteAreasError && deleteAreasError.code !== 'PGRST116') { // PGRST116 = no rows found (OK)
          console.warn('⚠️ Service areas delete failed (might be OK):', deleteAreasError)
        }

        // Insert new areas
        if (serviceAreas.length > 0) {
          const areaInserts = serviceAreas.map(area => {
            const [city, state] = area.split(', ')
            const normalizedState = (state?.trim() || serviceAreaState || contractor.business_state || '').toUpperCase()
            return {
              contractor_id: contractor.id,
              city: city.trim(),
              state: normalizedState
            }
          })

          const { error: insertAreasError } = await (supabase as any)
            .from('contractor_service_areas')
            .insert(areaInserts)

          if (insertAreasError) {
            console.warn('⚠️ Service areas insert failed:', insertAreasError)
          } else {
            console.log('✅ Service areas updated successfully')
          }
        }
      } catch (error) {
        console.warn('⚠️ Service areas update failed, continuing with other updates:', error)
      }

      // Update services offered and insulation types with error handling
      try {
        console.log('🔧 Updating services offered...')
        
        // First delete existing services
        const { error: deleteServicesError } = await (supabase as any)
          .from('contractor_services')
          .delete()
          .eq('contractor_id', contractor.id)

        if (deleteServicesError && deleteServicesError.code !== 'PGRST116') { // PGRST116 = no rows found (OK)
          console.warn('⚠️ Services delete failed (might be OK):', deleteServicesError)
        }

        // Insert new services offered (areas like attic, wall, basement, etc.)
        if (servicesOffered.length > 0) {
          const serviceInserts = servicesOffered.map(serviceArea => ({
            contractor_id: contractor.id,
            service_type: serviceArea,
            insulation_types: serviceTypes, // Include insulation types for each service area
            starting_price_per_sqft: 1.50 // Default price
          }))

          const { error: insertServicesError } = await (supabase as any)
            .from('contractor_services')
            .insert(serviceInserts)

          if (insertServicesError) {
            console.warn('⚠️ Services insert failed:', insertServicesError)
          } else {
            console.log('✅ Services offered updated successfully')
          }
        }
      } catch (error) {
        console.warn('⚠️ Services update failed, continuing with other updates:', error)
      }

      // Update project types
      try {
        console.log('🏗️ Updating project types...')
        const { error: projectTypesError } = await (supabase as any)
          .from('contractors')
          .update({ project_types: projectTypes })
          .eq('id', contractor.id)

        if (projectTypesError) {
          console.warn('⚠️ Project types update failed (field may not exist):', projectTypesError)
        } else {
          console.log('✅ Project types updated successfully')
        }
      } catch (error) {
        console.warn('⚠️ Project types update failed, continuing with other updates:', error)
      }

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
        business_zip: updateData.business_zip || undefined,
        certifications: certifications
      }

      console.log('🎯 Updated contractor object created:', updatedContractor)
      console.log('📞 About to call onUpdate callback...')

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

      console.log('📞 Calling onUpdate with updated contractor:', updatedContractor)
      onUpdate(updatedContractor)
      console.log('✅ onUpdate callback completed')
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      console.log('🎉 Profile save process completed successfully')

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
      contact_email: contractor.contact_email || '',
      bbb_accredited: contractor.bbb_accredited || false
    })
    setLogoFile(null)
    setLogoPreview(null)
    setLogoUrl('')
    setLogoMethod('upload')
    setServicesOffered([])
    setServiceTypes([])
    setServiceAreas([])
    setCertifications(contractor.certifications && Array.isArray(contractor.certifications) ? contractor.certifications : [])
    setSelectedCounties([])
    setServiceAreaState(prev => {
      const contractorState = (contractor.business_state || '').toUpperCase()
      if (contractorState && getCountiesByState(contractorState).length > 0) {
        return contractorState
      }
      return prev
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
              <Label htmlFor="license_number">License Number (ROC#)</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., ROC123456"
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
              <div className="relative">
                <Label htmlFor="business_city">City</Label>
                <Input
                  id="business_city"
                  value={formData.business_city}
                  onChange={(e) => handleInputChange('business_city', e.target.value)}
                  onFocus={() => {
                    if (formData.business_city && formData.business_city.length > 0) {
                      const suggestions = searchCities(formData.business_city, 10)
                      setCitySuggestions(suggestions)
                      setShowCitySuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click events
                    setTimeout(() => setShowCitySuggestions(false), 200)
                  }}
                  disabled={!isEditing}
                  placeholder="Start typing city name..."
                />
                {showCitySuggestions && citySuggestions.length > 0 && isEditing && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {citySuggestions.map((city) => (
                      <div
                        key={`${city.name}-${city.stateAbbr}`}
                        onClick={() => handleCitySelect(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.state}, {city.stateAbbr}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="business_state">State</Label>
                <Input
                  id="business_state"
                  value={formData.business_state}
                  onChange={(e) => handleInputChange('business_state', e.target.value)}
                  disabled={!isEditing}
                  placeholder="AZ"
                  maxLength={2}
                />
                {isEditing && !formData.business_state && (
                  <p className="text-xs text-gray-500 mt-1">Auto-filled when city selected</p>
                )}
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
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  *By selecting Text Messages, you are giving InsulationPal consent to send marketing messages.
                </p>
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
            Select one or more counties, then choose the cities where you provide insulation services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* State & County Selection */}
          <div className="space-y-3">
            <Label htmlFor="service-area-state">Select State</Label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <Select
                value={serviceAreaState}
                onValueChange={(value) => {
                  setServiceAreaState(value)
                }}
              >
                <SelectTrigger id="service-area-state" className="w-full sm:w-60">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((state) => (
                    <SelectItem key={state.stateAbbr} value={state.stateAbbr}>
                      {state.state} ({state.stateAbbr})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">
                Showing counties for {serviceAreaState}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              You can select multiple counties to choose cities from different areas.
            </p>
            {countyOptions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                No counties available for this state yet. Please choose a different state.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border rounded-lg p-4">
                {countyOptions.map((county) => (
                  <div key={county.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`county-${county.id}`}
                      checked={selectedCounties.includes(county.id)}
                      onCheckedChange={() => {
                        if (isEditing) {
                          handleCountyToggle(county.id)
                        }
                      }}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={`county-${county.id}`} className="text-sm font-normal cursor-pointer">
                      {county.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cities Selection */}
          {selectedCountyIdsForState.length > 0 && (
            <div className="space-y-3">
              <Label>Cities in Selected Counties</Label>
              {selectedCountyNamesForState.length > 1 && (
                <p className="text-sm text-gray-600">
                  Cities from: {selectedCountyNamesForState.join(', ')}
                </p>
              )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={!isEditing || availableCityOptions.length === 0}
                onClick={() => {
                  if (!isEditing) return
                  const newAreas = new Set(serviceAreas)
                  availableCityOptions.forEach(city => {
                    newAreas.add(`${city.name}, ${city.stateAbbr}`)
                  })
                  setServiceAreas(Array.from(newAreas))
                  setSelectedCounties(prev => {
                    const newSet = new Set(prev)
                    availableCityOptions.forEach(city => {
                      newSet.add(city.countyId)
                    })
                    return Array.from(newSet)
                  })
                }}
              >
                Select All
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!isEditing || availableCityOptions.length === 0}
                onClick={() => {
                  if (!isEditing) return
                  const availableKeys = new Set(
                    availableCityOptions.map(city => `${city.name}, ${city.stateAbbr}`)
                  )
                  setServiceAreas(prev =>
                    prev.filter(area => !availableKeys.has(area))
                  )
                }}
              >
                Deselect All
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Selected: <span className="font-medium text-[#0a4768]">{serviceAreas.length}</span>
            </p>
          </div>

          {availableCityOptions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
              No cities found for the selected counties. Try searching by city below.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {availableCityOptions.map((city) => (
                <div key={city.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`city-${city.id}`}
                    checked={serviceAreas.includes(`${city.name}, ${city.stateAbbr}`)}
                    onCheckedChange={() => {
                      if (isEditing) {
                        handleCityToggle(city)
                      }
                    }}
                    disabled={!isEditing}
                  />
                  <Label htmlFor={`city-${city.id}`} className="text-sm">
                    {city.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
            </div>
          )}

          {/* Selected Service Areas Display */}
          {serviceAreas.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Service Areas ({serviceAreas.length})</Label>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    <span>{area}</span>
                    {isEditing && (
                      <button
                        type="button"
                        className="text-blue-700 hover:text-blue-900"
                        onClick={() => {
                          setServiceAreas(prev => prev.filter(item => item !== area))
                        }}
                        aria-label={`Remove ${area} from service areas`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Types */}
      <Card>
        <CardHeader>
          <CardTitle>Project Types</CardTitle>
          <CardDescription>
            Select the types of projects you work on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="project-residential"
                checked={projectTypes.includes('residential')}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProjectTypes(prev => [...prev, 'residential'])
                  } else {
                    setProjectTypes(prev => prev.filter(type => type !== 'residential'))
                  }
                }}
                disabled={!isEditing}
              />
              <Label htmlFor="project-residential" className="text-sm font-normal">
                Residential
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="project-commercial"
                checked={projectTypes.includes('commercial')}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProjectTypes(prev => [...prev, 'commercial'])
                  } else {
                    setProjectTypes(prev => prev.filter(type => type !== 'commercial'))
                  }
                }}
                disabled={!isEditing}
              />
              <Label htmlFor="project-commercial" className="text-sm font-normal">
                Commercial
              </Label>
            </div>
          </div>
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

      {/* Reviews Badge */}
      <ReviewsBadge contractorId={contractor.id} businessName={contractor.business_name} />
    </div>
  )
}
