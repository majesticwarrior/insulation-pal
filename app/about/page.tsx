import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, Award, Target, CheckCircle, Star } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { number: '50,000+', label: 'Projects Completed' },
    { number: '2,500+', label: 'Licensed Contractors' },
    { number: '500+', label: 'Cities Served' },
    { number: '4.9/5', label: 'Customer Rating' }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every contractor in our network is thoroughly vetted, licensed, and insured for your peace of mind.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above all else, ensuring you get the best service and value.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards of quality through rigorous contractor screening and ongoing monitoring.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously improve our platform to make finding trusted contractors easier and more efficient.'
    }
  ]

  const team = [
    {
      name: 'Shannon Adams',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Been working in the home improvement industry for over 15 years.'
    },
    {
      name: 'Alex Viderman',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Technology leader focused on connecting homeowners with quality contractors.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Operations expert ensuring seamless experiences for customers and contractors.'
    },
    {
      name: 'David Thompson',
      role: 'Customer Success',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Dedicated to ensuring every customer has an exceptional experience.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#2c3c50] mb-6">
              About InsulationPal
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to make professional insulation services accessible, 
              affordable, and hassle-free for every homeowner in America.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#2c3c50] mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                InsulationPal was founded in 2020 when our founder, Sarah Johnson, experienced firsthand 
                the frustration of finding reliable insulation contractors. After calling dozens of companies 
                and receiving wildly different quotes, she realized there had to be a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Today, InsulationPal is the nation's largest network of vetted insulation contractors, 
                serving over 500 cities across 35+ states. We've helped over 50,000 homeowners save 
                money on their energy bills while improving their home's comfort.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-[#2c3c50]">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional insulation installation"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#D6D6D6]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2c3c50] mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and ensure we deliver exceptional 
              experiences for both homeowners and contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#2c3c50]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2c3c50] mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2c3c50] mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team is dedicated to revolutionizing how homeowners 
              connect with trusted insulation contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-[#2c3c50] mb-2">{member.name}</h3>
                  <div className="text-[#2c3c50] font-semibold mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#2c3c50] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-2xl font-light mb-8">
              "To make every home in America more energy-efficient, comfortable, and valuable 
              by connecting homeowners with trusted insulation professionals."
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-[#F5DD22] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-300">Making quality insulation services accessible to everyone, everywhere.</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-[#F5DD22] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quality</h3>
                <p className="text-gray-300">Ensuring every project meets the highest standards of excellence.</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-[#F5DD22] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trust</h3>
                <p className="text-gray-300">Building lasting relationships through transparency and reliability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#D8E1FF]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#2c3c50] mb-6">
            Ready to Join Our Success Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a homeowner looking for insulation services or a contractor 
            wanting to grow your business, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#2c3c50] font-semibold px-8 py-3">
              Get Free Quote
            </Button>
            <Button 
              variant="outline" 
              className="border-[#2c3c50] text-[#2c3c50] hover:bg-[#2c3c50] hover:text-white px-8 py-3"
            >
              Join as Contractor
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}