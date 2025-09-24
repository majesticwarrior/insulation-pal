import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Terms of Service - InsulationPal',
  description: 'Terms of service for InsulationPal platform'
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-8">Terms of Service</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-gray-600 mb-6">
                Our terms of service are currently being developed. Please contact us for any questions.
              </p>
              
              <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For terms-related inquiries, please contact us at: legal@insulationpal.com
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
