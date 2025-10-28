'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { QuoteButton } from '@/components/ui/quote-button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does InsulationPal work, and how can it actually save me time and stress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InsulationPal simplifies the entire insulation process by connecting you with verified, licensed contractors in your area. Instead of spending hours researching contractors, comparing reviews, and making multiple phone calls, you simply submit one free quote request through our platform. You'll receive competitive quotes from pre-screened contractors within 24 hours, saving you time and eliminating the stress of finding quality professionals."
        }
      },
      {
        "@type": "Question",
        "name": "How can InsulationPal help me save money on insulation installation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InsulationPal helps you save money by receiving multiple quotes from different contractors so you can compare prices and choose the best value for your budget. All contractors provide detailed, upfront quotes with no surprise costs, and our service is completely free with no middleman fees. Additionally, proper insulation can reduce your energy bills by 20-30%, saving you $300-$700+ annually, and often qualifies for rebates and tax credits."
        }
      },
      {
        "@type": "Question",
        "name": "Why should I add insulation to my home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Adding insulation to your home provides multiple benefits: lower energy bills with up to 30% reduction in heating and cooling costs, improved comfort by eliminating hot and cold spots, reduced noise for a quieter living environment, increased home value with better appraisal and faster sales, better air quality by preventing moisture buildup, and lower environmental impact through reduced energy consumption."
        }
      },
      {
        "@type": "Question",
        "name": "Is InsulationPal only for insulation or can I get other services as well?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InsulationPal focuses on connecting homeowners with expert insulation contractors for all types of insulation including attic, wall, spray foam, crawl space, basement, and blown-in insulation. Many of our contractor partners also offer related services such as air sealing, weatherization, ductwork sealing, attic ventilation improvements, and energy audits."
        }
      },
      {
        "@type": "Question",
        "name": "How does payment work once the job is completed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InsulationPal makes payment simple and secure. You only pay once the insulation work is completed to your satisfaction, and you pay the contractor directly (InsulationPal never handles your money). Contractors typically accept cash, check, credit card, or financing options. For larger jobs, a deposit is often split (typically 30-50%) at contract signing with the balance upon completion."
        }
      },
      {
        "@type": "Question",
        "name": "How much energy saving can I see from adding insulation to my home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Homeowners typically see 20-30% reduction in heating and cooling costs, amounting to $300-$700+ in annual savings. A typical 1,500-square-foot home in a moderate climate can save $300-$500 annually with proper attic insulation alone. Most insulation projects pay for themselves within 3-5 years through energy savings and continue saving for the life of your home."
        }
      },
      {
        "@type": "Question",
        "name": "What is the average cost to add insulation to my attic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Attic insulation costs typically range from $800-$2,500 for a typical 1,200-square-foot attic with blown-in insulation or batts, or $2,000-$4,500 for spray foam insulation. Costs are affected by attic size, current insulation, material type, R-value needed, accessibility, and regional pricing. Blown-in insulation typically costs $1-$3 per square foot, while spray foam ranges from $3-$7 per square foot."
        }
      },
      {
        "@type": "Question",
        "name": "What types of insulation should I add in my attic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best type of attic insulation depends on your home's specific needs, budget, and local climate. Options include: Blown-in fiberglass (cost-effective, R-2.2 to R-2.9 per inch), Blown-in cellulose (eco-friendly, R-3.2 to R-3.8 per inch, better soundproofing), Spray foam (highest R-value up to R-6.5 per inch, excellent air barrier), and Fiberglass batts (DIY-friendly, lower cost). For most homes, blown-in insulation offers the best balance of performance and cost."
        }
      }
    ]
  }

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Articles', href: '/resources/articles' },
        { label: 'FAQ' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Link 
                href="/resources/articles" 
                className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Everything you need to know about InsulationPal, insulation installation, costs, and energy savings.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  How does InsulationPal work, and how can it actually save me time and stress?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    InsulationPal simplifies the entire insulation process by connecting you with verified, licensed contractors in your area. Instead of spending hours researching contractors, comparing reviews, and making multiple phone calls, you simply submit one free quote request through our platform.
                  </p>
                  <p className="mb-4">
                    Here's how we save you time and stress:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Instant matching:</strong> Our system immediately connects you with qualified insulation contractors based in your city</li>
                    <li><strong>No endless research:</strong> We've already verified each contractor's licensing, insurance, and certifications</li>
                    <li><strong>Multiple quotes:</strong> Get competitive quotes from several contractors without making any phone calls</li>
                    <li><strong>Protected quotes:</strong> All contractors are pre-screened for quality and reliability</li>
                  </ul>
                  <p>
                    The entire process takes less than 60 seconds, and you'll receive quotes within 24 hours - no more being put on hold or navigating complex contractor websites.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  How can InsulationPal help me save money on insulation installation?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    InsulationPal helps you save money in several key ways:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Competitive pricing:</strong> By receiving multiple quotes from different contractors, you can compare prices and choose the best value for your budget</li>
                    <li><strong>Transparent pricing:</strong> All contractors provide detailed, upfront quotes so there are no surprise costs</li>
                    <li><strong>No middleman fees:</strong> We connect you directly with contractors, eliminating unnecessary markups</li>
                    <li><strong>Free quotes:</strong> Our service is completely free - you only pay the contractor once you accept a quote</li>
                    <li><strong>Quality assurance:</strong> Our pre-screening ensures contractors provide fair pricing without sacrificing quality</li>
                  </ul>
                  <p className="mb-4">
                    Additionally, proper insulation installation delivers ongoing savings:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Lower energy bills due to reduced heating and cooling costs</li>
                    <li>Increased home value - well-insulated homes sell faster and for more</li>
                    <li>Reduced maintenance costs from fewer HVAC system repairs</li>
                    <li>Potential rebates and tax credits for energy-efficient improvements</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  Why should I add insulation to my home?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    Adding insulation to your home is one of the smartest investments you can make. Here are the key benefits:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Lower energy bills:</strong> Proper insulation can reduce heating and cooling costs by up to 30%, saving you hundreds of dollars annually</li>
                    <li><strong>Improved comfort:</strong> Eliminate hot and cold spots throughout your home for consistent temperature control</li>
                    <li><strong>Reduced noise:</strong> Insulation provides excellent soundproofing, creating a quieter living environment</li>
                    <li><strong>Environmental benefits:</strong> Lower energy consumption reduces your carbon footprint and environmental impact</li>
                    <li><strong>Increased home value:</strong> Well-insulated homes typically appraise higher and sell faster</li>
                    <li><strong>Better air quality:</strong> Proper insulation helps prevent moisture buildup and air leaks that can lead to mold and mildew</li>
                    <li><strong>Less wear on HVAC systems:</strong> Reduced strain on heating and cooling systems extends their lifespan</li>
                  </ul>
                  <p>
                    Whether your home is new or old, adding or upgrading insulation pays for itself through energy savings and often improves your home's overall value.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  Is InsulationPal only for insulation or can I get other services as well?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    InsulationPal primarily focuses on connecting homeowners with expert insulation contractors for all types of insulation needs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Attic insulation</li>
                    <li>Wall insulation</li>
                    <li>Spray foam insulation</li>
                    <li>Crawl space insulation</li>
                    <li>Basement insulation</li>
                    <li>Insulation removal</li>
                    <li>Blown-in insulation</li>
                    <li>Batt and roll insulation</li>
                  </ul>
                  <p className="mb-4">
                    Many of our contractor partners also offer related services such as:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Air sealing and weatherization</li>
                    <li>Ductwork sealing</li>
                    <li>Attic ventilation improvements</li>
                    <li>Energy audits</li>
                  </ul>
                  <p className="mt-4">
                    When you receive quotes from our contractors, feel free to discuss any additional services you might need. Many contractors offer bundled services for better pricing on multiple home improvements.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  How does payment work once the job is completed?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    InsulationPal makes the payment process simple and secure:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Pay only after completion:</strong> You only pay once the insulation work is completed to your satisfaction</li>
                    <li><strong>Direct contractor payment:</strong> You pay the contractor directly - InsulationPal never handles your money</li>
                    <li><strong>Multiple payment options:</strong> Contractors typically accept cash, check, credit card, or financing options</li>
                    <li><strong>Clear payment terms:</strong> Your quote will include all payment terms upfront before you accept</li>
                  </ul>
                  <p className="mb-4">
                    Typical payment arrangements:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>For small jobs: Payment upon completion</li>
                    <li>For larger jobs: Often split between a deposit at contract signing (typically 30-50%) and the balance upon completion</li>
                    <li>Financing: Many contractors offer financing plans for larger projects</li>
                  </ul>
                  <p>
                    Remember, you have the final say on when the job is complete. Never pay in full before the work is done, and always inspect the completed work before making final payment.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  How much energy saving can I see from adding insulation to my home?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    The amount of energy savings you'll see depends on several factors, including the current state of your insulation, your climate, and your home's size. However, homeowners typically see significant savings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>20-30% reduction in heating and cooling costs</strong> - This is the most common savings range for homeowners who add proper insulation</li>
                    <li><strong>$100-$300+ annually per heating season</strong> in colder climates</li>
                    <li><strong>$150-$400+ annually</strong> in cooling costs in warmer climates</li>
                    <li><strong>Combined savings often reach $300-$700+ per year</strong> in total energy costs</li>
                  </ul>
                  <p className="mb-4">
                    Factors that affect your specific savings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Your home's current insulation level (adding insulation to homes with none or very little yields the biggest savings)</li>
                    <li>Your local climate (more extreme temperatures = bigger savings)</li>
                    <li>Your home's size and layout</li>
                    <li>The type of insulation installed (some types, like spray foam, can provide better energy savings)</li>
                    <li>Quality of installation (properly installed insulation performs significantly better)</li>
                  </ul>
                  <p className="mb-4">
                    Real-world example: A typical 1,500-square-foot home in a moderate climate can save $300-$500 annually with proper attic insulation alone.
                  </p>
                  <p>
                    The good news? Most insulation projects pay for themselves within 3-5 years through energy savings alone, and you'll continue saving for the life of your home.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  What is the average cost to add insulation to my attic?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    Attic insulation costs vary widely based on several factors. Here are typical price ranges:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Blown-in insulation (fiberglass or cellulose):</strong> $1,000-$2,500 for a typical 1,200-square-foot attic</li>
                    <li><strong>Batt insulation:</strong> $800-$2,000 for a typical attic</li>
                    <li><strong>Spray foam insulation:</strong> $2,000-$4,500 for a typical attic (more expensive but offers superior performance)</li>
                    <li><strong>Insulation removal:</strong> $500-$1,500 before installing new insulation</li>
                  </ul>
                  <p className="mb-4">
                    Factors affecting cost:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li><strong>Attic size:</strong> Larger attics cost more</li>
                    <li><strong>Current insulation:</strong> Homes with old insulation may need removal first</li>
                    <li><strong>Material type:</strong> Different materials have different costs</li>
                    <li><strong>R-value needed:</strong> Higher R-values typically cost more</li>
                    <li><strong>Accessibility:</strong> Difficult-to-access attics cost more</li>
                    <li><strong>Regional pricing:</strong> Labor costs vary by location</li>
                  </ul>
                  <p className="mb-4">
                    Cost per square foot estimates:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Blown-in fiberglass: $1-$3 per square foot</li>
                    <li>Blown-in cellulose: $1-$3 per square foot</li>
                    <li>Fiberglass batts: $1-$2 per square foot</li>
                    <li>Spray foam (closed-cell): $3-$7 per square foot</li>
                  </ul>
                  <p>
                    The best way to get an accurate estimate for your specific home is to request free quotes through InsulationPal. Our contractors will assess your attic and provide detailed quotes based on your home's unique needs.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-xl font-semibold text-[#0a4768] hover:text-[#0a4768]/80 py-6">
                  What types of insulation should I add in my attic?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg leading-relaxed pb-6">
                  <p className="mb-4">
                    The best type of attic insulation depends on your home's specific needs, budget, and local climate. Here are the most common options:
                  </p>
                  <p className="mb-4 font-semibold">1. Blown-in Fiberglass</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>Cost-effective and widely available</li>
                    <li>Excellent for filling gaps and hard-to-reach areas</li>
                    <li>R-value of about R-2.2 to R-2.9 per inch</li>
                    <li>Resistant to moisture and doesn't settle significantly</li>
                  </ul>
                  
                  <p className="mb-4 font-semibold">2. Blown-in Cellulose</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>Made from recycled paper products (eco-friendly)</li>
                    <li>Slightly better R-value than fiberglass (R-3.2 to R-3.8 per inch)</li>
                    <li>Superior soundproofing properties</li>
                    <li>Treated with fire retardants for safety</li>
                  </ul>
                  
                  <p className="mb-4 font-semibold">3. Spray Foam</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>Highest R-value (up to R-6.5 per inch for closed-cell)</li>
                    <li>Creates an excellent air barrier</li>
                    <li>Provides moisture protection</li>
                    <li>More expensive but offers superior performance</li>
                    <li>Best for sealing air leaks while insulating</li>
                  </ul>
                  
                  <p className="mb-4 font-semibold">4. Fiberglass Batts</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>DIY-friendly option</li>
                    <li>Easy to install in open attics</li>
                    <li>Lower cost for DIY projects</li>
                    <li>Requires careful installation to avoid gaps</li>
                  </ul>
                  
                  <p className="mb-4">
                    <strong>Which is right for you?</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>For most homes: Blown-in insulation (fiberglass or cellulose) offers the best balance of performance and cost</li>
                    <li>For maximum performance: Spray foam provides superior insulation and air sealing</li>
                    <li>For budget-conscious projects: Fiberglass batts are cost-effective but require more care in installation</li>
                    <li>Your contractor will assess your attic and recommend the best option based on your home's specific needs, local climate requirements, and budget</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our local insulation contractors are ready to answer all your questions and provide free, detailed quotes for your home's insulation needs.
          </p>
          <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg">
            Get Free Quotes
          </QuoteButton>
        </div>
      </section>

      <Footer />
    </main>
  )
}

