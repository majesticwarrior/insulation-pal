import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy - InsulationPal',
  description: 'Privacy policy for InsulationPal platform'
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-8">Privacy Policy</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-gray-600 mb-6">
                This privacy policy is currently being developed. Please contact us for any privacy-related questions.
              </p>
              
              <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For privacy inquiries, please contact us at: privacy@insulationpal.com
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
