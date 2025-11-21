'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ChevronLeft, ChevronRight, Home, Wrench, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getCustomerData, parseAddress } from '@/lib/customer-data-storage'
import { quoteSchema, QuoteFormData } from '@/lib/schemas/quote'
import { trackQuoteSubmissionConversion } from '@/lib/google-ads-conversion'

interface QuotePopupProps {
  isOpen: boolean
  onClose: () => void
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
        
        // Track Google Ads conversion
        trackQuoteSubmissionConversion('standard')
        
        onClose()
        router.push('/quote-success')
        return
      }
      
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
        
        // Track Google Ads conversion (works even in demo mode)
        trackQuoteSubmissionConversion('standard')
        
        onClose()
        form.reset()
        setCurrentStep(1)
        return
      }
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const responseBody = await response.json().catch(async () => {
        const fallbackText = await response.text().catch(() => '')
        return fallbackText ? { raw: fallbackText } : null
      })

      if (!response.ok || !responseBody || (responseBody as any).success === false) {
        console.error('🚨 Quote submission failed:', {
          status: response.status,
          statusText: response.statusText,
          body: responseBody
        })

        const errorMessage =
          (responseBody as any)?.error ||
          (responseBody as any)?.message ||
          (responseBody as any)?.raw ||
          'Quote submission failed'

        throw new Error(errorMessage)
      }

      if ((responseBody as any)?.assignedContractors?.length === 0) {
        toast.info('Quote received! We will match you with contractors shortly.')
      } else {
        toast.success('Quote request submitted successfully! Your request has been sent to contractors in your area.')
      }
      
      // Track Google Ads conversion
      trackQuoteSubmissionConversion('standard')
      
      onClose()
      form.reset()
      setCurrentStep(1)
    } catch (error) {
      const submissionError = error as Error
      console.error('Error submitting quote:', submissionError)
      
      const friendlyMessage =
        submissionError?.message && submissionError.message.trim().length > 0
          ? submissionError.message
          : 'Failed to submit quote request. Please try again.'
      
      toast.error(friendlyMessage)
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
