// Shared articles data for resources page and carousels
export const articles = [
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
