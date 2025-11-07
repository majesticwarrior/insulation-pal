import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become an InsulationPal Pro',
  description: 'Join InsulationPal\'s network of trusted contractors and connect with homeowners who need your services. Increase your revenue and expand your customer base.',
}

export default function JoinContractorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

