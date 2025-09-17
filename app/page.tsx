import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import Coverage from '@/components/sections/Coverage'
import CallToAction from '@/components/sections/CallToAction'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Coverage />
      <CallToAction />
      <Footer />
    </main>
  )
}