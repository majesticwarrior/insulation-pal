import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReviewForm } from '@/components/forms/ReviewForm'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

interface ReviewPageProps {
  params: Promise<{
    contractorId: string
  }>
  searchParams: Promise<{
    lead?: string
  }>
}

async function getContractor(contractorId: string) {
  const { data: contractor, error } = await (supabase as any)
    .from('contractors')
    .select('id, business_name, status')
    .eq('id', contractorId)
    .eq('status', 'approved')
    .single()

  if (error || !contractor) {
    return null
  }

  return contractor as { id: string; business_name: string; status: string }
}

// Generate dynamic metadata based on contractor data
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { contractorId } = await params
  const contractor = await getContractor(contractorId)
  
  if (!contractor) {
    return {
      title: 'Contractor Not Found - InsulationPal',
      description: 'The requested contractor could not be found.',
    }
  }

  const contractorName = contractor.business_name
  
  return {
    title: `Review ${contractorName} - InsulationPal`,
    description: `Share your experience with ${contractorName}. Leave a review for this insulation contractor to help other customers make informed decisions.`,
    keywords: [
      `review ${contractorName}`,
      `${contractorName} reviews`,
      'insulation contractor review',
      'contractor feedback',
      'insulation service review',
      'Phoenix contractor review',
      'Arizona contractor review'
    ],
    openGraph: {
      title: `Review ${contractorName} - InsulationPal`,
      description: `Share your experience with ${contractorName}. Help other customers by leaving an honest review of your insulation project.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'InsulationPal',
    },
    twitter: {
      card: 'summary',
      title: `Review ${contractorName}`,
      description: `Share your experience with ${contractorName}. Help other customers by leaving a review.`,
    },
    alternates: {
      canonical: `https://insulationpal.com/review/${contractorId}`,
    },
  }
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const contractor = await getContractor(resolvedParams.contractorId)

  if (!contractor) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">
              Share Your Experience
            </h1>
            <p className="text-xl text-gray-600">
              Help other homeowners by reviewing your insulation project
            </p>
          </div>
          
          <ReviewForm 
            contractorId={contractor.id}
            contractorName={contractor.business_name}
            leadId={resolvedSearchParams.lead}
            onSuccess={() => {
              // Could redirect to a thank you page
              console.log('Review submitted successfully')
            }}
          />
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
