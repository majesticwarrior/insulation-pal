// Shared articles data for resources page and carousels
// Articles are ordered with newest first
export const articles = [
  {
    title: 'Faced or Unfaced Attic Insulation: How to Choose',
    slug: 'faced-or-unfaced-attic-insulation',
    description:
      'Learn the key differences between faced and unfaced attic insulation. Discover when to use each type, how vapor barriers work, and which option is best for your climate and existing insulation.',
    image: '/faced-vs-unfaced-insulation.jpg',
    readTime: '12 min read',
    category: 'Attic Insulation'
  },
  {
    title: 'Best Attic Insulation for Dry (Hot) Climates',
    slug: 'best-attic-insulation-for-dry-hot-climates',
    description:
      'Discover the best attic insulation for dry, hot climates. Learn about spray foam, radiant barriers, blown-in cellulose, and optimal R-values for hot weather regions.',
    image: '/energy-consumption-and-r-value-insulation.jpg',
    readTime: '12 min read',
    category: 'Attic Insulation'
  },
  {
    title: 'Best Attic Insulation for Humid Climates',
    slug: 'best-attic-insulation-for-humid-climates',
    description:
      'Discover the best attic insulation for humid climates. Learn about closed-cell spray foam, fiberglass with vapor barriers, rigid foam boards, and mineral wool for moisture control.',
    image: '/energy-consumption-and-r-value-insulation.jpg',
    readTime: '13 min read',
    category: 'Attic Insulation'
  },
  {
    title: 'Best Attic Insulation for Cold (Wet) Climates',
    slug: 'best-attic-insulation-for-cold-wet-climates',
    description:
      'Discover the best attic insulation for cold, wet climates. Learn about spray foam, dense-pack cellulose, reflective barriers, and strategies for moisture control and heat retention.',
    image: '/energy-consumption-and-r-value-insulation.jpg',
    readTime: '14 min read',
    category: 'Attic Insulation'
  },
  {
    title: 'Batt Insulation vs Blown-In Insulation',
    slug: 'batt-insulation-vs-blown-in-insulation',
    description:
      'Compare batt insulation and blown-in insulation to choose the right option for your home. Learn about installation methods, R-values, costs, air sealing, and which type works best in different spaces.',
    image: '/blown-in-vs-batt-insulation.jpg',
    readTime: '11 min read',
    category: 'Insulation Comparison'
  },
  {
    title: 'Cellulose vs Fiberglass Insulation',
    slug: 'cellulose-vs-fiberglass-insulation',
    description:
      'Compare cellulose and fiberglass insulation to make the best choice for your home. Learn about R-values, installation methods, costs, safety, and which material works best in different areas.',
    image: '/blown-in-fiberglass-insulation.jpg',
    readTime: '12 min read',
    category: 'Insulation Comparison'
  },
  {
    title: 'Essential Materials, Benefits, and Types to Insulate Your Garage',
    slug: 'essential-materials-benefits-and-types-to-insulate-your-garage',
    description:
      'Plan a high-performing garage by understanding required materials, insulation system options, and the benefits that protect connected living spaces.',
    image: '/contractor-insalling-garage-insulation.jpg',
    readTime: '9 min read',
    category: 'Garage Insulation'
  },
  {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    description:
      'Get answers to commonly asked questions about InsulationPal, how it works, costs, energy savings, and insulation types.',
    image: '/professional-insulation-contractor-working-on-home.jpg',
    readTime: '8 min read',
    category: 'FAQ'
  }
]

export type Article = typeof articles[0]
