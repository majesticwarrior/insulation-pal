'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Component that uses searchParams - must be wrapped in Suspense
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided. Please check your email for the verification link.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')
          setEmail(data.email || '')
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify email. Please try again.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex-grow flex items-center justify-center bg-[#D8E1FF] py-20 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-12 w-12 text-[#0a4768] animate-spin" />
                </div>
                <CardTitle className="text-2xl text-[#0a4768]">
                  Verifying Your Email
                </CardTitle>
                <CardDescription>
                  Please wait while we verify your email address...
                </CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-[#0a4768]">
                  Email Verified!
                </CardTitle>
                <CardDescription>
                  Your email address has been successfully verified.
                </CardDescription>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-[#0a4768]">
                  Verification Failed
                </CardTitle>
                <CardDescription>
                  We couldn't verify your email address.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <p className="text-center text-gray-600">
                This will only take a moment...
              </p>
            )}

            {status === 'success' && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    {message}
                  </p>
                  {email && (
                    <p className="text-green-700 text-sm mt-2">
                      Verified email: <strong>{email}</strong>
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm text-center">
                    Your application is now being reviewed by our team. You'll receive an email notification once your account has been approved.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                      <Link href="/contractor-login">
                        Go to Login
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/">
                        Return to Home
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    {message}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm text-center">
                    If you continue to experience issues, please contact our support team.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                      <Link href="/join-contractor">
                        Register Again
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/">
                        Return to Home
                      </Link>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    Need help? Contact us at{' '}
                    <a href="mailto:info@majesticwarrior.com" className="text-[#0a4768] hover:underline">
                      info@majesticwarrior.com
                    </a>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
  )
}

// Main page component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center bg-[#D8E1FF] py-20 px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-[#0a4768] animate-spin" />
              </div>
              <CardTitle className="text-2xl text-[#0a4768]">
                Loading...
              </CardTitle>
              <CardDescription>
                Please wait while we load the verification page...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
      <Footer />
    </main>
  )
}
