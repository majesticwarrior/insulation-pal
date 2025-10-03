import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteButton } from '@/components/ui/quote-button'
import Link from 'next/link'
import Image from 'next/image'
import { Play, BookOpen, Calculator, Wrench, Shield, Clock, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DIY Insulation Guides - InsulationPal | How-To Videos & Tutorials',
  description: 'Learn how to install insulation yourself with our comprehensive DIY guides, video tutorials, and step-by-step instructions. Save money with professional tips.',
  keywords: 'DIY insulation, insulation installation, how to install insulation, insulation videos, home improvement, attic insulation DIY',
  openGraph: {
    title: 'DIY Insulation Guides - InsulationPal',
    description: 'Master insulation installation with our expert DIY guides and video tutorials.',
    type: 'website',
  },
}

const diyProjects = [
  {
    title: 'Attic Insulation Installation',
    description: 'Learn how to properly insulate your attic with blown-in or batt insulation.',
    image: '/attic-insulation-blown-in.jpg',
    difficulty: 'Intermediate',
    time: '4-6 hours',
    cost: '$200-500',
    videoUrl: '#',
    guideUrl: '#'
  },
  {
    title: 'Wall Insulation for Existing Homes',
    description: 'Add insulation to existing walls using injection or blown-in techniques.',
    image: '/cellulose-wall-insulation-installed.jpg',
    difficulty: 'Advanced',
    time: '6-8 hours',
    cost: '$300-800',
    videoUrl: '#',
    guideUrl: '#'
  },
  {
    title: 'Crawl Space Insulation',
    description: 'Properly insulate and seal your crawl space to improve energy efficiency.',
    image: '/crawl-space-insulation-installed.jpg',
    difficulty: 'Intermediate',
    time: '3-5 hours',
    cost: '$150-400',
    videoUrl: '#',
    guideUrl: '#'
  },
  {
    title: 'Basement Insulation',
    description: 'Insulate basement walls and floors to create a comfortable living space.',
    image: '/basement-insulation-installed.jpg',
    difficulty: 'Intermediate',
    time: '5-7 hours',
    cost: '$250-600',
    videoUrl: '#',
    guideUrl: '#'
  },
  {
    title: 'Garage Insulation',
    description: 'Transform your garage into a comfortable workspace with proper insulation.',
    image: '/professional-insulation-contractor-working-on-home.jpg',
    difficulty: 'Beginner',
    time: '3-4 hours',
    cost: '$100-300',
    videoUrl: '#',
    guideUrl: '#'
  },
  {
    title: 'Spray Foam Insulation',
    description: 'Professional-grade spray foam insulation for maximum energy efficiency.',
    image: '/spray-foam-insulation-installed.jpg',
    difficulty: 'Advanced',
    time: '8-12 hours',
    cost: '$500-1200',
    videoUrl: '#',
    guideUrl: '#'
  }
]

const tools = [
  { name: 'Insulation Blower', description: 'For blown-in insulation installation' },
  { name: 'Utility Knife', description: 'For cutting insulation batts' },
  { name: 'Staple Gun', description: 'For securing insulation in place' },
  { name: 'Measuring Tape', description: 'For accurate measurements' },
  { name: 'Safety Glasses', description: 'Eye protection during installation' },
  { name: 'Dust Mask', description: 'Respiratory protection from insulation fibers' },
  { name: 'Work Gloves', description: 'Hand protection during installation' },
  { name: 'Flashlight', description: 'For working in dark spaces' }
]

const safetyTips = [
  'Always wear protective gear including gloves, safety glasses, and a dust mask',
  'Ensure proper ventilation when working with insulation materials',
  'Check for electrical wiring before installing insulation',
  'Use appropriate tools for the type of insulation being installed',
  'Follow manufacturer instructions for all materials',
  'Take breaks to avoid overheating in confined spaces',
  'Have a first aid kit readily available',
  'Never work alone in crawl spaces or attics'
]

export default function DIYPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Link 
                href="/resources" 
                className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4768] mb-6 leading-tight">
              DIY Insulation Guides
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Master insulation installation with our comprehensive DIY guides, video tutorials, and professional tips. 
              Save money while improving your home's energy efficiency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                asChild
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
              >
                <Link href="#videos">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Videos
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white px-8 py-3 text-lg"
              >
                <Link href="#calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  Cost Calculator
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Safety First
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insulation installation requires proper safety precautions. Always prioritize your safety and follow these guidelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyTips.map((tip, index) => (
              <Card key={index} className="bg-white border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DIY Projects Section */}
      <section id="videos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              DIY Insulation Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive collection of DIY insulation projects, each with video tutorials and detailed guides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diyProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Video
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                      {project.difficulty}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <Clock className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{project.time}</p>
                    </div>
                    <div>
                      <Calculator className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{project.cost}</p>
                    </div>
                    <div>
                      <Wrench className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{project.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                      <Link href={project.videoUrl}>
                        <Play className="mr-2 h-4 w-4" />
                        Video
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1 border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                      <Link href={project.guideUrl}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Guide
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Equipment Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-6">
              Essential Tools & Equipment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Having the right tools makes all the difference. Here's what you'll need for most insulation projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-[#F5DD22] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-6 w-6 text-[#0a4768]" />
                  </div>
                  <h3 className="font-bold text-[#0a4768] mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator CTA */}
      <section id="calculator" className="py-20 bg-[#D6D6D6] text-[#0a4768]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Estimate Your DIY Project Cost
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Use our interactive calculator to estimate the cost of materials and tools for your insulation project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-3 text-lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Open Calculator
            </Button>
            <QuoteButton className="border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white px-8 py-3 text-lg">
              Get Professional Quote
            </QuoteButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
