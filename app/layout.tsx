import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Script from 'next/script'
import '@/lib/error-handler'

const inter = Inter({ subsets: ['latin'] })

// Google Ads configuration
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

export const metadata: Metadata = {
  title: 'InsulationPal - Professional Insulation Services',
  description: 'Connect with trusted insulation contractors in your area. Get quotes for attic insulation, wall insulation, spray foam, and more.',
  verification: {
    google: 'dZYI0UVpI_LXVg6tYuC7uIRTZ0ScPWj8r4PCjLH9ZHA',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="p:domain_verify" content="67825100c7433513ded794e8ee903197"/>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* Google Ads (gtag.js) */}
        {GOOGLE_ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `}
            </Script>
          </>
        )}
        {children}
        <Toaster />
      </body>
    </html>
  )
}