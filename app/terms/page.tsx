import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - InsulationPal',
  description: 'Terms and conditions for using the InsulationPal platform'
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last Updated: October 24, 2024</p>
            
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
              
              {/* Introduction */}
              <section>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to InsulationPal! These Terms of Service ("Terms") govern your access to and use of the InsulationPal 
                  website at insulationpal.com (the "Site") and the services we provide. By accessing or using our Site, you agree 
                  to be bound by these Terms and our{' '}
                  <Link href="/privacy" className="text-[#0a4768] hover:text-[#F5DD22] underline">
                    Privacy Policy
                  </Link>.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please read these Terms carefully before using our services. If you do not agree to these Terms, you may not 
                  access or use our Site.
                </p>
              </section>

              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using InsulationPal, you affirm that you are at least 18 years old and have the legal capacity 
                  to enter into these Terms. If you are using our services on behalf of a business or entity, you represent that 
                  you have the authority to bind that entity to these Terms.
                </p>
              </section>

              {/* Description of Services */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">2. Description of Services</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  InsulationPal operates as a marketplace platform that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Connects homeowners seeking insulation services with qualified insulation contractors</li>
                  <li>Allows homeowners to request quotes and information about insulation projects</li>
                  <li>Provides contractors with lead generation and business management tools</li>
                  <li>Facilitates communication between homeowners and contractors</li>
                  <li>Offers educational resources about insulation and energy efficiency</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  InsulationPal is a platform provider only. We do not provide insulation services directly, and we are not 
                  responsible for the actual services performed by contractors.
                </p>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">3. User Accounts</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Account Registration</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Contractors must create an account to access certain features. When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept all risks of unauthorized access to your account</li>
                  <li>Notify us immediately of any unauthorized use or security breach</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Account Responsibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for all activities that occur under your account. We reserve the right to suspend or 
                  terminate accounts that violate these Terms.
                </p>
              </section>

              {/* For Homeowners */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">4. Terms for Homeowners</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Quote Requests</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you submit a quote request:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your information will be shared with qualified contractors in your area</li>
                  <li>You may receive multiple quotes from different contractors</li>
                  <li>You are under no obligation to accept any quote or hire any contractor</li>
                  <li>You consent to being contacted by contractors via phone, email, or text message</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Contractor Selection</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You are solely responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Evaluating and selecting contractors</li>
                  <li>Verifying contractor licenses, insurance, and qualifications</li>
                  <li>Negotiating terms, pricing, and contracts directly with contractors</li>
                  <li>Ensuring contractors comply with local laws and regulations</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">No Endorsement</h3>
                <p className="text-gray-700 leading-relaxed">
                  InsulationPal does not endorse, recommend, or guarantee any contractor. We perform basic screening, but 
                  you should conduct your own due diligence before hiring any contractor.
                </p>
              </section>

              {/* For Contractors */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">5. Terms for Contractors</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Contractor Requirements</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To join our network, contractors must:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Hold valid licenses required in their service areas</li>
                  <li>Maintain appropriate insurance coverage</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Provide truthful and accurate business information</li>
                  <li>Maintain professional standards of conduct</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Lead Purchase and Credits</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Contractors participate in our lead marketplace by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Purchasing credits to receive leads</li>
                  <li>Being charged credits when leads are assigned</li>
                  <li>Responding to leads within specified timeframes</li>
                  <li>Understanding that credits are non-refundable except as required by law</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We do not guarantee any specific number or quality of leads. Lead quality may vary, and not all leads 
                  will result in completed projects.
                </p>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Service Performance</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Contractors agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Respond promptly to homeowner inquiries</li>
                  <li>Provide accurate quotes and project estimates</li>
                  <li>Perform services professionally and competently</li>
                  <li>Honor quoted prices and project timelines</li>
                  <li>Resolve disputes with homeowners in good faith</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Prohibited Conduct</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Contractors must not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Share leads with non-affiliated third parties</li>
                  <li>Misrepresent qualifications, credentials, or business information</li>
                  <li>Engage in deceptive or fraudulent practices</li>
                  <li>Harass, spam, or inappropriately contact homeowners</li>
                  <li>Circumvent the platform to avoid fees</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">6. Payment Terms</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Contractor Fees</h3>
                <p className="text-gray-700 leading-relaxed">
                  Contractors pay for leads and premium features as described on our pricing pages. All fees are due immediately 
                  and processed through our secure payment processor, Stripe. By purchasing credits, you authorize us to charge 
                  your payment method.
                </p>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Refund Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Credits and lead fees are generally non-refundable. We may provide refunds at our discretion for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>Duplicate leads</li>
                  <li>Leads with invalid or fraudulent information</li>
                  <li>Technical errors that prevent lead access</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Refund requests must be submitted within 7 days of lead receipt to refunds@insulationpal.com.
                </p>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Payment Between Homeowners and Contractors</h3>
                <p className="text-gray-700 leading-relaxed">
                  All payments for insulation services are made directly between homeowners and contractors. InsulationPal is 
                  not a party to these transactions and is not responsible for payment disputes.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">7. Intellectual Property Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The Site and its content, including text, graphics, logos, images, software, and other materials, are owned 
                  by InsulationPal or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not copy, modify, distribute, sell, or create derivative works from our content without our express 
                  written permission. You may view and print pages from the Site for your personal, non-commercial use only.
                </p>
              </section>

              {/* User Content */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">8. User Content and Reviews</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Users may submit reviews, testimonials, photos, and other content ("User Content"). By submitting User Content, 
                  you grant InsulationPal a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display 
                  the content in connection with our services.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You own or have rights to submit the User Content</li>
                  <li>The content is accurate and not misleading</li>
                  <li>The content does not violate any laws or third-party rights</li>
                  <li>The content does not contain offensive, defamatory, or inappropriate material</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We reserve the right to remove any User Content that violates these Terms or is otherwise objectionable.
                </p>
              </section>

              {/* Prohibited Uses */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">9. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You may not use the Site to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Violate any local, state, federal, or international law</li>
                  <li>Infringe intellectual property rights</li>
                  <li>Transmit malware, viruses, or harmful code</li>
                  <li>Spam, harass, or abuse other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with the Site's operation or security</li>
                  <li>Scrape, crawl, or harvest data without permission</li>
                  <li>Create fake accounts or manipulate reviews</li>
                  <li>Use the Site for any unauthorized commercial purpose</li>
                </ul>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">10. Disclaimers</h2>
                <p className="text-gray-700 leading-relaxed mb-3 uppercase font-semibold">
                  The Site and Services are Provided "AS IS" and "AS AVAILABLE" Without Warranties of Any Kind.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We disclaim all warranties, express or implied, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                  <li>Warranties regarding accuracy, reliability, or availability of the Site</li>
                  <li>Warranties that the Site will be uninterrupted, secure, or error-free</li>
                  <li>Warranties regarding contractor quality, qualifications, or performance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We do not warrant that the Site will meet your requirements or that defects will be corrected. Your use of 
                  the Site is at your own risk.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-3 uppercase font-semibold">
                  To the Maximum Extent Permitted by Law, InsulationPal Shall Not Be Liable for Any Indirect, Incidental, 
                  Special, Consequential, or Punitive Damages.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  This includes, without limitation, damages for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Loss of profits, revenue, or business opportunities</li>
                  <li>Loss of data or information</li>
                  <li>Property damage or personal injury</li>
                  <li>Cost of substitute services</li>
                  <li>Quality of contractor work or services</li>
                  <li>Disputes between homeowners and contractors</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Our total liability to you for any claims arising from your use of the Site shall not exceed the amount you 
                  paid to InsulationPal in the twelve (12) months preceding the claim, or $100, whichever is greater.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">12. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless InsulationPal, its affiliates, officers, directors, employees, 
                  and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) 
                  arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                  <li>Your use of the Site</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any law or third-party rights</li>
                  <li>Your User Content</li>
                  <li>Services provided by contractors (for contractors)</li>
                  <li>Disputes with contractors or homeowners</li>
                </ul>
              </section>

              {/* Dispute Resolution */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">13. Dispute Resolution and Arbitration</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Informal Resolution</h3>
                <p className="text-gray-700 leading-relaxed">
                  Before filing a formal dispute, you agree to contact us at legal@insulationpal.com to attempt to resolve the 
                  issue informally. We will work in good faith to resolve disputes within 60 days.
                </p>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Binding Arbitration</h3>
                <p className="text-gray-700 leading-relaxed">
                  If we cannot resolve a dispute informally, you agree that disputes will be resolved through binding arbitration 
                  in accordance with the American Arbitration Association's Commercial Arbitration Rules. Arbitration will be 
                  conducted in Maricopa County, Arizona.
                </p>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Class Action Waiver</h3>
                <p className="text-gray-700 leading-relaxed">
                  You agree to bring claims only in your individual capacity and not as a plaintiff or class member in any class 
                  or representative action. Class arbitrations and class actions are not permitted.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">14. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account and access to the Site at any time, with or without 
                  cause or notice, for any reason including violation of these Terms. Upon termination, your right to use the 
                  Site will immediately cease. We are not liable for any termination of your access to the Site.
                </p>
              </section>

              {/* Modifications */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">15. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these Terms at any time by posting the updated Terms on the Site. Your continued use of the Site 
                  after changes are posted constitutes your acceptance of the modified Terms. We encourage you to review these 
                  Terms periodically.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">16. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of the State of Arizona, United States, 
                  without regard to its conflict of law principles. Any legal action or proceeding relating to these Terms shall 
                  be brought exclusively in the courts located in Maricopa County, Arizona.
                </p>
              </section>

              {/* Severability */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">17. Severability</h2>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain 
                  in full force and effect. The invalid provision will be modified to the minimum extent necessary to make it 
                  valid and enforceable.
                </p>
              </section>

              {/* Entire Agreement */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">18. Entire Agreement</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you 
                  and InsulationPal regarding the use of the Site and supersede all prior agreements and understandings.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">19. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>InsulationPal</strong></p>
                  <p className="text-gray-700">14210 N 46th Dr</p>
                  <p className="text-gray-700">Glendale, AZ 85306</p>
                  <p className="text-gray-700 mt-2">Email: legal@insulationpal.com</p>
                  <p className="text-gray-700">Phone: (888) 357-9555</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
