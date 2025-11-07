'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DirectQuotePopup } from '@/components/forms/DirectQuotePopup'

interface DirectQuoteButtonProps {
  contractorId: string
  contractorName: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function DirectQuoteButton({ 
  contractorId, 
  contractorName,
  className,
  variant = 'outline'
}: DirectQuoteButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <Button 
        variant={variant}
        className={className}
        onClick={() => setIsPopupOpen(true)}
      >
        Direct Contractor Quote
      </Button>
      <DirectQuotePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        contractorId={contractorId}
        contractorName={contractorName}
      />
    </>
  )
}

