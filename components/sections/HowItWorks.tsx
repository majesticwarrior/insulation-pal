import { Search, Users, Calendar, CheckCircle } from 'lucide-react'
import Image from 'next/image'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Tell Us Your Needs',
      description: 'Share your insulation project details and address. Our system matches you with qualified contractors in your area.',
      step: '01'
    },
    {
      icon: Users,
      title: 'Get Matched',
      description: 'Receive up to 3 free quotes from licensed, insured contractors. Compare prices, reviews, and services.',
      step: '02'
    },
    {
      icon: Calendar,
      title: 'Schedule Service',
      description: 'Choose your preferred contractor and schedule your insulation installation at a convenient time.',
      step: '03'
    },
    {
      icon: CheckCircle,
      title: 'Enjoy Savings',
      description: 'Professional installation completed to code. Start enjoying lower energy bills and improved comfort.',
      step: '04'
    }
  ]

  return (
    <section className="py-20 bg-[#D8E1FF]">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
            How InsulationPal Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting professional insulation services has never been easier. 
            Follow these simple steps to connect with trusted contractors in your area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-[#F5DD22] transform translate-x-1/2 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="bg-white rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-lg relative">
                    <div className="absolute -top-2 -right-2 bg-[#F5DD22] text-[#0a4768] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <Icon className="h-12 w-12 text-[#0a4768]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0a4768] mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* New Section: Get next day insulation service */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Get next day insulation service and<br />
              Improve Your Home's Efficiency
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tired of high energy bills and uncomfortable temperatures? So are we. That's why we've built a network of trusted insulation professionals ready to transform your home's comfort and efficiency.
            </p>
          </div>
          
          <div className="flex justify-center mt-10">
            <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/common-air-leaks-graphic-insulation-helps.jpg"
                alt="Common air leaks graphic showing how insulation helps improve home efficiency"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#0a4768] mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of homeowners who have saved money and improved their home's comfort with the InsulationPal network.
            </p>
            <div className="flex justify-center">
              <button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 rounded-lg transition-colors">
                Get Free Quotes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks