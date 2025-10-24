import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy - InsulationPal',
  description: 'Learn about how InsulationPal uses cookies and similar tracking technologies'
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0a4768] mb-4">Cookie Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: October 24, 2024</p>
            
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
              
              {/* Introduction */}
              <section>
                <p className="text-gray-700 leading-relaxed">
                  This Cookie Policy explains how InsulationPal ("we," "us," or "our") uses cookies and similar tracking 
                  technologies on our website insulationpal.com (the "Site"). This policy should be read in conjunction with 
                  our{' '}
                  <Link href="/privacy" className="text-[#0a4768] hover:text-[#F5DD22] underline">
                    Privacy Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/terms" className="text-[#0a4768] hover:text-[#F5DD22] underline">
                    Terms of Service
                  </Link>.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By using our Site, you consent to the use of cookies as described in this Cookie Policy.
                </p>
              </section>

              {/* What Are Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently, provide a better user experience, and provide 
                  information to the site owners.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close 
                  your browser, while session cookies are deleted when you close your browser.
                </p>
              </section>

              {/* Types of Cookies We Use */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">2. Types of Cookies We Use</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Strictly Necessary Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies are essential for the Site to function properly. They enable basic functions like page navigation, 
                  access to secure areas, and maintaining your session. The Site cannot function properly without these cookies.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Authentication cookies - Keep you logged in to your contractor account</li>
                  <li>Security cookies - Protect against fraud and enhance site security</li>
                  <li>Load balancing cookies - Distribute traffic across our servers</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Performance and Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies collect information about how visitors use our Site, such as which pages are visited most often 
                  and if users receive error messages. This information helps us improve how our Site works.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Google Analytics - Tracks visitor behavior and site usage patterns</li>
                  <li>Performance monitoring - Identifies technical issues and page load times</li>
                  <li>Error tracking - Helps us identify and fix bugs</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Functionality Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies allow the Site to remember choices you make (such as your location, language, or text size) 
                  and provide enhanced, personalized features.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Preference cookies - Remember your settings and preferences</li>
                  <li>Location cookies - Remember your selected service area</li>
                  <li>Theme cookies - Remember your display preferences (if applicable)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Targeting and Advertising Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies are used to deliver advertisements that are relevant to you and your interests. They may also 
                  be used to limit the number of times you see an advertisement and help measure the effectiveness of advertising 
                  campaigns.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Examples:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Google Ads - Delivers targeted advertisements based on your interests</li>
                  <li>Facebook Pixel - Tracks conversions and retargets visitors</li>
                  <li>Retargeting cookies - Show relevant ads on other websites</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Social Media Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies are set by social media platforms (like Facebook, Twitter, or Instagram) and enable you to share 
                  content with your social networks. They may track your browsing activity across different sites.
                </p>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">3. Third-Party Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  In addition to our own cookies, we use various third-party cookies to provide services and analyze site usage:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Google Analytics:</strong> Provides website analytics and visitor insights</li>
                  <li><strong>Google Ads:</strong> Delivers and measures advertising campaigns</li>
                  <li><strong>Stripe:</strong> Processes secure payments for contractor credits</li>
                  <li><strong>Vercel:</strong> Provides hosting and content delivery services</li>
                  <li><strong>Supabase:</strong> Manages our database and authentication services</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  These third parties have their own privacy policies that govern their use of cookies and personal information. 
                  We recommend reviewing their policies to understand how they use your data.
                </p>
              </section>

              {/* How We Use Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">4. How We Use Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Authentication:</strong> To verify your identity and maintain your logged-in session</li>
                  <li><strong>Security:</strong> To detect and prevent security threats and fraud</li>
                  <li><strong>Preferences:</strong> To remember your settings, language, and location preferences</li>
                  <li><strong>Analytics:</strong> To understand how visitors use our Site and identify areas for improvement</li>
                  <li><strong>Performance:</strong> To monitor site performance and troubleshoot issues</li>
                  <li><strong>Marketing:</strong> To deliver relevant advertisements and measure campaign effectiveness</li>
                  <li><strong>Personalization:</strong> To provide customized content and recommendations</li>
                </ul>
              </section>

              {/* Cookie Duration */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">5. Cookie Duration</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The cookies we use have varying lifespans:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Short-term Persistent Cookies:</strong> Expire within hours or days</li>
                  <li><strong>Long-term Persistent Cookies:</strong> Can last for months or years</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  The specific duration depends on the cookie's purpose and settings.
                </p>
              </section>

              {/* Managing Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">6. How to Manage Cookies</h2>
                
                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-4">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Most web browsers allow you to control cookies through their settings. You can typically:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>View what cookies are stored on your device</li>
                  <li>Delete existing cookies</li>
                  <li>Block all cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Here are links to cookie management instructions for popular browsers:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" 
                    className="text-[#0a4768] hover:text-[#F5DD22] underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" 
                    rel="noopener noreferrer" className="text-[#0a4768] hover:text-[#F5DD22] underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" 
                    rel="noopener noreferrer" className="text-[#0a4768] hover:text-[#F5DD22] underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                    target="_blank" rel="noopener noreferrer" className="text-[#0a4768] hover:text-[#F5DD22] underline">Microsoft Edge</a></li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Opt-Out Tools</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You can opt out of certain third-party cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                    className="text-[#0a4768] hover:text-[#F5DD22] underline">Google Analytics Opt-out Browser Add-on</a></li>
                  <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" 
                    className="text-[#0a4768] hover:text-[#F5DD22] underline">Digital Advertising Alliance Opt-Out</a></li>
                  <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" 
                    className="text-[#0a4768] hover:text-[#F5DD22] underline">Network Advertising Initiative Opt-Out</a></li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0a4768] mb-3 mt-6">Mobile Devices</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mobile devices typically have settings that allow you to limit ad tracking or reset your advertising ID. 
                  Check your device settings for options related to privacy and advertising.
                </p>
              </section>

              {/* Impact of Disabling Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Please note that if you disable or refuse cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Some parts of our Site may not function properly or may be inaccessible</li>
                  <li>You may need to manually adjust preferences each time you visit</li>
                  <li>You may not be able to log in to your contractor account</li>
                  <li>Your user experience may be degraded</li>
                  <li>You may see less relevant advertising</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Strictly necessary cookies cannot be disabled as they are essential for the Site to function.
                </p>
              </section>

              {/* Do Not Track Signals */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">8. Do Not Track Signals</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. 
                  Because there is no common understanding of how to interpret DNT signals, our Site does not currently respond to 
                  DNT signals. However, you can still manage cookies through your browser settings as described above.
                </p>
              </section>

              {/* Other Tracking Technologies */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">9. Other Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  In addition to cookies, we may use other tracking technologies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Web Beacons (Pixels):</strong> Small transparent images embedded in web pages or emails to track 
                  user behavior and measure email campaign effectiveness</li>
                  <li><strong>Local Storage:</strong> Browser storage that allows websites to store data locally on your device</li>
                  <li><strong>Session Storage:</strong> Temporary storage that is cleared when you close your browser tab</li>
                  <li><strong>Server Logs:</strong> Automatically collected information about your device, browser, and 
                  interactions with our Site</li>
                </ul>
              </section>

              {/* Updates to This Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">10. Changes to This Cookie Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal 
                  requirements, or other factors. We will notify you of any material changes by posting the updated Cookie Policy 
                  on this page with a new "Last Updated" date. We encourage you to review this Cookie Policy periodically.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-[#0a4768] mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions about this Cookie Policy or our use of cookies, please contact us:
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

