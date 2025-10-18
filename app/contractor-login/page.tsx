'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContractorLogin } from '@/components/forms/ContractorLogin'
import { toast } from 'sonner'

function ContractorLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showEmailMessage, setShowEmailMessage] = useState(false)
  
  useEffect(() => {
    // Check if user came from email link
    const fromEmail = searchParams.get('from')
    if (fromEmail === 'email') {
      setShowEmailMessage(true)
      toast.info('Welcome! Please log in to view your new lead', {
        description: 'You have a new lead waiting for your response.'
      })
    }
  }, [searchParams])
  
  const handleLoginSuccess = (contractor: any) => {
    // Store contractor session (in a real app, you'd use proper session management)
    localStorage.setItem('contractor', JSON.stringify(contractor))
    router.push('/contractor-dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">
              Contractor Portal
            </h1>
            <p className="text-xl text-gray-600">
              Access your dashboard to manage leads and profile
            </p>
            {showEmailMessage && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  📧 You have a new lead waiting for your response!
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Please log in to view the lead details and submit your quote.
                </p>
              </div>
            )}
          </div>
          
          <div className="max-w-md mx-auto">
            <ContractorLogin onLoginSuccess={handleLoginSuccess} />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/join-contractor" 
                className="text-[#0a4768] font-semibold hover:underline"
              >
                Join our network
              </a>
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

export default function ContractorLoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4768] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#0a4768] mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the login page.</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ContractorLoginContent />
    </Suspense>
  )
}
