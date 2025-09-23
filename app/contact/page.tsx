'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - InsulationPal | Customer Support & Help',
  description: 'Get in touch with InsulationPal\'s customer support team. Call (888) 357-9555, email help@insulationpal.com, or use our contact form for assistance with insulation services.',
  keywords: 'contact InsulationPal, customer support, insulation help, contractor support, phone number',
  openGraph: {
    title: 'Contact InsulationPal - Customer Support & Help',
    description: 'Get in touch with InsulationPal\'s customer support team for assistance with insulation services and contractor connections.',
    type: 'website',
  },
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our customer support team',
      value: '(888) 357-9555',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a message and we\'ll respond instantly',
      value: 'help@insulationpal.com',
      action: 'Send Email'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      value: 'Available 24/7',
      action: 'Start Chat'
    }
  ]

  const faqs = [
    {
      question: 'How quickly can I get matched with contractors?',
      answer: 'Most customers are matched with qualified contractors instantly upon submitting their request.'
    },
    {
      question: 'Are all contractors licensed and insured?',
      answer: 'Yes, every contractor in our network is thoroughly vetted, licensed, and carries comprehensive insurance.'
    },
    {
      question: 'How much do quotes cost?',
      answer: 'All quotes through InsulationPal are completely free with no obligations or hidden fees.'
    },
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'We stand behind all work done by our contractors and offer a satisfaction guarantee on every project.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D8E1FF] to-[#D6D6D6] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0a4768] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about insulation services? Need help finding the right contractor? 
              Our team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-[#F5DD22] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#0a4768]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a4768] mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="text-lg font-semibold text-[#0a4768] mb-4">{method.value}</div>
                    <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0a4768]">Send Us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you instantly.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(888) 357-9555"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your insulation needs..."
                      className="min-h-32"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & FAQ */}
            <div className="space-y-8">
              {/* Office Info */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768]">Our Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#F5DD22] mr-3 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0a4768]">Address</div>
                      <div className="text-gray-600">
                        14210 N 46th Dr<br />
                        Glendale, AZ 85306
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-[#0a4768] mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#757575] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Don't wait to improve your home's energy efficiency. Get matched with 
            trusted insulation contractors in your area today.
          </p>
          <Button className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold px-8 py-4 text-lg">
            Get Free Quote Now
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}