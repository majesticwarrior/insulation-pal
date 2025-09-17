import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Wind, Snowflake, Flame, Building, Wrench } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: Home,
      title: 'Attic Insulation',
      description: 'Professional attic insulation installation and replacement. Reduce energy costs and improve comfort.',
      features: ['Blown-in insulation', 'Batt insulation', 'Radiant barriers'],
      price: 'Starting at $1.50/sq ft'
    },
    {
      icon: Building,
      title: 'Wall Insulation',
      description: 'Complete wall insulation services for new construction and retrofits.',
      features: ['Injection foam', 'Blown-in cellulose', 'Fiberglass batts'],
      price: 'Starting at $2.25/sq ft'
    },
    {
      icon: Wind,
      title: 'Spray Foam Insulation',
      description: 'Premium spray foam insulation for maximum energy efficiency and air sealing.',
      features: ['Open-cell spray foam', 'Closed-cell spray foam', 'Air sealing'],
      price: 'Starting at $3.50/sq ft'
    },
    {
      icon: Snowflake,
      title: 'Crawl Space Insulation',
      description: 'Protect your crawl space from moisture and temperature extremes.',
      features: ['Vapor barriers', 'Floor joist insulation', 'Encapsulation'],
      price: 'Starting at $2.00/sq ft'
    },
    {
      icon: Flame,
      title: 'Basement Insulation',
      description: 'Complete basement insulation solutions for comfort and energy savings.',
      features: ['Foundation walls', 'Rim joists', 'Ceiling insulation'],
      price: 'Starting at $2.75/sq ft'
    },
    {
      icon: Wrench,
      title: 'Insulation Removal',
      description: 'Safe removal of old, damaged, or contaminated insulation.',
      features: ['Old insulation removal', 'Contaminated material', 'Pest cleanup'],
      price: 'Starting at $1.25/sq ft'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2c3c50] mb-6">
            Professional Insulation Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From attic insulation to spray foam applications, our network of certified contractors 
            provides comprehensive insulation solutions for every need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="bg-[#F5DD22] w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-[#2c3c50]" />
                  </div>
                  <CardTitle className="text-xl text-[#2c3c50]">{service.title}</CardTitle>
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
                    <div className="text-lg font-bold text-[#2c3c50]">{service.price}</div>
                    <Button variant="outline" className="border-[#2c3c50] text-[#2c3c50] hover:bg-[#2c3c50] hover:text-white">
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#2c3c50] font-semibold px-8 py-3 text-lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Services