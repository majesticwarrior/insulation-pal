import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Tag } from 'lucide-react'

export default function FiberglassInsulationArticle() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/resources" className="hover:text-[#0a4768]">Resources</Link>
            <span>/</span>
            <Link href="/resources/articles" className="hover:text-[#0a4768]">Articles</Link>
            <span>/</span>
            <span className="text-[#0a4768]">What is Fibreglass Insulation?</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                Materials
              </span>
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                5 min read
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-4">
              What is Fibreglass Insulation?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover everything you need to know about fibreglass insulation, one of the most popular and cost-effective insulation materials for homes.
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="/attic-insulation-blown-in.jpg"
              alt="Fibreglass insulation installation in attic"
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">What is Fibreglass Insulation?</h2>
            <p className="mb-6">
              Fibreglass insulation, also known as glass wool, is one of the most widely used insulation materials in residential and commercial buildings. Made from fine glass fibers, this insulation material is created by melting sand and recycled glass at extremely high temperatures, then spinning the molten material into thin fibers.
            </p>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">How Fibreglass Insulation Works</h2>
            <p className="mb-6">
              Fibreglass insulation works by trapping air within its structure. The tiny glass fibers create millions of small air pockets that slow down the transfer of heat. This thermal resistance is measured by R-value - the higher the R-value, the better the insulation performance.
            </p>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Types of Fibreglass Insulation</h2>
            <h3 className="text-xl font-semibold text-[#0a4768] mb-3">1. Batt and Roll Insulation</h3>
            <p className="mb-4">
              Pre-cut panels or continuous rolls that fit between standard stud and joist spacing. Available in various thicknesses and R-values to meet different insulation needs.
            </p>

            <h3 className="text-xl font-semibold text-[#0a4768] mb-3">2. Blown-in Fibreglass</h3>
            <p className="mb-4">
              Loose-fill fibreglass that's blown into attics, walls, and other spaces using special equipment. Ideal for irregularly shaped areas and retrofit applications.
            </p>

            <h3 className="text-xl font-semibold text-[#0a4768] mb-3">3. Rigid Fibreglass Boards</h3>
            <p className="mb-6">
              Dense, semi-rigid boards used in commercial applications and specific residential uses where higher compressive strength is needed.
            </p>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Benefits of Fibreglass Insulation</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Cost-effective:</strong> One of the most affordable insulation options available</li>
              <li><strong>Non-combustible:</strong> Will not burn, providing fire safety benefits</li>
              <li><strong>Moisture resistant:</strong> Does not absorb water, preventing mold and mildew</li>
              <li><strong>Easy installation:</strong> DIY-friendly for homeowners with basic skills</li>
              <li><strong>Long-lasting:</strong> Maintains performance for decades when properly installed</li>
              <li><strong>Recyclable:</strong> Made from recycled glass and can be recycled again</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Where to Use Fibreglass Insulation</h2>
            <p className="mb-4">Fibreglass insulation is versatile and can be used in:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Attics and crawl spaces</li>
              <li>Exterior walls</li>
              <li>Basement walls</li>
              <li>Floor joists over unheated spaces</li>
              <li>Interior walls for soundproofing</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Installation Considerations</h2>
            <p className="mb-4">
              While fibreglass insulation can be installed by homeowners, proper installation is crucial for optimal performance:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Always wear protective gear including gloves, long sleeves, eye protection, and a dust mask</li>
              <li>Cut insulation with a sharp knife and compress minimally to maintain R-value</li>
              <li>Fill all gaps and voids to prevent thermal bridging</li>
              <li>Install vapor barriers where required by local building codes</li>
              <li>Ensure proper ventilation in attic installations</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Common R-Values and Applications</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">Typical R-Values for Fibreglass:</h3>
              <ul className="space-y-2">
                <li>• R-11 to R-15: 2x4 wall cavities</li>
                <li>• R-19 to R-21: 2x6 wall cavities and floors</li>
                <li>• R-30 to R-38: Attics in moderate climates</li>
                <li>• R-49 to R-60: Attics in cold climates</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Potential Drawbacks</h2>
            <p className="mb-4">While fibreglass insulation has many benefits, consider these potential issues:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Can cause skin, eye, and respiratory irritation during installation</li>
              <li>Performance decreases when compressed or wet</li>
              <li>Does not provide air sealing properties</li>
              <li>Can settle over time, reducing effectiveness</li>
              <li>May not completely fill irregular spaces</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Cost Considerations</h2>
            <p className="mb-6">
              Fibreglass insulation is typically the most budget-friendly option, with costs ranging from $0.40 to $1.50 per square foot for materials. Professional installation adds $1.00 to $2.50 per square foot, making it an excellent choice for cost-conscious homeowners seeking energy efficiency improvements.
            </p>

            <h2 className="text-2xl font-bold text-[#0a4768] mb-4">Is Fibreglass Insulation Right for You?</h2>
            <p className="mb-6">
              Fibreglass insulation is an excellent choice for most homeowners due to its affordability, effectiveness, and versatility. It's particularly well-suited for new construction and major renovations where standard cavity sizes are available. However, for retrofit applications or areas requiring air sealing, consider combining fibreglass with other materials or choosing alternatives like spray foam.
            </p>

            <div className="bg-[#D8E1FF] p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-[#0a4768] mb-2">Professional Installation Recommended</h3>
              <p className="text-gray-700">
                While fibreglass insulation can be a DIY project, professional installation ensures optimal performance, proper safety measures, and compliance with local building codes. Get quotes from certified insulation contractors in your area for the best results.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Button asChild variant="outline">
                <Link href="/resources" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </Link>
              </Button>
              
              <Button asChild className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]">
                <Link href="/">Get Free Quotes</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </main>
  )
}
