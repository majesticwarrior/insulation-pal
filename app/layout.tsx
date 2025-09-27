import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InsulationPal - Professional Insulation Services',
  description: 'Connect with trusted insulation contractors in your area. Get quotes for attic insulation, wall insulation, spray foam, and more.',
  verification: {
    google: 'dZYI0UVpI_LXVg6tYuC7uIRTZ0ScPWj8r4PCjLH9ZHA',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}