import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReviewForm } from '@/components/forms/ReviewForm'
import { supabase } from '@/lib/supabase'

interface ReviewPageProps {
  params: {
    contractorId: string
  }
  searchParams: {
    lead?: string
  }
}

async function getContractor(contractorId: string) {
  const { data: contractor, error } = await supabase
    .from('contractors')
    .select('id, business_name, status')
    .eq('id', contractorId)
    .eq('status', 'approved')
    .single()

  if (error || !contractor) {
    return null
  }

  return contractor
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const contractor = await getContractor(params.contractorId)

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
            leadId={searchParams.lead}
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
