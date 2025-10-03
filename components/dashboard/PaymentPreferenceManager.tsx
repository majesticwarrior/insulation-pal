'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CreditCard, CheckCircle, DollarSign, Info, AlertCircle } from 'lucide-react'

interface PaymentPreferenceManagerProps {
  contractorId: string
  currentPreference?: string
  onPreferenceUpdate: (preference: string) => void
}

export function PaymentPreferenceManager({ 
  contractorId, 
  currentPreference = 'per_lead',
  onPreferenceUpdate 
}: PaymentPreferenceManagerProps) {
  const [preference, setPreference] = useState(currentPreference)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setPreference(currentPreference)
    setHasChanges(false)
  }, [currentPreference])

  const handlePreferenceChange = (newPreference: string) => {
    setPreference(newPreference)
    setHasChanges(newPreference !== currentPreference)
  }

  const savePreference = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('contractors')
        .update({ 
          payment_preference: preference,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractorId)

      if (error) throw error

      toast.success('Payment preference updated successfully!')
      onPreferenceUpdate(preference)
      setHasChanges(false)
    } catch (error) {
      console.error('Error updating payment preference:', error)
      toast.error('Failed to update payment preference. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getPreferenceDescription = (pref: string) => {
    switch (pref) {
      case 'per_lead':
        return {
          title: 'Pay Per Lead',
          description: 'Purchase leads upfront with credits. Pay $20 per lead when assigned.',
          features: [
            'Pay upfront for leads',
            'Immediate access to customer information',
            'No commission on completed jobs',
            'Full control over lead quality'
          ],
          icon: <CreditCard className="h-5 w-5" />
        }
      case 'per_job_completed':
        return {
          title: 'Pay for Jobs Completed',
          description: 'No upfront costs. We hold payment in escrow and take 10% commission upon job completion.',
          features: [
            'No upfront lead costs',
            'Payment held in secure escrow',
            '10% commission on completed jobs',
            'Payment released after job completion'
          ],
          icon: <CheckCircle className="h-5 w-5" />
        }
      default:
        return {
          title: 'Unknown',
          description: '',
          features: [],
          icon: <AlertCircle className="h-5 w-5" />
        }
    }
  }

  const currentDesc = getPreferenceDescription(preference)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Preference
        </CardTitle>
        <CardDescription>
          Choose how you want to pay for leads and services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={preference} 
          onValueChange={handlePreferenceChange}
          className="space-y-4"
        >
          {/* Pay Per Lead Option */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="per_lead" id="per_lead" className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="per_lead" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Pay Per Lead</span>
                {preference === 'per_lead' && (
                  <Badge variant="secondary" className="ml-2">
                    Current
                  </Badge>
                )}
              </Label>
              <p className="text-sm text-gray-600">
                Purchase leads upfront with credits. Pay $20 per lead when assigned.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Pay upfront for leads
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Immediate access to customer information
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  No commission on completed jobs
                </div>
              </div>
            </div>
          </div>

          {/* Pay for Jobs Completed Option */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="per_job_completed" id="per_job_completed" className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="per_job_completed" className="flex items-center gap-2 cursor-pointer">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Pay for Jobs Completed</span>
                {preference === 'per_job_completed' && (
                  <Badge variant="secondary" className="ml-2">
                    Current
                  </Badge>
                )}
              </Label>
              <p className="text-sm text-gray-600">
                No upfront costs. We hold payment in escrow and take 10% commission upon job completion.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  No upfront lead costs
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Payment held in secure escrow
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  10% commission on completed jobs
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                {currentDesc.title} - How it works:
              </p>
              <p className="text-blue-800 mb-2">
                {currentDesc.description}
              </p>
              <ul className="text-blue-700 space-y-1">
                {currentDesc.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Warning for Pay for Jobs Completed */}
        {preference === 'per_job_completed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-900 mb-1">
                  Important Notice:
                </p>
                <p className="text-red-800">
                  We spot check jobs and if found trying to circumvent our payment options we will kick you off Insulation Pal. We deserve to get paid for our hard work (getting you leads) just like you do.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button 
              onClick={savePreference}
              disabled={isSaving}
              className="bg-[#0a4768] hover:bg-[#0a4768]/90"
            >
              {isSaving ? 'Saving...' : 'Save Preference'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
