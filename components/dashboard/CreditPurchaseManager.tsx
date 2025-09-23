'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CreditCard, Check, Star, DollarSign, Zap } from 'lucide-react'

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  description: string
  popular?: boolean
  savings?: string
}

interface Transaction {
  id: string
  transaction_type: string
  credits_amount: number
  cost_amount: number
  package_name: string
  status: string
  created_at: string
}

interface CreditPurchaseManagerProps {
  contractorId: string
  currentCredits: number
  onCreditsUpdate: (newCredits: number) => void
}

export function CreditPurchaseManager({ 
  contractorId, 
  currentCredits, 
  onCreditsUpdate 
}: CreditPurchaseManagerProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  const creditPackages: CreditPackage[] = [
    {
      id: 'basic',
      name: 'Basic Package',
      credits: 5,
      price: 200,
      description: '$20.00 per credit',
      savings: 'Save $0'
    },
    {
      id: 'intermediate',
      name: 'Intermediate Package',
      credits: 10,
      price: 190,
      description: '$19.00 per credit',
      savings: 'Save $10'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      credits: 25,
      price: 450,
      description: '$18.00 per credit',
      popular: true,
      savings: 'Save $25'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      credits: 50,
      price: 850,
      description: '$17.00 per credit',
      savings: 'Save $150'
    }
  ]

  useEffect(() => {
    loadTransactionHistory()
  }, [contractorId])

  const loadTransactionHistory = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('credit_transactions')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const handlePurchaseCredits = (pkg: CreditPackage) => {
    setSelectedPackage(pkg)
    setIsPurchaseModalOpen(true)
  }

  const processPayment = async () => {
    if (!selectedPackage) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      // In production, this would integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Record the transaction
      const { error: transactionError } = await (supabase as any)
        .from('credit_transactions')
        .insert({
          contractor_id: contractorId,
          transaction_type: 'purchase',
          credits_amount: selectedPackage.credits,
          cost_amount: selectedPackage.price,
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          status: 'completed',
          description: `Purchase of ${selectedPackage.name}`,
          processed_at: new Date().toISOString()
        })

      if (transactionError) throw transactionError

      // Update contractor credits
      const { error: updateError } = await (supabase as any)
        .from('contractors')
        .update({ 
          credits: currentCredits + selectedPackage.credits,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractorId)

      if (updateError) throw updateError

      // Update local state
      onCreditsUpdate(currentCredits + selectedPackage.credits)

      toast.success(`Successfully purchased ${selectedPackage.credits} credits!`)
      setIsPurchaseModalOpen(false)
      setSelectedPackage(null)
      loadTransactionHistory()

    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Credits Display */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Credits</h3>
                <p className="text-gray-600">Each lead costs 1 credit ($20 value)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{currentCredits}</div>
              <p className="text-sm text-gray-500">credits available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Purchase Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                pkg.popular ? 'border-2 border-yellow-400' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {pkg.credits}
                    <span className="text-sm font-normal text-gray-500"> credits</span>
                  </div>
                  <div className="text-2xl font-semibold">
                    ${pkg.price}
                    <span className="text-sm font-normal text-gray-500">
                      {' '}(${(pkg.price / pkg.credits).toFixed(2)} per credit)
                    </span>
                  </div>
                  {pkg.savings && (
                    <div className="text-sm text-green-600 font-medium">
                      {pkg.savings}
                    </div>
                  )}
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button
                  onClick={() => handlePurchaseCredits(pkg)}
                  className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase Credits
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent credit purchases and usage</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === 'purchase' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.transaction_type === 'purchase' ? (
                        <Zap className="w-4 h-4 text-green-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.transaction_type === 'purchase' 
                          ? transaction.package_name 
                          : 'Lead Credit Used'
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        transaction.credits_amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.credits_amount > 0 ? '+' : ''}{transaction.credits_amount} credits
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    {transaction.cost_amount && (
                      <p className="text-sm text-gray-500">
                        ${transaction.cost_amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Confirmation Modal */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedPackage.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-medium">{selectedPackage.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per credit:</span>
                    <span className="font-medium">${(selectedPackage.price / selectedPackage.credits).toFixed(2)}</span>
                  </div>
                  {selectedPackage.savings && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings:</span>
                      <span className="font-medium">{selectedPackage.savings}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">After Purchase:</h4>
                <p className="text-blue-800">
                  You will have <strong>{currentCredits + selectedPackage.credits} total credits</strong>
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Note:</strong> This is a demo payment system. In production, this would process 
                  real payments through Stripe. Credits will be added to your account immediately.
                </p>
              </div>

              <div className="flex space-x-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPurchaseModalOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Purchase
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
