'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ContractorLogin } from '@/components/forms/ContractorLogin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTestCredentials } from '@/lib/auth'

export default function ContractorLoginPage() {
  const router = useRouter()
  const testCredentials = getTestCredentials()
  
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
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ContractorLogin onLoginSuccess={handleLoginSuccess} />
            
            {/* Demo Credentials */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-[#0a4768] flex items-center">
                  🧪 Demo Mode - Test Credentials
                  <Badge variant="secondary" className="ml-2">Demo</Badge>
                </CardTitle>
                <CardDescription>
                  Use any of these test credentials to explore the contractor portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {testCredentials.slice(0, 4).map((cred, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-yellow-300">
                      <h4 className="font-semibold text-[#0a4768] mb-2">{cred.business_name}</h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Email:</strong> <code className="bg-gray-100 px-1 rounded">{cred.email}</code></div>
                        <div><strong>Password:</strong> <code className="bg-gray-100 px-1 rounded">{cred.password}</code></div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-600 text-center mt-4">
                    {testCredentials.length} total demo accounts available
                  </div>
                </div>
              </CardContent>
            </Card>
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
