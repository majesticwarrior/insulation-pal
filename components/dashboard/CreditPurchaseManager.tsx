'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CreditCard, History, Zap } from 'lucide-react'
import { CreditPurchaseModal } from './CreditPurchaseModal'

interface Transaction {
  id: string
  package_id: string
  credits_purchased: number
  amount_paid: number
  transaction_type: string
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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [contractorId])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching transactions:', error)
        return
      }

      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Current Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#0a4768]">
            <Zap className="h-5 w-5 mr-2" />
            Your Credits
          </CardTitle>
          <CardDescription>
            Manage your lead credits and purchase more when needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {currentCredits}
              </div>
              <div className="text-sm text-gray-600">
                Available Credits
              </div>
            </div>
            <Button 
              onClick={() => setIsPurchaseModalOpen(true)}
              className="bg-[#0a4768] hover:bg-[#0a4768]/90"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#0a4768]">
            <History className="h-5 w-5 mr-2" />
            Purchase History
          </CardTitle>
          <CardDescription>
            Your recent credit purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="text-center py-4">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">No purchases yet</div>
              <div className="text-sm text-gray-400">
                Buy your first credit package to get started
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {transaction.credits_purchased} Credits
                    </div>
                    <div className="text-sm text-gray-600">
                      Package: {transaction.package_id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatPrice(transaction.amount_paid)}
                    </div>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Modal */}
      {isPurchaseModalOpen && (
        <CreditPurchaseModal
          contractorId={contractorId}
          currentCredits={currentCredits}
          onClose={() => {
            setIsPurchaseModalOpen(false)
            fetchTransactions() // Refresh transactions
            // Refresh credits from parent component
            window.location.reload() // Simple refresh for now
          }}
        />
      )}
    </div>
  )
}