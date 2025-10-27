'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  text: string
  url?: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: shareUrl,
      }).catch((error) => {
        console.log('Error sharing:', error)
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!')
      }).catch((error) => {
        console.log('Error copying to clipboard:', error)
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white"
      onClick={handleShare}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  )
}

