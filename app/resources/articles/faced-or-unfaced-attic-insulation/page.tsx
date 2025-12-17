import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, FileText, Wrench, Calculator, Quote } from 'lucide-react'
import { QuoteButton } from '@/components/ui/quote-button'
import { Button } from '@/components/ui/button'
import CostCalculatorDialog from '@/components/pages/CostCalculatorDialog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Faced or Unfaced Attic Insulation: How to Choose for Your Home - InsulationPal',
  description:
    'Learn the key differences between faced and unfaced attic insulation. Discover when to use each type, how vapor barriers work, and which option is best for your climate and existing insulation.',
  keywords:
    'faced insulation, unfaced insulation, attic insulation, vapor barrier, kraft paper insulation, foil-faced insulation, moisture control, R-value',
  openGraph: {
    title: 'Faced or Unfaced Attic Insulation: How to Choose for Your Home',
    description:
      'Complete guide to choosing between faced and unfaced attic insulation, covering vapor barriers, moisture control, installation methods, and climate-specific recommendations.',
    type: 'article',
    images: [
      {
        url: 'https://insulationpal.com/faced-vs-unfaced-insulation.jpg',
        width: 1200,
        height: 630,
        alt: 'Comparison of faced and unfaced attic insulation'
      }
    ]
  }
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Faced or Unfaced Attic Insulation: How to Choose for Your Home',
  description:
    'Comprehensive guide to understanding the differences between faced and unfaced attic insulation, including vapor barrier requirements, moisture control strategies, building code compliance, and climate-specific recommendations for optimal performance.',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://insulationpal.com/resources/articles/faced-or-unfaced-attic-insulation'
  },
  image: ['https://insulationpal.com/faced-vs-unfaced-insulation.jpg'],
  author: {
    '@type': 'Organization',
    name: 'InsulationPal'
  },
  publisher: {
    '@type': 'Organization',
    name: 'InsulationPal',
    logo: {
      '@type': 'ImageObject',
      url: 'https://insulationpal.com/insulation-pal-logo.png'
    }
  },
  datePublished: '2025-01-15',
  dateModified: '2025-01-15'
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the main difference between faced and unfaced insulation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Faced insulation has a paper or foil vapor barrier attached to one side, while unfaced insulation is just the insulation material itself with no barrier. The vapor barrier in faced insulation helps control moisture movement and must face the warm-in-winter side of your home.'
      }
    },
    {
      '@type': 'Question',
      name: 'When should I use faced insulation in my attic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use faced insulation for new attic installations where no vapor barrier exists, in cold climates (zones 5-8), in humid areas with high outdoor moisture, and when building codes require it. The vapor barrier should always face down toward the living space.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I install faced insulation over existing insulation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, you should never install faced insulation over existing faced insulation or any vapor barrier. This creates a double vapor barrier that traps moisture between layers, leading to mold, rot, and insulation damage. Always use unfaced insulation when adding layers.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which type is better for adding a second layer of attic insulation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unfaced insulation is always the right choice for adding a second layer over existing insulation. It allows any moisture to escape and prevents the moisture-trapping problems that occur with double vapor barriers.'
      }
    }
  ]
}

export default function FacedUnfacedAtticInsulationArticle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen">
        <Header />

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Resources', href: '/resources' },
            { label: 'Articles', href: '/resources/articles' },
            { label: 'Faced or Unfaced Attic Insulation' }
          ]}
        />

        <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-14">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <Link
              href="/resources/articles"
              className="inline-flex items-center text-[#0a4768] hover:text-[#0a4768]/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
            </Link>
            <h1 className="text-[18px] font-bold text-[#0a4768] mb-4">
              Faced or Unfaced Attic Insulation: How to Choose for Your Home
            </h1>
            <p className="text-base text-gray-700">
              Attics are one of those spots that really need proper insulation, but picking between faced and unfaced insulation? That trips up a lot of homeowners. <strong>Here's the gist: faced insulation has a paper or foil vapor barrier on one side, while unfaced insulation is just the insulation itself. Your choice mostly depends on your climate and whether there's already insulation up there.</strong>
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="grid lg:grid-cols-4 gap-8">
              <article className="lg:col-span-3 space-y-10 article-content">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 -mb-4">
                  <Image
                    src="/faced-vs-unfaced-insulation.jpg"
                    alt="Comparison of faced and unfaced attic insulation showing vapor barriers"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <section className="space-y-4 !mt-4">
                  <p className="text-base text-gray-700">
                    We've seen what happens when insulation isn't picked carefully—moisture sneaks in, energy bills climb, and suddenly you're facing repairs you never planned for. The way you place that vapor barrier is a big deal; it changes how moisture moves through your attic. In colder places where you're running the heat, the vapor barrier should face the living space. Warmer climates? The approach shifts a bit.
                  </p>
                  <p className="text-base text-gray-700">
                    If you get a handle on the basics of both types, it gets a lot easier to decide what's right for your attic. Let's get into how vapor barriers actually work, what the codes want, and what it's really like to install each kind. Looking at performance and climate specifics, you'll be able to figure out which insulation makes sense for your attic.
                  </p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Fundamentals of Faced and Unfaced Attic Insulation</h2>
                  <p className="text-base text-gray-700">
                    <Link href="/services/attic-insulation" className="text-[#0a3fd6] font-semibold underline hover:text-[#062aa8]">Attic insulation</Link> usually comes in two main flavors: faced (with a barrier layer) and unfaced (without one). The real difference? Whether there's something like kraft paper or foil glued to one side of the batt.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">What is Faced Insulation?</h3>
                      <p className="text-base text-gray-700">
                        Faced insulation means there's a layer stuck to one side—think kraft paper, foil, or sometimes vinyl. That layer works as a vapor retarder.
                      </p>
                      <p className="text-base text-gray-700">
                        Paper-faced insulation is what you'll find in most homes. The kraft paper helps block moisture and keeps the insulation together. Lots of these batts have little flaps on the edges, so you can staple them right to studs or joists.
                      </p>
                      <p className="text-base text-gray-700">
                        Foil-faced insulation works similarly but adds a bit of reflectivity. Sometimes that's helpful for keeping heat out. Keep in mind, some building codes might limit which facings you're allowed to use.
                      </p>
                      <p className="text-base text-gray-700">
                        The key rule: the facing always goes toward the warm-in-winter side. So, in heated homes, the paper or foil faces the inside.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">What is Unfaced Insulation?</h3>
                      <p className="text-base text-gray-700">
                        Unfaced insulation is just the insulation—no paper, no foil, no barrier. It stays in place by friction between the joists, not staples or fasteners.
                      </p>
                      <p className="text-base text-gray-700">
                        Unfaced fiberglass is popular for interiors where moisture isn't a big worry. It's often layered on top of existing attic insulation to pump up the R-value, and since there's no barrier, moisture can move through it both ways.
                      </p>
                      <p className="text-base text-gray-700">
                        It's usually a bit cheaper—think $0.50 to $1.75 per square foot, compared to $0.50 to $2.00 for faced. Plus, without the paper, some unfaced types can be fire-rated, which faced batts usually can't.
                      </p>
                      <p className="text-base text-gray-700">
                        That said, it's a little fussier to install. The batts can tear or separate if you're not careful.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Key Differences Between Faced and Unfaced Insulation</h3>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                          <thead className="bg-[#F5F6FB]">
                            <tr>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Feature</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Faced Insulation</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Unfaced Insulation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Vapor Barrier</td>
                              <td className="px-4 py-3">Includes kraft paper or foil</td>
                              <td className="px-4 py-3">No barrier included</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Installation Method</td>
                              <td className="px-4 py-3">Stapled to framing</td>
                              <td className="px-4 py-3">Friction-fit</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Fire Rating</td>
                              <td className="px-4 py-3">Not fire-resistant</td>
                              <td className="px-4 py-3">Can be fire-rated</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Cost per Sq Ft</td>
                              <td className="px-4 py-3">$0.50-$2.00</td>
                              <td className="px-4 py-3">$0.50-$1.75</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Best Use</td>
                              <td className="px-4 py-3">Exterior walls, new construction</td>
                              <td className="px-4 py-3">Attic floors, adding layers</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-base text-gray-700">
                        The main thing to pay attention to is moisture. Faced insulation blocks vapor from passing through, while unfaced lets it move freely. That's why each type works better in certain spots.
                      </p>
                      <p className="text-base text-gray-700">
                        Faced batts tend to be easier to handle since the paper keeps everything together. Unfaced? You've got to be a bit more gentle to avoid tearing.
                      </p>
                      <p className="text-base text-gray-700">
                        If there's already a vapor barrier in your attic, use unfaced insulation on top. You don't want to sandwich moisture between two barriers—that's asking for trouble. The vapor barrier should only be on one side, based on your climate.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Vapor Barriers, Moisture Control, and Building Regulations</h2>
                  <p className="text-base text-gray-700">
                    Getting vapor control right in the attic means knowing the difference between vapor barriers and retarders, understanding how moisture moves, and, honestly, making sure you're following the rules for your area.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Understanding Vapor Barriers and Vapor Retarders</h3>
                      <p className="text-base text-gray-700">
                        People toss around "vapor barrier" and "vapor retarder" like they're the same, but they're not. A vapor retarder just slows down water vapor, while a true barrier stops it almost entirely. It's all about the perm rating: below 0.1 is a barrier, 0.1 to 1.0 is a retarder.
                      </p>
                      <p className="text-base text-gray-700">
                        Kraft paper on most faced insulation is a vapor retarder, not a full barrier. It's kind of clever—it adapts a bit to humidity. When it's dry, it blocks vapor well. When things get damp, it lets moisture escape.
                      </p>
                      <p className="text-base text-gray-700">
                        Foil-faced insulation is closer to a true vapor barrier and also reflects heat, which can help in hot climates. Whether you go with paper or foil depends on your climate and how much moisture control you need.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Moisture Control and Mold Prevention</h3>
                      <p className="text-base text-gray-700">
                        Moisture vapor wants to move from warm to cold areas. In winter, that means indoor air tries to creep up into your cold attic. Without a vapor retarder, that moisture can condense on cold surfaces, setting the stage for mold and even rot.
                      </p>
                      <p className="text-base text-gray-700">
                        That's why you want the vapor retarder on the warm side of the insulation, facing the living space. And don't double up on vapor barriers—never put faced insulation over faced, or add plastic sheeting on top of kraft-faced batts. That traps any moisture that does get in, which is pretty much a mold invitation. If you're adding insulation to what you already have, stick with unfaced <Link href="/resources/articles/batt-insulation-vs-blown-in-insulation" className="text-[#0a3fd6] font-semibold underline hover:text-[#062aa8]">batts or blown-in insulation</Link>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Building Codes and Local Requirements</h3>
                      <p className="text-base text-gray-700">
                        The International Residential Code says vapor retarders are a must in climate zones 5 through 8—places with long, cold winters. Local codes might tweak things based on your region's quirks.
                      </p>
                      <p className="text-base text-gray-700">
                        Zones 1 through 4? The rules are all over the place. Some areas want vapor retarders, others don't. You've got to check with your building department before starting anything—no sense guessing and then failing inspection.
                      </p>
                      <p className="text-base text-gray-700">
                        Inspectors do look at vapor barrier placement. Get it wrong, and you could be ripping it all out to do over. Codes also say no vapor barriers on both sides—again, moisture trap city.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Attic Insulation Performance and Installation Considerations</h2>
                  <p className="text-base text-gray-700">
                    How well your attic insulation works depends on picking the right R-value for your area, installing it without gaps or squishing it down, and balancing cost with the energy savings you'll get back.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">R-Value and Thermal Efficiency</h3>
                      <p className="text-base text-gray-700">
                        R-value is just a measure of how well insulation resists heat flow. Higher is better. Most attics need somewhere between R-30 and R-49, depending on where you live and what the codes say.
                      </p>
                      <p className="text-base text-gray-700">
                        R-49 is the go-to for chilly northern spots where heating eats up your wallet. Down south, where it's humid and you're fighting heat, R-30 to R-38 is usually enough. Every step up in R-value cuts down heat loss or gain, so your energy bills go down.
                      </p>
                      <p className="text-base text-gray-700">
                        But you only get that R-value if you install the insulation right—no gaps, no squishing. Compressed insulation loses oomph, and any spaces between batts or around stuff like pipes just let heat sneak through.
                      </p>
                      <p className="text-base text-gray-700">
                        Faced and unfaced insulation both hit the same R-values if you install them right. The facing just changes how moisture moves, not how much heat gets through.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Installation Best Practices</h3>
                      <p className="text-base text-gray-700">
                        Before you even think about insulation, seal up any air leaks—around pipes, wires, chimneys, all of it. Otherwise, air just bypasses the insulation, making it kind of pointless.
                      </p>
                      <p className="text-base text-gray-700">
                        With unfaced batts, you want them snug but not squished between joists. Sometimes you'll need supports to keep them from sagging, especially overhead. Faced insulation gets stapled with the barrier facing the living space, and you want it flat against the wood—no bunching or gaps. Never layer faced insulation on top of faced, or you risk mold and damage.
                      </p>
                      <p className="text-base text-gray-700">
                        Cut the batts to fit around obstacles instead of cramming them in. That way, you keep the R-value and, if it matters, the fire rating. Unfaced insulation that's fire-rated can be left exposed in attics, but kraft-faced stuff usually needs to be covered up for fire safety.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Cost Factors and Material Selection</h3>
                      <p className="text-base text-gray-700">
                        Unfaced batts run about $0.30 to $0.50 per square foot, faced a bit more—$0.40 to $0.65. The facing doesn't add much to the price, but it does mean a little more work to install.
                      </p>
                      <p className="text-base text-gray-700">
                        Pick <Link href="/resources/articles/best-attic-insulation-for-dry-cold-and-humid-climates" className="text-[#0a3fd6] font-semibold underline hover:text-[#062aa8]">insulation based on your climate</Link>. Humid places sometimes benefit from unfaced batts with a separate vapor retarder, wherever the code says it should go. In dry areas, you might not need a vapor barrier at all, so unfaced is the budget pick.
                      </p>
                      <p className="text-base text-gray-700">
                        Roll insulation is cheaper per square foot than batts but needs more cutting. If you've got a big attic, rolls can be faster. For smaller jobs, batts make things easier and less wasteful.
                      </p>
                      <p className="text-base text-gray-700">
                        Professional installation usually runs $1.50 to $3.00 per square foot, labor included. Pros can finish faster and get the details right—air sealing, vapor barrier, full coverage. Doing it yourself saves money but opens the door to mistakes—gaps, compression, or putting the vapor barrier on the wrong side, which can all mess with your energy efficiency and even cause moisture issues.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-[16px] font-bold text-[#0a4768]">Choosing Between Faced and Unfaced Insulation in Attics</h2>
                  <p className="text-base text-gray-700">
                    So, should you go faced or unfaced? It comes down to your climate, what's already in your attic, and how you need to manage moisture. Faced insulation is for new installs where you need a vapor barrier. Unfaced is what you want if you're adding more layers—no sense creating a moisture trap.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">When to Use Faced Attic Insulation</h3>
                      <p className="text-base text-gray-700">
                        Faced insulation is the call for new installations where there's no vapor barrier yet. That paper or foil layer stops warm, moist air from making its way up and condensing in the attic.
                      </p>
                      <p className="text-base text-gray-700 font-semibold">When do you really need faced insulation?</p>
                      <ul className="list-disc list-inside text-base text-gray-700 space-y-1 ml-4">
                        <li><strong>Humid climates</strong> where outdoor moisture is always high</li>
                        <li><strong>Cold regions</strong> where condensation is a big risk</li>
                        <li><strong>First-time attic installs</strong> with no existing vapor barrier</li>
                        <li><strong>Homes needing soundproofing</strong> (the facing helps a bit with noise)</li>
                      </ul>
                      <p className="text-base text-gray-700">
                        The facing should always point down, toward the heated living space. That's what keeps moisture from sneaking in. And yeah, a lot of building codes require faced insulation for new attics—check before you start, because the rules shift from place to place.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">When to Use Unfaced Attic Insulation</h3>
                      <p className="text-base text-gray-700">
                        Unfaced attic insulation is a solid choice when you're layering over insulation that's already there. If you slap another vapor barrier on top of the old one, you're basically inviting trapped moisture and, well, all the headaches that come with mold and ruined materials.
                      </p>
                      <p className="text-base text-gray-700 font-semibold">We use unfaced insulation when:</p>
                      <ul className="list-disc list-inside text-base text-gray-700 space-y-1 ml-4">
                        <li>We want to bump up the R-value in attics that already have faced insulation</li>
                        <li>The climate's dry enough that breathability actually matters for keeping things dry</li>
                        <li>The house is older and there's already a vapor barrier hiding somewhere</li>
                        <li>We need an extra layer but don't want to mess with building codes</li>
                      </ul>
                      <p className="text-base text-gray-700">
                        Unfaced insulation lets vapor escape, assuming your attic's got decent ventilation. That's the key to avoiding condensation between layers—something you really don't want to deal with.
                      </p>
                      <p className="text-base text-gray-700">
                        Honestly, there's not much of a price gap: usually just about ten to thirty cents per square foot. We pick based on what the job needs, not to save a buck, because using the wrong stuff can turn into a way pricier problem down the line.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold text-[#0a4768]">Common Mistakes and How to Avoid Them</h3>
                      <p className="text-base text-gray-700">
                        One of the biggest slip-ups? Installing faced insulation over an existing vapor barrier. That double layer just traps moisture, wrecking the insulation and practically inviting mold to move in.
                      </p>
                      <p className="text-base text-gray-700 font-semibold">Critical mistakes to avoid:</p>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                          <thead className="bg-[#F5F6FB]">
                            <tr>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Mistake</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Consequence</th>
                              <th className="px-4 py-3 text-sm font-semibold text-[#0a4768]">Solution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Paper facing wrong direction</td>
                              <td className="px-4 py-3">Moisture enters attic space</td>
                              <td className="px-4 py-3">Face barrier toward living area</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Double vapor barriers</td>
                              <td className="px-4 py-3">Trapped condensation</td>
                              <td className="px-4 py-3">Use unfaced for second layers</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Compressed insulation</td>
                              <td className="px-4 py-3">Reduced R-value</td>
                              <td className="px-4 py-3">Maintain proper loft thickness</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-[#0a4768]">Gaps between batts</td>
                              <td className="px-4 py-3">Heat loss and drafts</td>
                              <td className="px-4 py-3">Fit materials tightly without compression</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-base text-gray-700">
                        Before buying anything, we always check the attic to see what's already up there. If there's old faced insulation, we only use unfaced on top—otherwise, you're just asking for trouble with warranties and building codes. Kind of a pain, but it's worth it.
                      </p>
                      <p className="text-base text-gray-700">
                        It's easy to forget about ventilation, too. Even if you nail the insulation, without good soffit and ridge vents, moisture's going to collect and cause headaches down the road.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="bg-[#D8E1FF] border border-[#0a4768]/10 rounded-lg p-6 space-y-4">
                    <p className="text-base text-[#0a4768] font-semibold">
                      Need help choosing the right attic insulation?
                    </p>
                    <QuoteButton className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold w-full sm:w-auto">
                      Get Contractor Quotes
                    </QuoteButton>
                  </div>
                </section>
              </article>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 lg:top-32 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#0a4768] mb-4">Get Started</h3>
                    <div className="space-y-3">
                      <QuoteButton className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                        <Quote className="mr-2 h-4 w-4" />
                        Request Contractor Quotes
                      </QuoteButton>
                      <CostCalculatorDialog>
                        <Button className="w-full bg-[#0a4768] hover:bg-[#0a4768]/90 text-white">
                          <Calculator className="mr-2 h-4 w-4" />
                          Estimate Project Cost
                        </Button>
                      </CostCalculatorDialog>
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
                        href="/services/attic-insulation"
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center text-[#0a4768]">
                          <Wrench className="h-4 w-4 mr-2" />
                          Attic Insulation Services
                        </div>
                        <p className="text-sm text-gray-600 mt-1">See professional installation options</p>
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
