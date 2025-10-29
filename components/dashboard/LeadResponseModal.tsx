'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Lead {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  city: string
  home_size_sqft: number
  areas_needed: string[]
  insulation_types: string[]
  status: string
  cost: number
  created_at: string
}

interface LeadResponseModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onResponse: (leadId: string, response: 'accept' | 'decline') => void
  contractorId: string
}

export function LeadResponseModal({ 
  lead, 
  isOpen, 
  onClose, 
  onResponse, 
  contractorId 
}: LeadResponseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseType, setResponseType] = useState<'accept' | 'decline' | null>(null)
  const [quoteAmount, setQuoteAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [notesError, setNotesError] = useState<string | null>(null)

  const containsDisallowedContactInfo = (text: string) => {
    if (!text) return false
    const urlPattern = /(https?:\/\/|www\.)\S+/i
    const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
    const phonePattern = /(?:(?:\+?\d{1,2}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})|(?:\d[\s.-]?){10,})/i
    return urlPattern.test(text) || emailPattern.test(text) || phonePattern.test(text)
  }

  if (!lead) return null

  const handleSubmit = async (type: 'accept' | 'decline') => {
    if (!lead) return
    
    if (type === 'accept' && containsDisallowedContactInfo(notes)) {
      setNotesError('Please remove URLs, email addresses, and phone numbers from Additional Notes.')
      return
    }

    setIsSubmitting(true)
    setResponseType(type)

    try {
      // Update the lead assignment with contractor response
      const updateData: any = {
        status: type === 'accept' ? 'accepted' : 'declined',
        responded_at: new Date().toISOString()
      }

      if (type === 'accept') {
        updateData.quote_amount = quoteAmount ? parseFloat(quoteAmount) : null
        updateData.quote_notes = notes || null
        updateData.estimated_completion_time = estimatedTime || null
      }

      const { error } = await (supabase as any)
        .from('lead_assignments')
        .update(updateData)
        .eq('lead_id', lead.id)
        .eq('contractor_id', contractorId)

      if (error) throw error

      // Create notification for customer
      await (supabase as any)
        .from('notifications')
        .insert({
          user_id: null, // We'll need to get customer user_id
          title: type === 'accept' 
            ? 'Contractor Interested in Your Project' 
            : 'Contractor Response',
          message: type === 'accept'
            ? `A contractor is interested in your insulation project and will contact you soon.`
            : `A contractor has declined your project. We'll find other contractors for you.`,
          notification_type: 'lead_response',
          reference_id: lead.id,
          reference_type: 'lead'
        })

      toast.success(
        type === 'accept' 
          ? 'Lead accepted! The customer will be notified.' 
          : 'Lead declined.'
      )

      onResponse(lead.id, type)
      onClose()

    } catch (error) {
      console.error('Error responding to lead:', error)
      toast.error('Failed to submit response. Please try again.')
    } finally {
      setIsSubmitting(false)
      setResponseType(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Respond to Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Lead Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Customer:</span> {lead.customer_name}
              </div>
              <div>
                <span className="font-medium">Location:</span> {lead.city}
              </div>
              <div>
                <span className="font-medium">Home Size:</span> {lead.home_size_sqft.toLocaleString()} sq ft
              </div>
              <div>
                <span className="font-medium">Areas:</span> {lead.areas_needed.join(', ')}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Insulation Types:</span> {lead.insulation_types.join(', ')}
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-500 italic">Contact information will be provided after you accept the lead</span>
              </div>
            </div>
          </div>

          {/* Quote Information (for acceptance) */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quote Information (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-amount">Estimated Quote ($)</Label>
                <Input
                  id="quote-amount"
                  type="number"
                  placeholder="e.g. 2500"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estimated-time">Estimated Completion Time</Label>
                <Input
                  id="estimated-time"
                  placeholder="e.g. 2-3 days"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about your quote or approach..."
                value={notes}
              onChange={(e) => {
                const val = e.target.value
                setNotes(val)
                setNotesError(containsDisallowedContactInfo(val) 
                  ? 'Please remove URLs, email addresses, and phone numbers.' 
                  : null)
              }}
                rows={3}
              />
            {notesError && (
              <p className="text-sm text-red-600 mt-1">{notesError}</p>
            )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSubmit('decline')}
              disabled={isSubmitting}
            >
              {isSubmitting && responseType === 'decline' ? 'Declining...' : 'Decline Lead'}
            </Button>
            <Button
              onClick={() => handleSubmit('accept')}
            disabled={isSubmitting || !!notesError}
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
            >
              {isSubmitting && responseType === 'accept' ? 'Accepting...' : 'Accept & Contact Customer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
