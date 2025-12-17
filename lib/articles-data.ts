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
    title: 'Best Attic Insulation for Dry, Cold and Humid Climates',
    slug: 'best-attic-insulation-for-dry-cold-and-humid-climates',
    description:
      'Choose the best attic insulation for your climate. Learn about R-values, moisture control, ventilation, and which materials work best in dry, cold, and humid climates.',
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
