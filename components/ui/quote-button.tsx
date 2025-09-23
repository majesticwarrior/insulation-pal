'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { QuotePopup } from '@/components/forms/QuotePopup'

interface QuoteButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function QuoteButton({ children, variant = 'default', size = 'default', className }: QuoteButtonProps) {
  const [isQuotePopupOpen, setIsQuotePopupOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsQuotePopupOpen(true)}
      >
        {children}
      </Button>
      <QuotePopup
        isOpen={isQuotePopupOpen}
        onClose={() => setIsQuotePopupOpen(false)}
      />
    </>
  )
}
