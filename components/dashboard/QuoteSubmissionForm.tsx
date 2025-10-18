'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { submitAndSendQuote } from '@/lib/quote-delivery'
import { DollarSign, FileText, Send } from 'lucide-react'
import { toast } from 'sonner'

interface QuoteSubmissionFormProps {
  leadAssignmentId: string
  contractorId: string
  onQuoteSubmitted: () => void
}

export function QuoteSubmissionForm({ 
  leadAssignmentId, 
  contractorId, 
  onQuoteSubmitted 
}: QuoteSubmissionFormProps) {
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quoteAmount || parseFloat(quoteAmount) <= 0) {
      toast.error('Please enter a valid quote amount')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Check if this is a demo lead
      if (leadAssignmentId.startsWith('demo-')) {
        console.log('🎭 Demo Mode: Simulating quote submission')
        toast.success('Quote submitted and sent to customer! (Demo Mode)')
        onQuoteSubmitted()
        return
      }

      // Submit quote and send to customer
      await submitAndSendQuote({
        leadAssignmentId,
        contractorId,
        quoteAmount: parseFloat(quoteAmount),
        quoteNotes: quoteNotes
      })

      toast.success('Quote submitted and sent to customer!')
      onQuoteSubmitted()
      
    } catch (error: any) {
      console.error('Quote submission error:', error)
      toast.error(error.message || 'Failed to submit quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-[#0a4768]">
          <FileText className="h-5 w-5 mr-2" />
          Submit Your Quote
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quoteAmount" className="text-sm font-medium">
              Quote Amount ($)
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="quoteAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quoteNotes" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="quoteNotes"
              placeholder="Include any additional details about your quote, timeline, materials, or special considerations..."
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your quote will be sent to the customer via email. 
              Once they review it, they may contact you directly for further discussion.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0a4768] hover:bg-[#0a4768]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Quote...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Quote
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
