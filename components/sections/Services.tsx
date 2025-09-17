import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Services = () => {
  const services = [
    {
      icon: '/attic-insulation-icon.jpg',
      title: 'Attic Insulation',
      description: 'Professional attic insulation installation. Reduce energy costs and improve comfort.',
      features: ['Blown-in insulation', 'Batt insulation', 'Radiant barriers'],
      price: 'Starting at $1.00/sq ft',
      disclaimer: 'Based on material & region',
      link: '/services/attic-insulation'
    },
    {
      icon: '/wall-insulation-icon.jpg',
      title: 'Wall Insulation',
      description: 'Complete wall insulation services for new construction and retrofits.',
      features: ['Injection foam', 'Blown-in cellulose', 'Fiberglass batts'],
      price: 'Starting at $1.00/sq ft',
      disclaimer: 'Based on material & region',
      link: '/services/wall-insulation'
    },
    {
      icon: '/spray-foam-icon.jpg',
      title: 'Spray Foam Insulation',
      description: 'Premium spray foam insulation for maximum energy efficiency and air sealing.',
      features: ['Open-cell spray foam', 'Closed-cell spray foam', 'Air sealing'],
      price: 'Starting at $1.00/sq ft',
      disclaimer: 'Based on material & region',
      link: '/services/spray-foam'
    },
    {
      icon: '/crawl-space-insulation-icon.jpg',
      title: 'Crawl Space Insulation',
      description: 'Protect your crawl space from moisture and temperature extremes.',
      features: ['Vapor barriers', 'Floor joist insulation', 'Encapsulation'],
      price: 'Starting at $.30/board ft',
      disclaimer: 'Based on material & region',
      link: '/services/crawl-space'
    },
    {
      icon: '/basement-insulation-icon.jpg',
      title: 'Basement Insulation',
      description: 'Complete basement insulation solutions for comfort and energy savings.',
      features: ['Foundation walls', 'Rim joists', 'Ceiling insulation'],
      price: 'Starting at $1.45/sq ft',
      disclaimer: 'Based on material & region',
      link: '/services/basement'
    },
    {
      icon: '/insulation-removal-icon.jpg',
      title: 'Insulation Removal',
      description: 'Safe removal of old, damaged, or contaminated insulation.',
      features: ['Old insulation removal', 'Contaminated material', 'Pest cleanup'],
      price: 'Starting at $1.00/sq ft',
      disclaimer: 'Based on material & region',
      link: '/services/removal'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
            Professional Insulation Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From attic insulation to spray foam applications, our network of certified contractors 
            provides comprehensive insulation solutions for every need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="bg-[#F5DD22] w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                    <Image
                      src={service.icon}
                      alt={`${service.title} icon`}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </div>
                  <CardTitle className="text-xl text-[#0a4768]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-[#F5DD22] rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-[#0a4768]">{service.price}</div>
                      <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>{service.disclaimer}</div>
                    </div>
                    <Link href={service.link}>
                      <Button variant="outline" className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Services