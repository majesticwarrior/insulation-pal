'use client'

import { useState } from 'react'
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
import { ChevronLeft, ChevronRight, Home, Wrench, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { assignLeadToContractors } from '@/lib/lead-assignment'

const quoteSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required'),
  areas: z.array(z.string()).min(1, 'Please select at least one area'),
  insulationTypes: z.array(z.string()).min(1, 'Please select at least one insulation type'),
  additionalServices: z.array(z.string()).optional(),
  ceilingFanCount: z.string().optional(),
  projectType: z.enum(['residential', 'commercial']).optional(),
  atticInsulationDepth: z.string().optional(),
  quotePreference: z.enum(['random_three', 'choose_three']),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Email address is required'),
  customerPhone: z.string().min(10, 'Phone number is required and must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required and must be at least 5 digits')
})

type QuoteFormData = z.infer<typeof quoteSchema>

interface QuotePopupProps {
  isOpen: boolean
  onClose: () => void
}

const areas = [
  { id: 'attic', label: 'Attic' },
  { id: 'walls', label: 'Walls' },
  { id: 'basement', label: 'Basement' },
  { id: 'crawl_space', label: 'Crawl Space' }
]

const insulationTypes = [
  { id: 'blown_in', label: 'Blown-in' },
  { id: 'roll_batt', label: 'Roll & Batt' },
  { id: 'spray_foam', label: 'Spray Foam' },
  { id: 'foam_board', label: 'Foam Board' },
  { id: 'other', label: 'Other/Unsure' }
]

const additionalServices = [
  { id: 'energy_audit', label: 'Energy Audit' },
  { id: 'ceiling_fan_installation', label: 'Ceiling Fan Installation' },
  { id: 'air_sealing', label: 'Air Sealing' },
  { id: 'duct_sealing', label: 'Duct Sealing' },
  { id: 'insulation_removal', label: 'Insulation Removal' }
]

const atticInsulationDepths = [
  { id: '3_inches', label: '3 inches' },
  { id: '6_inches', label: '6 inches' },
  { id: '12_inches', label: '12 inches' }
]

const steps = [
  { id: 1, title: 'Home Size', icon: Home },
  { id: 2, title: 'Areas & Type', icon: Wrench },
  { id: 3, title: 'Contact Info', icon: Phone }
]

export function QuotePopup({ isOpen, onClose }: QuotePopupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      homeSize: '',
      areas: [],
      insulationTypes: [],
      additionalServices: [],
      ceilingFanCount: '',
      projectType: 'residential',
      atticInsulationDepth: '',
      quotePreference: 'random_three',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      city: '',
      state: 'AZ',
      zipCode: ''
    }
  })

  const nextStep = async () => {
    let fieldsToValidate: (keyof QuoteFormData)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['homeSize']
        break
      case 2:
        fieldsToValidate = ['areas', 'insulationTypes', 'quotePreference']
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
      
      // All leads now use random assignment - redirect to success page
      if (formData.quotePreference === 'choose_three') {
        // Redirect to success page since random assignment is now automatic
        onClose()
        router.push('/quote-success')
        return
      }
      
      // Enhanced debugging for Supabase configuration
      console.log('🔍 Supabase Configuration Check:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        supabaseInstance: !!supabase
      })
      
      // Check if we're in demo mode (no real Supabase connection)
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
                        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
      
      if (isDemoMode) {
        // Demo mode - simulate successful submission
        console.log('Demo Mode: Quote request submitted:', formData)
        console.log('🚨 Demo mode triggered due to missing/placeholder environment variables')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        
        toast.success('Quote request submitted successfully! (Demo Mode - Please set up Supabase environment variables)')
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
        quote_preference: formData.quotePreference,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      }

      // Add property_address if form includes address (defensive coding)
      if (formData.address) {
        ;(leadData as any).property_address = formData.address
      }

      console.log('📋 Submitting lead data:', leadData)

      // Test Supabase connection before attempting insert
      try {
        console.log('🔍 Testing connection to leads table...')
        const { data: testData, error: testError } = await (supabase as any)
          .from('leads')
          .select('id')
          .limit(1)
        
        console.log('🔍 Connection test result:', {
          data: testData,
          error: testError,
          errorKeys: testError ? Object.keys(testError) : [],
          errorStringified: JSON.stringify(testError, null, 2)
        })
        
        if (testError) {
          console.error('🚨 Supabase connection test failed:', testError)
          console.error('🚨 Error details:', {
            message: testError.message || 'No message',
            code: testError.code || 'No code',
            details: testError.details || 'No details',
            hint: testError.hint || 'No hint',
            status: testError.status || 'No status'
          })
          
          // Check if it's a "table doesn't exist" error
          if (testError.message?.includes('relation') && testError.message?.includes('does not exist')) {
            throw new Error(`Database table 'leads' does not exist. Please run the database migration script.`)
          }
          
          throw new Error(`Database connection failed: ${testError.message || 'Unknown error'}`)
        }
        
        console.log('✅ Supabase connection test passed, found', testData?.length || 0, 'records')
      } catch (connectionError: any) {
        console.error('🚨 Critical Supabase connection error:', connectionError)
        console.error('🚨 Error type:', typeof connectionError)
        console.error('🚨 Error constructor:', connectionError.constructor.name)
        
        // If it's our custom error, re-throw it
        if (connectionError.message?.includes('Database')) {
          throw connectionError
        }
        
        throw new Error(`Cannot connect to database. Please check your environment variables and database setup.`)
      }

      const { data: lead, error } = await (supabase as any)
        .from('leads')
        .insert(leadData)
        .select()
        .single()

      if (error) {
        console.error('🚨 Lead insertion error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      // Auto-assign lead to 3 contractors in the customer's city
      console.log('🎯 Auto-assigning lead to 3 contractors in:', formData.city, formData.state)
      await assignLeadToContractors(lead)
      
      toast.success('Quote request submitted successfully! Your request has been sent to contractors in your area.')
      onClose()
      form.reset()
      setCurrentStep(1)
    } catch (error) {
      console.error('Error submitting quote:', error)
      toast.error('Failed to submit quote request. Please try again.')
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

            {/* Attic Insulation Depth - only show if attic is selected */}
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

            {/* Ceiling Fan Count - only show if ceiling fan installation is selected */}
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

            <FormField
              control={form.control}
              name="quotePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">How would you like to receive quotes?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="random_three" id="random_three" />
                        <Label htmlFor="random_three" className="text-sm font-normal">
                          Our top 3 contractors in your area
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="choose_three" id="choose_three" />
                        <Label htmlFor="choose_three" className="text-sm font-normal">
                          You choose which 3 you would like quotes from
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">How can contractors reach you?</p>
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
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
                        <Input placeholder="AZ" {...field} value="AZ" readOnly className="bg-gray-50" />
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
          <DialogTitle className="text-center">Get Your Free Quote</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1 text-gray-600">{step.title}</span>
                {index < steps.length - 1 && (
                  <div className={`
                    absolute w-20 h-0.5 mt-5 ml-10
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                  `} style={{ zIndex: -1 }} />
                )}
              </div>
            )
          })}
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex items-center"
              >
                {currentStep === 3 ? (
                  isSubmitting ? 'Submitting...' : 'Submit Quote Request'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
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
