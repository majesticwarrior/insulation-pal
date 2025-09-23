'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'

const contractorSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  establishedDate: z.string().optional(),
  county: z.string().min(1, 'County is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  bbbAccredited: z.boolean(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  about: z.string().optional(),
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  insulationTypes: z.array(z.string()).min(1, 'Please select at least one insulation type'),
  serviceAreas: z.array(z.string()).min(1, 'Please select at least one service area'),
  leadPreference: z.enum(['email', 'text', 'both']),
  exclusiveLeadsInterested: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ContractorFormData = z.infer<typeof contractorSchema>

const services = [
  { id: 'attic', label: 'Attic Insulation' },
  { id: 'basement', label: 'Basement Insulation' },
  { id: 'wall', label: 'Wall Insulation' },
  { id: 'crawl_space', label: 'Crawl Space Insulation' },
  { id: 'garage', label: 'Garage Insulation' }
]

const insulationTypes = [
  { id: 'blown_in', label: 'Blown-in Insulation' },
  { id: 'spray_foam', label: 'Spray Foam Insulation' },
  { id: 'roll_batt', label: 'Roll & Batt Insulation' },
  { id: 'foam_board', label: 'Foam Board Insulation' },
  { id: 'radiant_barrier', label: 'Radiant Barrier Insulation' }
]

const arizonaCities = [
  'Anthem', 'Apache Junction', 'Buckeye', 'Chandler', 'Gilbert',
  'Glendale', 'Goodyear', 'Litchfield Park', 'Mesa', 'Peoria',
  'Phoenix', 'Queen Creek', 'Scottsdale', 'Sun City', 'Surprise', 'Tempe'
]

interface ContractorRegistrationProps {
  onSuccess?: () => void
}

export function ContractorRegistration({ onSuccess }: ContractorRegistrationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      establishedDate: '',
      county: 'Maricopa',
      licenseNumber: '',
      bbbAccredited: false,
      phone: '',
      about: '',
      services: [],
      insulationTypes: [],
      serviceAreas: [],
      leadPreference: 'email',
      exclusiveLeadsInterested: false
    }
  })

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = form.getValues('services')
    if (checked) {
      form.setValue('services', [...currentServices, serviceId])
    } else {
      form.setValue('services', currentServices.filter(id => id !== serviceId))
    }
  }

  const handleInsulationTypeChange = (typeId: string, checked: boolean) => {
    const currentTypes = form.getValues('insulationTypes')
    if (checked) {
      form.setValue('insulationTypes', [...currentTypes, typeId])
    } else {
      form.setValue('insulationTypes', currentTypes.filter(id => id !== typeId))
    }
  }

  const handleServiceAreaChange = (areaId: string, checked: boolean) => {
    const currentAreas = form.getValues('serviceAreas')
    if (checked) {
      form.setValue('serviceAreas', [...currentAreas, areaId])
    } else {
      form.setValue('serviceAreas', currentAreas.filter(id => id !== areaId))
    }
  }

  const onSubmit = async (data: ContractorFormData) => {
    setIsSubmitting(true)
    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(data.password, 12)

      // Insert contractor
      const { data: contractor, error: contractorError } = await (supabase as any)
        .from('contractors')
        .insert({
          email: data.email,
          password_hash: passwordHash,
          business_name: data.businessName,
          established_date: data.establishedDate || null,
          county: data.county,
          license_number: data.licenseNumber || null,
          bbb_accredited: data.bbbAccredited,
          phone: data.phone,
          about: data.about || null,
          lead_preference: data.leadPreference,
          exclusive_leads_interested: data.exclusiveLeadsInterested,
          status: 'pending'
        })
        .select()
        .single()

      if (contractorError) throw contractorError

      // Insert services
      const serviceInserts = data.services.map(service => ({
        contractor_id: contractor.id,
        service_type: service as any
      }))
      
      if (serviceInserts.length > 0) {
        const { error: servicesError } = await (supabase as any)
          .from('contractor_services')
          .insert(serviceInserts)
        
        if (servicesError) throw servicesError
      }

      // Insert insulation types
      const insulationInserts = data.insulationTypes.map(type => ({
        contractor_id: contractor.id,
        insulation_type: type as any
      }))
      
      if (insulationInserts.length > 0) {
        const { error: insulationError } = await (supabase as any)
          .from('contractor_insulation_types')
          .insert(insulationInserts)
        
        if (insulationError) throw insulationError
      }

      // Insert service areas
      const areaInserts = data.serviceAreas.map(area => ({
        contractor_id: contractor.id,
        city: area
      }))
      
      if (areaInserts.length > 0) {
        const { error: areasError } = await (supabase as any)
          .from('contractor_service_areas')
          .insert(areaInserts)
        
        if (areasError) throw areasError
      }

      toast.success('Registration submitted successfully! We will review your application and get back to you soon.')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[#0a4768]">Join Insulation Pal</CardTitle>
          <CardDescription>
            Register your insulation business and start receiving qualified leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="contractor@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Insulation Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="establishedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Date</FormLabel>
                        <FormControl>
                          <Input placeholder="YYYY-MM-DD" type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County *</FormLabel>
                        <FormControl>
                          <Input placeholder="Maricopa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="License #" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="bbbAccredited"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>BBB Accredited</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Your Business</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your business, experience, and what sets you apart..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Services Offered */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Services Offered *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={form.watch('services')?.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                      />
                      <Label htmlFor={service.id} className="text-sm font-normal">{service.label}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.services && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.services.message}</p>
                )}
              </div>

              <Separator />

              {/* Insulation Types */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Types of Insulation Offered *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {insulationTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={form.watch('insulationTypes')?.includes(type.id)}
                        onCheckedChange={(checked) => handleInsulationTypeChange(type.id, checked as boolean)}
                      />
                      <Label htmlFor={type.id} className="text-sm font-normal">{type.label}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.insulationTypes && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.insulationTypes.message}</p>
                )}
              </div>

              <Separator />

              {/* Service Areas */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Service Areas (Maricopa County) *</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {arizonaCities.map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={city}
                        checked={form.watch('serviceAreas')?.includes(city)}
                        onCheckedChange={(checked) => handleServiceAreaChange(city, checked as boolean)}
                      />
                      <Label htmlFor={city} className="text-sm font-normal">{city}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.serviceAreas && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.serviceAreas.message}</p>
                )}
              </div>

              <Separator />

              {/* Lead Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lead Preferences</h3>
                
                <FormField
                  control={form.control}
                  name="leadPreference"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>How would you like to receive leads?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="text" id="text" />
                            <Label htmlFor="text">Text Message</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">Both Email and Text</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exclusiveLeadsInterested"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Interested in exclusive leads (premium cost)?
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          Exclusive leads are only sent to one contractor instead of three, at a higher rate.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
