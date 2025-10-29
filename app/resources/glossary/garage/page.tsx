import type { Metadata } from 'next'
import TermPage from '../_TermPage'
import { getTermBySlug } from '@/lib/glossary-data'

const term = getTermBySlug('garage')!

export const metadata: Metadata = {
  title: `${term.title}: Definition, Impact and More - InsulationPal`,
  description: term.description,
  openGraph: {
    title: `${term.title}: Definition and What it is`,
    description: term.description,
    type: 'article'
  }
}

export default function Page() {
  return <TermPage term={term} />
}

