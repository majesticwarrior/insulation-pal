'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { generateUniqueSlug } from '@/lib/slug-utils'
import Image from 'next/image'

interface ReviewsBadgeProps {
  contractorId: string
  businessName: string
}

export function ReviewsBadge({ contractorId, businessName }: ReviewsBadgeProps) {
  const [copiedStacked, setCopiedStacked] = useState(false)
  const [copiedHorizontal, setCopiedHorizontal] = useState(false)

  const profileSlug = generateUniqueSlug(businessName, contractorId)
  const profileUrl = `https://insulationpal.com/contractor/${profileSlug}`
  
  // Stacked variation (text on top, logo on bottom)
  const badgeHtmlStacked = `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 20px; color: #0a4768; text-decoration: none; font-weight: 600; font-size: 14px;">
  <span style="text-align: center; line-height: 1.1;">
    Check out<br>our reviews
  </span>
  <img src="https://insulationpal.com/insulation-pal-logo.png" alt="InsulationPal" style="height: 52px; width: auto;" />
</a>`

  // Horizontal variation (logo and text on same line)
  const badgeHtmlHorizontal = `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; color: #0a4768; text-decoration: none; font-weight: 600; font-size: 14px;">
  <img src="https://insulationpal.com/insulation-pal-logo.png" alt="InsulationPal" style="height: 52px; width: auto;" />
  <span style="line-height: 1.1;">Check out<br>our reviews</span>
</a>`

  const handleCopyStacked = async () => {
    try {
      await navigator.clipboard.writeText(badgeHtmlStacked)
      setCopiedStacked(true)
      setTimeout(() => setCopiedStacked(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleCopyHorizontal = async () => {
    try {
      await navigator.clipboard.writeText(badgeHtmlHorizontal)
      setCopiedHorizontal(true)
      setTimeout(() => setCopiedHorizontal(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Reviews</CardTitle>
        <CardDescription>
          Want to share your InsulationPal reviews with your customers, add this badge to your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variation 1: Stacked */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-base text-gray-800">Variation 1: Stacked (Text on top, Logo on bottom)</h3>
            
            {/* Preview */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Badge Preview:</h4>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full min-h-[200px]">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-col items-center gap-2 px-5 py-3 text-[#0a4768] font-semibold text-sm"
                >
                <span className="text-center leading-none">
                  Check out<br />our reviews
                </span>
                  <Image
                    src="/insulation-pal-logo.png"
                    alt="InsulationPal"
                    width={52}
                    height={52}
                    className="h-[52px] w-auto"
                  />
                </a>
              </div>
            </div>

            {/* HTML Code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-700">HTML Code:</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyStacked}
                  className="gap-2"
                >
                  {copiedStacked ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy HTML
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap break-words font-mono">
                  {badgeHtmlStacked}
                </pre>
              </div>
            </div>
          </div>

          {/* Variation 2: Horizontal */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-base text-gray-800">Variation 2: Horizontal (Logo and text on same line)</h3>
            
            {/* Preview */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Badge Preview:</h4>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full min-h-[200px]">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-[#0a4768] font-semibold text-sm"
                >
                  <Image
                    src="/insulation-pal-logo.png"
                    alt="InsulationPal"
                    width={52}
                    height={52}
                    className="h-[52px] w-auto"
                  />
                <span className="leading-none">
                  Check out<br />our reviews
                </span>
                </a>
              </div>
            </div>

            {/* HTML Code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-700">HTML Code:</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyHorizontal}
                  className="gap-2"
                >
                  {copiedHorizontal ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy HTML
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap break-words font-mono">
                  {badgeHtmlHorizontal}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Profile URL */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Your Profile URL:</h4>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 break-all font-mono">{profileUrl}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

