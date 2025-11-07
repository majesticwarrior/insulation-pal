'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ChevronLeft, ChevronRight, Home, Wrench, Phone, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { assignLeadToSingleContractor } from '@/lib/direct-lead-assignment'
import { getCustomerData, parseAddress } from '@/lib/customer-data-storage'

const directQuoteSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required'),
  areas: z.array(z.string()).min(1, 'Please select at least one area'),
  insulationTypes: z.array(z.string()).min(1, 'Please select at least one insulation type'),
  additionalServices: z.array(z.string()).optional(),
  ceilingFanCount: z.string().optional(),
  projectType: z.enum(['residential', 'commercial']).optional(),
  atticInsulationDepth: z.string().optional(),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Email address is required'),
  customerPhone: z.string().min(10, 'Phone number is required and must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required and must be at least 5 digits')
})

type DirectQuoteFormData = z.infer<typeof directQuoteSchema>

interface DirectQuotePopupProps {
  isOpen: boolean
  onClose: () => void
  contractorId: string
  contractorName: string
}

const areas = [
  { id: 'attic', label: 'Attic' },
  { id: 'walls', label: 'Walls' },
  { id: 'basement', label: 'Basement' },
  { id: 'crawl_space', label: 'Crawl Space' },
  { id: 'garage', label: 'Garage' }
]

const insulationTypes = [
  { id: 'blown_in', label: 'Blown-in' },
  { id: 'roll_batt', label: 'Roll & Batt' },
  { id: 'spray_foam', label: 'Spray Foam' },
  { id: 'foam_board', label: 'Foam Board' },
  { id: 'other', label: 'Other/Unsure' }
]

const atticInsulationDepths = [
  { id: '3_inches', label: '3 inches' },
  { id: '6_inches', label: '6 inches' },
  { id: '12_inches', label: '12 inches' }
]

const additionalServices = [
  { id: 'energy_audit', label: 'Energy Audit' },
  { id: 'ceiling_fan_installation', label: 'Ceiling Fan Installation' },
  { id: 'air_sealing', label: 'Air Sealing' },
  { id: 'duct_sealing', label: 'Duct Sealing' },
  { id: 'insulation_removal', label: 'Insulation Removal' }
]

const steps = [
  { id: 1, title: 'Home Size', icon: Home },
  { id: 2, title: 'Areas & Type', icon: Wrench },
  { id: 3, title: 'Contact Info', icon: Phone }
]

export function DirectQuotePopup({ isOpen, onClose, contractorId, contractorName }: DirectQuotePopupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<DirectQuoteFormData>({
    resolver: zodResolver(directQuoteSchema),
    defaultValues: {
      homeSize: '',
      areas: [],
      insulationTypes: [],
      additionalServices: [],
      ceilingFanCount: '',
      projectType: 'residential',
      atticInsulationDepth: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      city: '',
      state: 'AZ',
      zipCode: ''
    }
  })

  // Auto-populate form with stored customer data when popup opens
  useEffect(() => {
    if (isOpen) {
      const storedData = getCustomerData()
      
      if (storedData.email) {
        form.setValue('customerEmail', storedData.email)
      }
      
      if (storedData.address) {
        const parsedAddress = parseAddress(storedData.address)
        form.setValue('address', parsedAddress.address)
        
        if (parsedAddress.city) {
          form.setValue('city', parsedAddress.city)
        }
        if (parsedAddress.state) {
          form.setValue('state', parsedAddress.state)
        }
        if (parsedAddress.zipCode) {
          form.setValue('zipCode', parsedAddress.zipCode)
        }
      }
    }
  }, [isOpen, form])

  const nextStep = async () => {
    let fieldsToValidate: (keyof DirectQuoteFormData)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['homeSize']
        break
      case 2:
        fieldsToValidate = ['areas', 'insulationTypes']
        break
      case 3:
        fieldsToValidate = ['customerName', 'customerEmail', 'customerPhone', 'address', 'city', 'state', 'zipCode']
        break
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (isValid && currentStep === 3) {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = form.getValues()
      
      // Check if we're in demo mode
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
                        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
      
      if (isDemoMode) {
        console.log('Demo Mode: Direct quote request submitted:', formData)
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success(`Quote request sent to ${contractorName}! (Demo Mode)`)
        onClose()
        form.reset()
        setCurrentStep(1)
        return
      }
      
      // Insert lead into database
      const leadData = {
        home_size_sqft: parseInt(formData.homeSize),
        areas_needed: formData.areas,
        insulation_types: formData.insulationTypes,
        additional_services: formData.additionalServices || [],
        ceiling_fan_count: formData.ceilingFanCount ? parseInt(formData.ceilingFanCount) : null,
        project_type: formData.projectType || 'residential',
        attic_insulation_depth: formData.atticInsulationDepth || null,
        quote_preference: 'random_three', // Not used for direct quotes, but required by schema
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        property_address: formData.address
      }

      console.log('📋 Submitting direct quote lead data:', leadData)

      // Insert lead
      const { data: lead, error } = await (supabase as any)
        .from('leads')
        .insert(leadData)
        .select()
        .single()

      if (error) {
        console.error('🚨 Lead insertion error:', error)
        toast.error('Failed to submit quote request. Please try again.')
        return
      }

      console.log('✅ Lead created:', lead.id)

      // Assign lead directly to the specific contractor
      await assignLeadToSingleContractor(lead, contractorId)

      toast.success(`Quote request sent to ${contractorName}! They will contact you soon.`)
      onClose()
      form.reset()
      setCurrentStep(1)
      
      // Redirect to success page
      router.push('/quote-success')

    } catch (error: any) {
      console.error('Error submitting direct quote:', error)
      toast.error(error.message || 'Failed to submit quote request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAreaChange = (areaId: string, checked: boolean) => {
    const currentAreas = form.getValues('areas')
    if (checked) {
      form.setValue('areas', [...currentAreas, areaId])
    } else {
      form.setValue('areas', currentAreas.filter(id => id !== areaId))
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

  const handleAdditionalServiceChange = (serviceId: string, checked: boolean) => {
    const currentServices = form.getValues('additionalServices') || []
    if (checked) {
      form.setValue('additionalServices', [...currentServices, serviceId])
    } else {
      form.setValue('additionalServices', currentServices.filter(id => id !== serviceId))
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">How big is your home?</h3>
              <p className="text-gray-600">Enter your home's square footage</p>
            </div>
            <FormField
              control={form.control}
              name="homeSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Footage</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 2500"
                      type="number"
                      {...field}
                      className="text-center text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Wrench className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">What do you need?</h3>
              <p className="text-gray-600">Select the areas and insulation types</p>
            </div>

            <div>
              <Label className="text-base font-medium">Areas needing insulation:</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={area.id}
                      checked={form.watch('areas')?.includes(area.id)}
                      onCheckedChange={(checked) => handleAreaChange(area.id, checked as boolean)}
                    />
                    <Label htmlFor={area.id} className="text-sm font-normal">{area.label}</Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.areas && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.areas.message}</p>
              )}
            </div>

            <div>
              <Label className="text-base font-medium">Type of insulation:</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
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

            {/* Attic Insulation Depth */}
            {form.watch('areas')?.includes('attic') && (
              <div>
                <Label className="text-base font-medium">Attic Insulation Depth:</Label>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {atticInsulationDepths.map((depth) => (
                    <div key={depth.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={depth.id}
                        checked={form.watch('atticInsulationDepth') === depth.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue('atticInsulationDepth', depth.id)
                          } else {
                            form.setValue('atticInsulationDepth', '')
                          }
                        }}
                      />
                      <Label htmlFor={depth.id} className="text-sm font-normal">{depth.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Type */}
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Project Type:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="residential" id="residential" />
                        <Label htmlFor="residential" className="text-sm font-normal">
                          Residential
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial" className="text-sm font-normal">
                          Commercial
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Services */}
            <div>
              <Label className="text-base font-medium">Additional Services:</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {additionalServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={form.watch('additionalServices')?.includes(service.id)}
                      onCheckedChange={(checked) => handleAdditionalServiceChange(service.id, checked as boolean)}
                    />
                    <Label htmlFor={service.id} className="text-sm font-normal">{service.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ceiling Fan Count */}
            {form.watch('additionalServices')?.includes('ceiling_fan_installation') && (
              <FormField
                control={form.control}
                name="ceilingFanCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many ceiling fans?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 3"
                        type="number"
                        {...field}
                        className="text-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">How can {contractorName} reach you?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Phoenix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="AZ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="85001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Get Quote from {contractorName}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1 ${
                            isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-1 flex-1 mx-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="mb-6">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : currentStep === 3 ? (
                  'Submit Quote Request'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

