'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ContractorForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contractor-password-reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        toast.success(result.message)
      } else {
        toast.error(result.error || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      toast.error('An error occurred while processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#0a4768] mb-4">
                Check Your Email
              </h1>
              <p className="text-xl text-gray-600">
                We've sent password reset instructions to your email
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reset Email Sent
                    </h3>
                    <p className="text-gray-600 mb-6">
                      If an account with that email exists, we've sent you a password reset link. 
                      Please check your email and follow the instructions to reset your password.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      The reset link will expire in 1 hour for security reasons.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="w-full"
                      >
                        Try Another Email
                      </Button>
                      <Link href="/contractor-login">
                        <Button variant="ghost" className="w-full">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">
              Forgot Password
            </h1>
            <p className="text-xl text-gray-600">
              Enter your email address to receive password reset instructions
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-[#0a4768]">Reset Password</CardTitle>
                <CardDescription>
                  Enter your contractor email address and we'll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="contractor@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 text-center">
                  <Link 
                    href="/contractor-login" 
                    className="text-sm text-[#0a4768] hover:text-blue-600 underline"
                  >
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
