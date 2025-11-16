import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { CheckCircle, Star, Shield, MapPin, AlertTriangle, Recycle, Heart } from 'lucide-react'
import type { Metadata } from 'next'
import { createServiceSchemas } from '@/lib/service-schema'

export const metadata: Metadata = {
  title: 'Professional Insulation Removal Services - InsulationPal',
  description: 'Safe removal of old, damaged, or contaminated insulation with proper disposal and cleanup for a fresh start.',
}

export default function InsulationRemovalPage() {
  const schemas = createServiceSchemas('Insulation Removal', '/services/insulation-removal')

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Safety',
      description: 'Remove contaminated or damaged insulation that poses health risks.'
    },
    {
      icon: Recycle,
      title: 'Clean Slate',
      description: 'Prepare your space for new, high-performance insulation installation.'
    },
    {
      icon: Shield,
      title: 'Professional Disposal',
      description: 'Safe, environmentally responsible disposal of old insulation materials.'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Safety Assessment',
      description: 'Evaluate existing insulation for contamination, damage, or hazardous materials.'
    },
    {
      step: 2,
      title: 'Containment Setup',
      description: 'Establish containment barriers to prevent contamination spread.'
    },
    {
      step: 3,
      title: 'Safe Removal',
      description: 'Careful extraction using specialized equipment and safety protocols.'
    },
    {
      step: 4,
      title: 'Cleanup & Disposal',
      description: 'Thorough cleanup and proper disposal according to regulations.'
    }
  ]

  const features = [
    'Old insulation removal',
    'Contaminated material cleanup',
    'Pest damage remediation',
    'Safe disposal services',
    'Asbestos testing & removal',
    'Mold remediation',
    'Rodent cleanup',
    'Pre-installation preparation'
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.brand) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Insulation Removal' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
                Professional Insulation Removal Services
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Safe removal of old, damaged, or contaminated insulation with 
                proper disposal and cleanup for a fresh start.
              </p>

              {/* Quote form */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                  Get Your Free Removal Quote
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter Your Address"
                      className="pl-10 h-12"
                      aria-label="Enter Your Address"
                    />
                  </div>
                  <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold h-12 px-8">
                    Get Free Quote
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  No obligations • Licensed contractors only
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a4768]">Starting at $1.00/sq ft</div>
                <div className="text-gray-500 mt-1" style={{fontSize: '12px'}}>Based on material & region</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <Image
                  src="/insulation-removal.jpg"
                  alt="Professional insulation removal"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  priority
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Safety Protocol:</span>
                    <span className="font-bold text-[#0a4768]">OSHA Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Removal Time:</span>
                    <span className="font-bold text-[#0a4768]">1-2 Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Disposal:</span>
                    <span className="font-bold text-[#0a4768]">Eco-Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Why Professional Insulation Removal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional removal ensures safety, proper disposal, and prepares 
              your space for optimal new insulation performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a4768] mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-[#D8E1FF]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Safe Removal Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our systematic approach ensures safe removal while protecting your 
              home and family from contamination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0a4768]">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0a4768] mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
                Comprehensive Removal Services
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our certified contractors handle all types of insulation removal 
                with specialized equipment and safety protocols.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#0a4768] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src="/professional-insulation-contractor-working-on-home.jpg"
                alt="Insulation removal process"
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need Professional Insulation Removal?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Connect with certified removal specialists in your area. 
            Safe, professional service with proper disposal guaranteed.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Find Contractors Near Me
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
    </>
  )
}