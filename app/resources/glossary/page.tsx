import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import type { Metadata } from 'next'
import { glossaryByLetter, availableLetters } from '@/lib/glossary-data'

export const metadata: Metadata = {
  title: 'Insulation Glossary - Complete Guide to Insulation Terms - InsulationPal',
  description: 'Comprehensive glossary of insulation terms, definitions, and explanations. Learn about different types of insulation, materials, and terminology.',
  keywords: 'insulation glossary, insulation terms, insulation definitions, insulation dictionary, thermal insulation terms',
  openGraph: {
    title: 'Insulation Glossary - InsulationPal',
    description: 'Complete guide to insulation terminology and definitions.',
    type: 'website',
  },
}

export default function GlossaryPage() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <main className="min-h-screen">
      <Header />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Resources', href: '/resources' },
        { label: 'Glossary' }
      ]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              Insulation Glossary
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Comprehensive definitions and explanations of insulation terms, materials, and concepts.
            </p>
          </div>
        </div>
      </section>

      {/* A-Z Navigation */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {alphabet.map((letter) => {
              const hasTerms = availableLetters.includes(letter)
              if (hasTerms) {
                return (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    className="px-3 py-2 text-sm md:text-base font-semibold text-[#0a4768] hover:bg-[#F5DD22] hover:text-[#0a4768] rounded-md transition-colors border border-[#0a4768]"
                  >
                    {letter}
                  </a>
                )
              }
              return (
                <span
                  key={letter}
                  className="px-3 py-2 text-sm md:text-base font-semibold text-gray-400 rounded-md border border-gray-300 cursor-not-allowed"
                >
                  {letter}
                </span>
              )
            })}
          </div>
        </div>
      </section>

      {/* Terms by Letter */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {availableLetters.map((letter) => {
              const terms = glossaryByLetter[letter]
              if (!terms || terms.length === 0) return null

              return (
                <div key={letter} id={`letter-${letter}`} className="mb-12 scroll-mt-24">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6 pb-3 border-b-2 border-[#F5DD22]">
                    {letter}
                  </h2>
                  <div className="grid gap-4">
                    {terms.map((term) => (
                      <div
                        key={term.slug}
                        className="p-4 md:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <Link
                          href={`/resources/glossary/${term.slug}`}
                          className="block group"
                        >
                          <h3 className="text-xl md:text-2xl font-bold text-[#0a4768] mb-2 group-hover:text-[#0a4768]/80 transition-colors">
                            {term.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {term.description}
                          </p>
                          <span className="inline-block mt-3 text-sm font-medium text-[#0a4768] group-hover:underline">
                            Read more →
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

