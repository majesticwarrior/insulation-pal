'use client'

import { useState } from 'react'
import { Button } from './button'

interface TruncatedTextProps {
  text: string
  maxLength?: number
  className?: string
}

export function TruncatedText({ text, maxLength = 400, className = '' }: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!text) return null
  
  const shouldTruncate = text.length > maxLength
  const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength)
  
  return (
    <div className={className}>
      <p className="text-gray-700 mb-2 leading-relaxed">
        {displayText}
        {shouldTruncate && !isExpanded && '...'}
      </p>
      {shouldTruncate && (
        <Button
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 h-auto text-[#0a4768] hover:text-[#0a4768]/80 font-medium text-sm"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}
