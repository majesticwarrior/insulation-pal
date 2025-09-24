'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContractorLogin } from '@/components/forms/ContractorLogin'
export default function ContractorLoginPage() {
  const router = useRouter()
  
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
