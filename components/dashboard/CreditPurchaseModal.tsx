'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Star, Zap } from 'lucide-react'
import { leadPackages, formatPrice, type LeadPackage } from '@/lib/stripe'
import { redirectToCheckout } from '@/lib/stripe-client'
import { toast } from 'sonner'

interface CreditPurchaseModalProps {
  contractorId: string
  currentCredits: number
  onClose: () => void
}

export function CreditPurchaseModal({ contractorId, currentCredits, onClose }: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('professional')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async (packageId: string) => {
    setIsProcessing(true)
    try {
      await redirectToCheckout(packageId, contractorId)
    } catch (error: any) {
      console.error('Payment error:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('Stripe failed to initialize')) {
        toast.error('Payment system not configured. Running in demo mode.')
      } else if (error.message?.includes('Failed to create checkout session')) {
        toast.error('Unable to create payment session. Please check your connection and try again.')
      } else if (error.message?.includes('Demo payment simulation failed')) {
        toast.error('Demo payment failed. Please try again.')
      } else {
        toast.error('Failed to start payment process. Please try again.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#0a4768]">Purchase Lead Credits</CardTitle>
              <CardDescription className="mt-2">
                You currently have <span className="font-semibold text-green-600">{currentCredits} credits</span>
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leadPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative cursor-pointer transition-all h-full flex flex-col ${
                  selectedPackage === pkg.id 
                    ? 'ring-2 ring-[#0a4768] shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-8 w-8 text-[#0a4768]" />
                  </div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center space-y-4 flex flex-col flex-1">
                  <div>
                    <div className="text-3xl font-bold text-[#0a4768]">
                      {formatPrice(pkg.price * 100)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.credits} Credits • ${pkg.pricePerCredit}/credit
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{pkg.credits} Lead Credits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Instant Delivery</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>No Expiration</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePurchase(pkg.id)
                    }}
                    disabled={isProcessing}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Security */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span>Powered by Stripe</span>
              </div>
            </div>
            {(() => {
              const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
              const isDemoMode = !stripeKey || stripeKey.includes('placeholder')
              console.log('🔍 CreditPurchaseModal Stripe check:', { 
                hasKey: !!stripeKey, 
                keyPrefix: stripeKey?.substring(0, 10) + '...',
                isDemoMode 
              })
              return isDemoMode
            })() && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  🎭 Demo Mode - Payments are simulated
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Credits are added to your account immediately after payment confirmation.
              You can use credits to accept leads and grow your business.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
