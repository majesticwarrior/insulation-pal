'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

const contractorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  licenseNumber: z.string().min(1, 'License number is required'),
  city: z.string().min(1, 'City is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ContractorFormData = z.infer<typeof contractorSchema>

interface ContractorRegistrationProps {
  onSuccess?: () => void
}

export function ContractorRegistration({ onSuccess }: ContractorRegistrationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formStartTimeRef = useRef<number>(Date.now())
  const [honeypotValue, setHoneypotValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      licenseNumber: '',
      city: ''
    }
  })

  // Track when form is first interacted with
  useEffect(() => {
    formStartTimeRef.current = Date.now()
  }, [])

  const onSubmit = async (data: ContractorFormData) => {
    console.log('🚀 Form submission started with data:', data)
    setIsSubmitting(true)
    
    try {
      // Submit to API route with anti-spam measures
      const response = await fetch('/api/contractor-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          honeypot: honeypotValue, // Hidden field for bot detection
          formStartTime: formStartTimeRef.current // Time tracking
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      toast.success(result.message || 'Registration submitted successfully! We will review your application and get back to you soon.')
      form.reset()
      setHoneypotValue('')
      formStartTimeRef.current = Date.now() // Reset for potential re-submission
      onSuccess?.()
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to submit registration. Please try again.')
      } else {
        toast.error('Failed to submit registration. Please try again.')
      }
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
              <form 
                onSubmit={(e) => {
                  console.log('🔥 Form onSubmit handler called - preventing default')
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('📝 Form submit event triggered, calling handleSubmit')
                  const submitHandler = form.handleSubmit(onSubmit)
                  submitHandler(e)
                  return false
                }} 
                className="space-y-6"
                method="post"
              >
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License # *</FormLabel>
                        <FormControl>
                          <Input placeholder="License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Phoenix" {...field} />
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
                          <div className="relative">
                            <Input 
                              placeholder="Enter password" 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              tabIndex={0}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
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
                          <div className="relative">
                            <Input 
                              placeholder="Confirm password" 
                              type={showConfirmPassword ? "text" : "password"} 
                              {...field} 
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              tabIndex={0}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Honeypot field - hidden from users but bots will fill it */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <label htmlFor="website-url">Website URL (leave blank)</label>
                <input
                  type="text"
                  id="website-url"
                  name="website-url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
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
