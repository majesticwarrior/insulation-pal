import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import InsulationCalculator from '@/components/pages/InsulationCalculator'
import Link from 'next/link'
import { ArrowLeft, FileText, Wrench, Quote } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insulation Calculator: Estimate Insulation Needed and Costs for Your Project - InsulationPal',
  description: 'Calculate exactly how much insulation you need for your project using our free insulation calculator. Get accurate estimates for walls, attics, crawl spaces, and more.',
}

export default function InsulationCalculatorPage() {

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I calculate the amount of insulation needed for my entire home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Measure each area—walls, attic, floors, basement—separately. Each needs different R-values depending on your code and climate. For walls, multiply height by length for each section, subtracting windows and doors. Do the same for ceilings and floors. Add up the total square footage for each type. Attics often need R-38 to R-60, walls R-13 to R-21, and floors R-25 to R-30, but check your local requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What is the formula to determine the insulation required for my walls?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The total R-value is the sum of each layer's R-value times its thickness: R-total = (R₁ × t₁) + (R₂ × t₂) + (R₃ × t₃) + ... where R is per inch and t is thickness in inches. For area, multiply wall height by length, and subtract windows, doors, and openings. Divide your required R-value by your chosen insulation's R-value per inch to get the thickness you'll need to meet code."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a tool available for calculating insulation needed for a specific square footage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes—insulation calculators let you enter square footage, R-value, and insulation type. Input your wall, ceiling, or floor area and the calculator tells you how much you'll need. Most online tools give results in batts, rolls, or bags, and they factor in standard stud spacing (16 or 24 inches on center). They'll usually convert units for you and adjust for material compression. Some even add a bit for waste—usually 5-10% for cutting and fitting."
        }
      },
      {
        "@type": "Question",
        "name": "How do I estimate the cost of insulation for a garage of a given size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Measure the garage's wall, ceiling, and door areas separately. A typical two-car garage has 400-600 sq ft of wall and 400-500 sq ft of ceiling. Multiply each area by your insulation's cost per square foot. Fiberglass batts run about $0.50-$1.50/sq ft; spray foam is $1.50-$3.50/sq ft. If you're hiring out, add labor costs: $1-$2/sq ft for batts, $2-$4/sq ft for spray foam."
        }
      },
      {
        "@type": "Question",
        "name": "What measurements are required to calculate the coverage of a roll of insulation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll need the roll's length, width, and thickness. Standard rolls are 48 inches wide and 32-64 feet long—so they cover 75-200 sq ft, depending on stud spacing. Measure the distance between your studs or joists. Rolls for 16-inch spacing are a different width than those for 24-inch spacing. See how many linear feet one roll covers at your width. Divide your total area by the roll's coverage to see how many rolls you'll need."
        }
      },
      {
        "@type": "Question",
        "name": "Can the insulation level of ceilings be accurately estimated with an online calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Online calculators can give pretty solid estimates for ceiling insulation—if you plug in the right measurements and details. You'll need to know your ceiling area, what R-value you've already got, and the target R-value for your climate zone. Attic insulation calculators try to account for odd spaces, vaulted ceilings, and those tricky spots around pipes or vents. Some even factor in how blown-in insulation settles over time, usually shrinking by about 10-20% in thickness. The recommended R-value for ceilings can swing quite a bit, from R-30 if you're somewhere warm to R-60 up north. Always double-check your results with what's on the product packaging and your local building codes."
        }
      }
    ]
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Insulation Calculator: Accurate Estimates for Your Project",
    "description": "Calculate exactly how much insulation you need for your project using dimensions, R-values, and insulation types.",
    "author": {
      "@type": "Organization",
      "name": "InsulationPal"
    },
    "publisher": {
      "@type": "Organization",
      "name": "InsulationPal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://insulationpal.com/insulation-pal-logo.png"
      }
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      
      <main className="min-h-screen">
        <Header />
        
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: 'Insulation Calculator' }
        ]} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <Link
              href="/resources"
              className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
            </Link>
            <h1 className="text-[18px] font-bold text-[#0a4768] mb-4">
              Insulation Calculator: Accurate Estimates for Your Project
            </h1>
            <p className="text-base text-gray-700">
              Figuring out the right amount of insulation for your project can really save you time, money, and a lot of hassle with leftover material. <strong>An insulation calculator lets you pin down exactly how much insulation you'll need, using your project's dimensions, the R-value you want, and the type of insulation you've got in mind.</strong> Whether it's walls, attics, crawl spaces, or ceilings, these tools give you quick estimates and take a lot of the guesswork out of your planning.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-10">
                {/* Calculator Section */}
                <InsulationCalculator />

                {/* Content Section */}
                <section className="space-y-4">
                  <p className="text-base text-gray-700">
                    This guide aims to help you get a handle on how insulation calculators work and what info you'll need for decent results. If your calculations are right from the start, you'll avoid overbuying and hit those energy efficiency targets you're after.
                  </p>
                  <p className="text-base text-gray-700">
                    Knowing what affects your insulation needs makes it a lot easier to make smart choices for your home improvement. We'll walk through the calculation process, look at the variables that matter most, and tackle some of the usual questions that pop up during insulation planning.
                  </p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">How to Use an Insulation Calculator</h2>
                  <p className="text-base text-gray-700">
                    To use an insulation calculator, you'll need three things: accurate square footage, the insulation type (with its R-value), and the cavity depth, so you know everything will fit.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Measuring Square Footage</h3>
                      <p className="text-base text-gray-700">
                        For horizontal surfaces like attics and floors, multiply length by width. For walls, it's length times height. Don't forget to subtract windows and doors to get the real area you need to insulate.
                      </p>
                      <p className="text-base text-gray-700">
                        Most calculators take measurements in feet or meters. It's usually easiest to measure each wall or ceiling section separately, then add them up for the total.
                      </p>
                      <p className="text-base text-gray-700">
                        When dealing with walls with studs, just measure the full wall dimensions. The calculator figures out the stud spacing for you when it comes to how much material you'll need.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Selecting Insulation Type and R-Value</h3>
                      <p className="text-base text-gray-700">
                        Different insulation types have different R-values per inch. Fiberglass batts are usually R-3 to R-4 per inch, while spray foam can go from R-3.5 up to R-6.5, depending on the type.
                      </p>
                      <p className="text-base text-gray-700">
                        Pick your target R-value based on your climate zone and whatever your building code says. Cold climates call for R-49 to R-60 in attics and R-21 in walls, while warmer areas might only need R-30 in attics and R-13 in walls.
                      </p>
                      <p className="text-base text-gray-700">
                        The calculator uses this formula: <strong>Thickness Needed = Target R-Value ÷ R-Value per Inch</strong>. That way, you know you're hitting the thermal resistance you need for your area.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Factoring in Insulation Thickness and Cavity Depth</h3>
                      <p className="text-base text-gray-700">
                        Enter your stud or joist depth to make sure your chosen insulation actually fits. Standard wall cavities are 3.5 inches deep for 2x4 studs, or 5.5 inches for 2x6s.
                      </p>
                      <p className="text-base text-gray-700">
                        If your target R-value needs more thickness than your cavity can handle, you've got a couple of options: switch to a material with a higher R-value per inch, like spray foam, or add continuous insulation over the studs. Don't try to cram too much insulation in—compressing it can cut its R-value by as much as half.
                      </p>
                      <p className="text-base text-gray-700">
                        The calculator tells you how many rolls, batts, or bags you'll need by dividing your area by the coverage per unit for your chosen product.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Key Factors in Insulation Planning</h2>
                  <p className="text-base text-gray-700">
                    Good insulation planning is about balancing your R-value goals with your local climate, the structure itself, and any code requirements. You also have to think about the material's properties and how it handles moisture if you want it to last.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Climate Zone and Energy Efficiency</h3>
                      <p className="text-base text-gray-700">
                        Your climate zone sets the minimum thermal resistance you'll need for energy efficiency. The U.S. Department of Energy divides the country into eight climate zones, each with its own heating and cooling needs, and that impacts the R-values you'll need.
                      </p>
                      <p className="text-base text-gray-700">
                        Up north, where winters drag on, attics usually need R-49 to R-60. Down south, where it's more about keeping cool, you might only need R-30 to R-38. These numbers come from annual temperature data and the balance between heating and cooling days.
                      </p>
                      <p className="text-base text-gray-700">
                        Higher R-values mean less heat sneaks in or out, so your HVAC runs less and your utility bills drop. Over time, the money you put into better insulation pays off, especially in places with big temperature swings between inside and out.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Local Building Codes and Framing Considerations</h3>
                      <p className="text-base text-gray-700">
                        Building codes spell out the minimum R-values for each part of your home's envelope. The International Energy Conservation Code (IECC) sets the baseline, but local areas might tweak it. Always check the latest code and any local changes before you settle on your insulation plan.
                      </p>
                      <p className="text-base text-gray-700">
                        Your wall or ceiling framing limits the insulation types you can use. A standard 2x4 wall cavity is 3.5 inches deep, so you're looking at about R-13 or R-15 with batts. If you've got 2x6 framing (5.5 inches), you can bump that up to R-19 or R-21.
                      </p>
                      <p className="text-base text-gray-700">
                        For higher R-values in walls, you might need continuous insulation outside the framing, which also helps cut down on heat loss through the studs. Codes are starting to require this more often—think R-13 in the cavity, plus R-5 as exterior sheathing. The framing type and spacing matter too, since heat can sneak through solid wood or steel.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Choosing Insulation Material and Types</h3>
                      <p className="text-base text-gray-700">
                        Insulation types all have their own R-values per inch, so picking the right one depends on your space, your R-value target, moisture issues, and how it'll be installed.
                      </p>

                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                          <thead className="bg-[#F5F6FB]">
                            <tr>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Insulation Type</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">R-Value per Inch</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Best Applications</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Fiberglass batts</td>
                              <td className="px-4 py-3">R-3.2 to R-3.8</td>
                              <td className="px-4 py-3">Standard wall and attic cavities</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Loose-fill fiberglass</td>
                              <td className="px-4 py-3">R-2.5 to R-3.5</td>
                              <td className="px-4 py-3">Open attics, irregular spaces</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Cellulose (loose-fill)</td>
                              <td className="px-4 py-3">R-3.2 to R-3.8</td>
                              <td className="px-4 py-3">Attic insulation, dense-pack walls</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Closed-cell spray foam</td>
                              <td className="px-4 py-3">R-6.0 to R-7.0</td>
                              <td className="px-4 py-3">Limited cavities, air sealing</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Open-cell spray foam</td>
                              <td className="px-4 py-3">R-3.5 to R-3.6</td>
                              <td className="px-4 py-3">Interior walls, sound dampening</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Rigid foam board</td>
                              <td className="px-4 py-3">R-4.0 to R-6.5</td>
                              <td className="px-4 py-3">Continuous exterior insulation</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="text-base text-gray-700">
                        Batt insulation is usually the most affordable for standard framing, as long as it's installed right—no gaps, no squishing. Spray foam costs more, but it seals air leaks and packs more R-value into tight spots. To figure out how much you need, just divide your target R-value by the material's R-value per inch to get the thickness required.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Frequently Asked Questions</h2>
                  <p className="text-base text-gray-700">
                    Calculating insulation means knowing your R-values, insulation thickness, and which parts of your home need coverage. You'll need accurate measurements and to know what your climate zone recommends.
                  </p>

                  <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  How do I calculate the amount of insulation needed for my entire home?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    Measure each area—walls, attic, floors, basement—separately. Each needs different R-values depending on your code and climate.
                  </p>
                  <p className="mb-3">
                    For walls, multiply height by length for each section, subtracting windows and doors. Do the same for ceilings and floors.
                  </p>
                  <p>
                    Add up the total square footage for each type. Attics often need R-38 to R-60, walls R-13 to R-21, and floors R-25 to R-30, but check your local requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  What is the formula to determine the insulation required for my walls?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    The total R-value is the sum of each layer's R-value times its thickness: R-total = (R₁ × t₁) + (R₂ × t₂) + (R₃ × t₃) + ... where R is per inch and t is thickness in inches.
                  </p>
                  <p className="mb-3">
                    For area, multiply wall height by length, and subtract windows, doors, and openings.
                  </p>
                  <p>
                    Divide your required R-value by your chosen insulation's R-value per inch to get the thickness you'll need to meet code.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  Is there a tool available for calculating insulation needed for a specific square footage?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    Yes—insulation calculators let you enter square footage, R-value, and insulation type. Input your wall, ceiling, or floor area and the calculator tells you how much you'll need.
                  </p>
                  <p className="mb-3">
                    Most online tools give results in batts, rolls, or bags, and they factor in standard stud spacing (16 or 24 inches on center).
                  </p>
                  <p>
                    They'll usually convert units for you and adjust for material compression. Some even add a bit for waste—usually 5-10% for cutting and fitting.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  How do I estimate the cost of insulation for a garage of a given size?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    Measure the garage's wall, ceiling, and door areas separately. A typical two-car garage has 400-600 sq ft of wall and 400-500 sq ft of ceiling.
                  </p>
                  <p className="mb-3">
                    Multiply each area by your insulation's cost per square foot. Fiberglass batts run about $0.50-$1.50/sq ft; spray foam is $1.50-$3.50/sq ft.
                  </p>
                  <p>
                    If you're hiring out, add labor costs: $1-$2/sq ft for batts, $2-$4/sq ft for spray foam.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  What measurements are required to calculate the coverage of a roll of insulation?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    You'll need the roll's length, width, and thickness. Standard rolls are 48 inches wide and 32-64 feet long—so they cover 75-200 sq ft, depending on stud spacing.
                  </p>
                  <p className="mb-3">
                    Measure the distance between your studs or joists. Rolls for 16-inch spacing are a different width than those for 24-inch spacing.
                  </p>
                  <p>
                    See how many linear feet one roll covers at your width. Divide your total area by the roll's coverage to see how many rolls you'll need.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-semibold text-[#0a4768]">
                  Can the insulation level of ceilings be accurately estimated with an online calculator?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p className="mb-3">
                    Online calculators can give pretty solid estimates for ceiling insulation—if you plug in the right measurements and details. You'll need to know your ceiling area, what R-value you've already got, and the target R-value for your climate zone. It's not rocket science, but you've got to be careful with your numbers.
                  </p>
                  <p className="mb-3">
                    Attic insulation calculators try to account for odd spaces, vaulted ceilings, and those tricky spots around pipes or vents. Some even factor in how blown-in insulation settles over time, usually shrinking by about 10-20% in thickness. That's a detail a lot of people miss, honestly.
                  </p>
                  <p>
                    The recommended R-value for ceilings can swing quite a bit, from R-30 if you're somewhere warm to R-60 up north. Always double-check your results with what's on the product packaging and your local building codes—just to be safe.
                  </p>
                </AccordionContent>
              </AccordionItem>
                  </Accordion>
                </section>

                <section className="space-y-4">
                  <div className="bg-[#D8E1FF] border border-[#0a4768]/10 rounded-lg p-6 space-y-4">
                    <p className="text-base text-[#0a4768] font-semibold">
                      Need professional help with your insulation project?
                    </p>
                    <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold w-full sm:w-auto">
                      Get Contractor Quotes
                    </QuoteButton>
                  </div>
                </section>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 lg:top-32 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#0a4768] mb-4">Get Started</h3>
                    <div className="space-y-3">
                      <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                        <Quote className="mr-2 h-4 w-4" />
                        Request Contractor Quotes
                      </QuoteButton>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a4768]">More to Explore</h3>
                    <div className="space-y-3">
                      <Link
                        href="/resources/articles"
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center text-[#0a4768]">
                          <FileText className="h-4 w-4 mr-2" />
                          Insulation Articles
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Deep dives, tips, and expert checklists</p>
                      </Link>
                      <Link
                        href="/resources/diy"
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center text-[#0a4768]">
                          <Wrench className="h-4 w-4 mr-2" />
                          DIY Guides
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Step-by-step installation guides</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}

