'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Phone } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/navigation'

export default function QuoteSuccessPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quote Request Sent Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your quote request has been sent to the selected contractors. 
            They will review your project details and contact you within several hours.
          </p>

          {/* What Happens Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contractors Review Your Request</p>
                  <p className="text-sm text-gray-600">Selected contractors will review your project details and requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">You'll Receive Contact</p>
                  <p className="text-sm text-gray-600">Contractors will call or email you to discuss your project and schedule estimates.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Compare Quotes</p>
                  <p className="text-sm text-gray-600">Review estimates from different contractors and choose the best option for your needs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
            <p className="text-blue-800 mb-4">
              If you have any questions about your quote request or need assistance, 
              our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Support</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call Support</span>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>
            <Button 
              onClick={() => router.push('/resources')}
              variant="outline"
            >
              Browse Resources
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
