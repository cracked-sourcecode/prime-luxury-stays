import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy | Prime Luxury Stays',
  description: 'Cookie policy for Prime Luxury Stays. Information about how we use cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navigation />
      
      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-charcoal-500 hover:text-gold-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="mb-12">
            <h1 className="font-merriweather text-4xl md:text-5xl text-charcoal-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-charcoal-500 text-lg">Cookie-Richtlinie</p>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mt-6" />
          </div>

          <div className="space-y-10 text-charcoal-600 leading-relaxed">
            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">What Are Cookies?</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet,
                  smartphone) when you visit a website. They help the website remember your
                  preferences and understand how you interact with it. Cookies do not damage
                  your device and do not contain viruses.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">Cookies We Use</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-cream-200 p-8">
                  <h3 className="font-semibold text-charcoal-800 mb-3">Essential Cookies</h3>
                  <p className="mb-3">
                    These cookies are necessary for the website to function properly. They cannot
                    be disabled.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-cream-200">
                          <th className="text-left py-2 pr-4 font-medium text-charcoal-800">Cookie</th>
                          <th className="text-left py-2 pr-4 font-medium text-charcoal-800">Purpose</th>
                          <th className="text-left py-2 font-medium text-charcoal-800">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-charcoal-600">
                        <tr className="border-b border-cream-100">
                          <td className="py-2 pr-4 font-mono text-xs">locale</td>
                          <td className="py-2 pr-4">Stores your language preference (EN/DE)</td>
                          <td className="py-2">1 year</td>
                        </tr>
                        <tr className="border-b border-cream-100">
                          <td className="py-2 pr-4 font-mono text-xs">admin_session</td>
                          <td className="py-2 pr-4">Admin authentication (admin users only)</td>
                          <td className="py-2">24 hours</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-cream-200 p-8">
                  <h3 className="font-semibold text-charcoal-800 mb-3">Functional Cookies</h3>
                  <p>
                    We currently do not use analytics, advertising, or third-party tracking cookies.
                    If this changes in the future, we will update this policy and request your consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">Managing Cookies</h2>
              <div className="bg-cream-100 rounded-2xl p-8 space-y-4">
                <p>
                  You can control and manage cookies through your browser settings. Most browsers
                  allow you to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View what cookies are stored and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block all cookies</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
                <p className="text-charcoal-500 text-sm">
                  Please note that blocking essential cookies may affect the functionality of this website.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">Third-Party Services</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  Our website uses the following third-party services which may set their own cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Cloud Storage</strong> — for hosting images and media content</li>
                  <li><strong>Neon Database</strong> — for data storage (server-side only, no client cookies)</li>
                </ul>
                <p>
                  These services have their own privacy and cookie policies. We recommend reviewing
                  their documentation for details.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">Changes to This Policy</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be posted
                  on this page with an updated revision date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">Contact</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <p>
                  If you have questions about our use of cookies, please contact us at:<br />
                  Email: <a href="mailto:info@primeluxurystays.com" className="text-gold-600 hover:text-gold-700">info@primeluxurystays.com</a>
                </p>
              </div>
            </section>

            <p className="text-charcoal-400 text-sm">Last updated: February 2026</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
