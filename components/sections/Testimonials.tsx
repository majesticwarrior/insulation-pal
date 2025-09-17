import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Austin, TX',
      rating: 5,
      text: 'InsulationPal connected me with an amazing contractor who transformed my attic insulation. My energy bills dropped by 25% in the first month!',
      service: 'Attic Insulation',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Michael Chen',
      location: 'Denver, CO',
      rating: 5,
      text: 'The spray foam insulation was installed perfectly. The team was professional, clean, and finished ahead of schedule. Highly recommend!',
      service: 'Spray Foam',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Phoenix, AZ',
      rating: 5,
      text: 'Great service from start to finish. Got three competitive quotes and chose the best contractor for my wall insulation project.',
      service: 'Wall Insulation',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'David Thompson',
      location: 'Chicago, IL',
      rating: 5,
      text: 'InsulationPal made finding a reliable contractor so easy. The basement insulation work was completed beautifully and on budget.',
      service: 'Basement Insulation',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Lisa Park',
      location: 'Seattle, WA',
      rating: 5,
      text: 'Outstanding experience! The contractor explained everything clearly and the crawl space encapsulation exceeded my expectations.',
      service: 'Crawl Space',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Robert Martinez',
      location: 'Miami, FL',
      rating: 5,
      text: 'Professional service and great results. My home is noticeably more comfortable after the insulation upgrade. Worth every penny!',
      service: 'Complete Home',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a4768] mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See why thousands of homeowners trust 
            InsulationPal to connect them with the best insulation contractors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-[#0a4768] mr-2" />
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-[#0a4768]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.location}
                    </div>
                    <div className="text-sm text-[#0a4768] font-medium">
                      {testimonial.service}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-[#D8E1FF] rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#0a4768] mb-4">
              Join Over 50,000 Satisfied Customers
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the InsulationPal difference. Get connected with top-rated, 
              licensed insulation contractors in your area today.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#0a4768]">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0a4768]">50K+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0a4768]">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0a4768]">24hrs</div>
                <div className="text-sm text-gray-600">Average Match Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials