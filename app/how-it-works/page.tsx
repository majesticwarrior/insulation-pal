import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, Users, CheckCircle, Star, MapPin, Clock, Shield, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - InsulationPal | 4 Simple Steps to Connect with Contractors',
  description: 'Get connected with trusted insulation contractors in 4 simple steps. Fast, easy, and completely free for homeowners. Tell us your needs, get matched, compare quotes, and hire the best.',
  keywords: 'how InsulationPal works, hire insulation contractor, get insulation quotes, contractor matching process',
  openGraph: {
    title: 'How InsulationPal Works - Connect with Contractors in 4 Steps',
    description: 'Learn how InsulationPal connects homeowners with trusted insulation contractors through our simple 4-step process.',
    type: 'website',
  },
}

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      icon: Search,
      title: 'Tell Us Your Needs',
      description: 'Enter your address and describe your insulation project. Our system matches you with qualified contractors in your area.',
      details: [
        'Specify your insulation type',
        'Describe project scope',
        'Set your timeline',
        'Upload photos if needed'
      ]
    },
    {
      step: 2,
      icon: Users,
      title: 'Get Matched with Pros',
      description: 'We connect you with up to 3 licensed, insured contractors who specialize in your type of project.',
      details: [
        'All contractors are pre-screened',
        'Licensed and insured',
        'Local to your area',
        'Verified customer reviews'
      ]
    },
    {
      step: 3,
      icon: DollarSign,
      title: 'Compare Free Quotes',
      description: 'Receive detailed quotes instantly. Compare prices, services, and contractor profiles.',
      details: [
        'Detailed breakdown of costs',
        'Material specifications',
        'Timeline estimates',
        'Warranty information'
      ]
    },
    {
      step: 4,
      icon: CheckCircle,
      title: 'Choose & Schedule',
      description: 'Select your preferred contractor and schedule your insulation installation at your convenience.',
      details: [
        'Read verified reviews',
        'Check contractor credentials',
        'Schedule installation',
        'Secure project timeline'
      ]
    }
  ]

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Trusted Network',
      description: 'All contractors are thoroughly vetted, licensed, and insured for your protection.',
      stat: '100% Verified'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Every project comes with quality assurance and satisfaction guarantee.',
      stat: '4.8/5 Rating'
    },
    {
      icon: Clock,
      title: 'Fast Matching',
      description: 'Get matched with contractors within hours, not days or weeks.',
      stat: 'Instant Response'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Compare multiple quotes to ensure you get the best value for your project.',
      stat: 'Save up to 30%'
    }
  ]

  const faqs = [
    {
      question: 'How long does it take to get matched with contractors?',
      answer: 'Most customers are matched with qualified contractors instantly upon submitting their request. Response times may vary based on location and project complexity.'
    },
    {
      question: 'Are all contractors licensed and insured?',
      answer: 'Yes, every contractor in our network is thoroughly vetted, properly licensed, and carries comprehensive insurance coverage for your protection.'
    },
    {
      question: 'Is there any cost to use InsulationPal?',
      answer: 'No, our matching service is completely free for homeowners. You only pay the contractor you choose for the work performed.'
    },
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'We stand behind all work done by our contractors. If you\'re not satisfied, we\'ll work with you and the contractor to resolve any issues.'
    },
    {
      question: 'How many quotes will I receive?',
      answer: 'You\'ll typically receive 2-3 detailed quotes from qualified contractors, allowing you to compare options and choose the best fit for your project.'
    },
    {
      question: 'Can I see contractor reviews before choosing?',
      answer: 'Absolutely! All contractor profiles include verified customer reviews, ratings, and examples of their previous work to help you make an informed decision.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0a4768] mb-6">
              How InsulationPal Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get connected with trusted insulation contractors in 4 simple steps. 
              Fast, easy, and completely free for homeowners.
            </p>
            
            {/* Quick Quote Form */}
            <div className="bg-white rounded-lg shadow-xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[#0a4768] mb-4">
                Get Started Now
              </h3>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter Your Address"
                    className="pl-10 h-12"
                  />
                </div>
                <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold h-12">
                  Find Contractors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From request to completion, we make finding the right insulation contractor easy and stress-free.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="flex items-center mb-6">
                      <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl font-bold text-[#0a4768]">{step.step}</span>
                      </div>
                      <div className="bg-[#0a4768] w-16 h-16 rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-[#0a4768] mb-4">{step.title}</h3>
                    <p className="text-xl text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-[#0a4768] mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <Card className="shadow-xl">
                      <CardContent className="p-8">
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                          <Icon className="h-24 w-24 text-[#0a4768]" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#D8E1FF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Why Choose InsulationPal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to connecting homeowners with the best insulation contractors in their area.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                    <div className="text-2xl font-bold text-[#0a4768] mb-2">{feature.stat}</div>
                    <h3 className="text-xl font-bold text-[#0a4768] mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0a4768] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our service and the insulation process.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-[#0a4768] hover:text-[#F5DD22]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#0a4768] mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who have found their perfect insulation contractor through InsulationPal.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Find My Contractor
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}
