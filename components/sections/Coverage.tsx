import { MapPin, CheckCircle } from 'lucide-react'

const Coverage = () => {
  const states = [
    'Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Florida', 'Georgia', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maryland', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Nevada', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'South Carolina', 'Tennessee',
    'Texas', 'Utah', 'Virginia', 'Washington', 'Wisconsin'
  ]

  const majorCities = [
    'Atlanta, GA', 'Austin, TX', 'Charlotte, NC', 'Chicago, IL',
    'Dallas, TX', 'Denver, CO', 'Houston, TX', 'Las Vegas, NV',
    'Los Angeles, CA', 'Miami, FL', 'Phoenix, AZ', 'San Antonio, TX'
  ]

  return (
    <section className="py-20 bg-[#D6D6D6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
            Nationwide Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            InsulationPal connects homeowners with qualified insulation contractors 
            across the United States. Find trusted professionals in your area.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <MapPin className="h-8 w-8 text-[#0a4768] mr-3" />
                <h3 className="text-2xl font-bold text-[#0a4768]">
                  We Serve 35+ States
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {states.map((state, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{state}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-xl font-bold text-[#0a4768] mb-6">
                Major Metropolitan Areas
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {majorCities.map((city, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#0a4768] mb-6">
                Why Choose InsulationPal?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#0a4768] mb-1">Licensed & Insured</h4>
                    <p className="text-gray-600 text-sm">All contractors in our network are fully licensed and carry comprehensive insurance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#0a4768] mb-1">Verified Reviews</h4>
                    <p className="text-gray-600 text-sm">Read authentic reviews from real customers to make informed decisions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#0a4768] mb-1">Competitive Pricing</h4>
                    <p className="text-gray-600 text-sm">Compare quotes from multiple contractors to get the best value.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#0a4768] mb-1">Quality Guarantee</h4>
                    <p className="text-gray-600 text-sm">All work comes with warranties and our satisfaction guarantee.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a4768] rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Don't See Your Area?</h3>
              <p className="mb-6">
                We're constantly expanding our network. Contact us to see if we can 
                connect you with contractors in your area.
              </p>
              <button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-6 py-3 rounded-lg transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Coverage