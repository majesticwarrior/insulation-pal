import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - InsulationPal',
  description: 'Learn how InsulationPal collects, uses, and protects your personal information'
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: October 24, 2024</p>
            
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
              
              {/* Introduction */}
              <section>
                <p className="text-gray-700 leading-relaxed">
                  At InsulationPal ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                  insulationpal.com (the "Site") and use our services to connect homeowners with insulation contractors.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please read this Privacy Policy carefully. By accessing or using our Site, you acknowledge that you have read, understood, 
                  and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not 
                  access the Site.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Personal Information You Provide</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Request a quote for insulation services</li>
                  <li>Register as a contractor on our platform</li>
                  <li>Create an account or log in</li>
                  <li>Contact us through our contact forms</li>
                  <li>Subscribe to our newsletter or communications</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  This information may include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Property information (address, home size, insulation needs)</li>
                  <li>Business information (for contractors: business name, license information, service areas)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Communications and correspondence with us</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you access our Site, we automatically collect certain information about your device and usage, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>IP address and device identifiers</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referring URLs and pages visited</li>
                  <li>Time and date of visits</li>
                  <li>Clickstream data and browsing patterns</li>
                  <li>Location data (with your permission)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Information from Third Parties</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may receive information about you from third-party sources, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Marketing partners and advertising networks</li>
                  <li>Analytics providers</li>
                  <li>Social media platforms (if you connect your account)</li>
                  <li>Public databases and business directories</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Service Delivery:</strong> To connect homeowners with qualified insulation contractors, process quote requests, 
                  and facilitate communication between parties</li>
                  <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and provide customer support</li>
                  <li><strong>Communications:</strong> To send you service-related notifications, lead alerts, quote responses, and other 
                  transactional communications via email and SMS (with your consent)</li>
                  <li><strong>Marketing:</strong> To send promotional materials, newsletters, and special offers (you may opt out at any time)</li>
                  <li><strong>Improvement:</strong> To analyze usage patterns, improve our services, and develop new features</li>
                  <li><strong>Security:</strong> To protect against fraud, unauthorized access, and ensure the security of our platform</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations and respond to legal requests</li>
                  <li><strong>Business Operations:</strong> To conduct analytics, research, and business development</li>
                </ul>
              </section>

              {/* SMS and Text Messaging */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">3. SMS and Text Messaging</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you opt in to receive text messages from InsulationPal, you consent to receive:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Lead notifications (for contractors)</li>
                  <li>Quote updates (for homeowners)</li>
                  <li>Appointment reminders</li>
                  <li>Service updates and alerts</li>
                  <li>Marketing messages (with explicit consent)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Message and data rates may apply. You can opt out of text messages at any time by replying "STOP" to any message 
                  or by updating your notification preferences in your account settings. For help, reply "HELP" or contact us at 
                  help@insulationpal.com.
                </p>
              </section>

              {/* How We Share Your Information */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">4. How We Share Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-lg font-semibold text-[#0a4768] mb-2 mt-4">With Contractors</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you request a quote, we share your contact information and project details with qualified contractors in your area 
                  so they can provide you with estimates and services.
                </p>

                <h3 className="text-lg font-semibold text-[#0a4768] mb-2 mt-4">With Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We work with third-party service providers who perform services on our behalf, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li>Payment processors (Stripe)</li>
                  <li>Email service providers (SendGrid)</li>
                  <li>SMS providers (Twilio)</li>
                  <li>Cloud hosting services (Vercel, Supabase)</li>
                  <li>Analytics providers</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#0a4768] mb-2 mt-4">For Legal Reasons</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information if required by law or in response to valid requests by public authorities, 
                  or to protect our rights, privacy, safety, or property.
                </p>

                <h3 className="text-lg font-semibold text-[#0a4768] mb-2 mt-4">Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>

                <h3 className="text-lg font-semibold text-[#0a4768] mb-2 mt-4">With Your Consent</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share your information for any other purpose with your explicit consent.
                </p>
              </section>

              {/* Cookies and Tracking */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use cookies and similar tracking technologies to collect and track information about your usage of our Site. 
                  For detailed information about our use of cookies, please see our{' '}
                  <Link href="/cookies" className="text-[#0a4768] hover:text-[#F5DD22] underline">
                    Cookie Policy
                  </Link>.
                </p>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">6. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, 
                  access controls, and regular security assessments. However, no method of transmission over the internet or electronic 
                  storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                  unless a longer retention period is required or permitted by law. When we no longer need your information, we will 
                  securely delete or anonymize it.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">8. Your Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                  <li><strong>Opt-Out:</strong> Opt out of marketing communications and data sales</li>
                  <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
                  <li><strong>Objection:</strong> Object to processing of your information</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  To exercise these rights, please contact us at privacy@insulationpal.com. We will respond to your request within 
                  30 days.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our Site is not intended for children under 18 years of age. We do not knowingly collect personal information from 
                  children. If we learn that we have collected personal information from a child without parental consent, we will 
                  delete that information promptly.
                </p>
              </section>

              {/* Third-Party Links */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">10. Third-Party Websites</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of 
                  these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              {/* California Privacy Rights */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">11. California Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Right to know what personal information we collect, use, disclose, and sell</li>
                  <li>Right to request deletion of your personal information</li>
                  <li>Right to opt out of the sale of your personal information</li>
                  <li>Right to non-discrimination for exercising your CCPA rights</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  We do not sell your personal information to third parties. To exercise your CCPA rights, contact us at 
                  privacy@insulationpal.com or call (888) 357-9555.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                  We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 
                  "Last Updated" date. Your continued use of the Site after such changes constitutes your acceptance of the updated 
                  Privacy Policy.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">13. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please 
                  contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>InsulationPal</strong></p>
                  <p className="text-gray-700">14210 N 46th Dr</p>
                  <p className="text-gray-700">Glendale, AZ 85306</p>
                  <p className="text-gray-700 mt-2">Email: privacy@insulationpal.com</p>
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
