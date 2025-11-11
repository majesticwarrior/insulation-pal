'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react'
import { saveCustomerData, getCustomerData } from '@/lib/customer-data-storage'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    // Load stored email if available
    const storedData = getCustomerData()
    if (storedData.email) {
      setFormData(prev => ({
        ...prev,
        email: storedData.email || ''
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Save email to localStorage when user types
    if (name === 'email' && value.trim()) {
      saveCustomerData({ email: value.trim() })
    }
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
      value: 'support@insulationpal.com',
      action: 'Send Email'
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
    <>
      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#D8E1FF] rounded-full flex items-center justify-center mx-auto mb-4">
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

          {/* Contact Form and Office Hours */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#0a4768]">Send Us a Message</CardTitle>
                <p className="text-gray-600">We'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Input
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="min-h-32"
                      required
                    />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      const mailtoLink = `mailto:support@insulationpal.com?subject=${encodeURIComponent(formData.subject || 'InsulationPal Support')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`)}`
                      window.location.href = mailtoLink
                    }}
                    className="w-full bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] font-semibold py-3"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Hours & Additional Info */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768] flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold text-[#0a4768]">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-semibold text-[#0a4768]">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-semibold text-[#0a4768]">Closed</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[#D8E1FF] rounded-lg">
                    <p className="text-sm text-[#0a4768]">
                      <strong>Emergency Support:</strong> Available 24/7 for urgent insulation issues
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a4768]">Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#0a4768] mr-3 mt-1" />
                    <div>
                      <div className="font-semibold text-[#0a4768]">InsulationPal Headquarters</div>
                      <div className="text-gray-600">
                        14210 N 46th Dr<br />
                        Glendale, AZ 85306
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a4768] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get quick answers to common questions about our insulation services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <HelpCircle className="h-6 w-6 text-[#0a4768] mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[#0a4768] mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
