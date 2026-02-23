import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Datenschutzerklärung | Prime Luxury Stays',
  description: 'Privacy Policy for Prime Luxury Stays. How we collect, use, and protect your personal data in compliance with GDPR.',
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-charcoal-500 text-lg">Datenschutzerklärung</p>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mt-6" />
          </div>

          <div className="space-y-10 text-charcoal-600 leading-relaxed">
            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">1. Data Protection at a Glance</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <h3 className="font-semibold text-charcoal-800">General Information</h3>
                <p>
                  The following information provides a simple overview of what happens to your personal data
                  when you visit this website. Personal data is any data that can be used to personally identify you.
                  For detailed information on data protection, please refer to our full privacy policy below.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">2. Data Collection on This Website</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                  <h3 className="font-semibold text-charcoal-800">Who is responsible for data collection?</h3>
                  <p>
                    Data processing on this website is carried out by the website operator:<br />
                    <strong>Prime Luxury Stays</strong><br />
                    Otto-Wagner-Str. 5 L, 82110 Germering, Germany<br />
                    Email: info@primeluxurystays.com
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                  <h3 className="font-semibold text-charcoal-800">How do we collect your data?</h3>
                  <p>
                    Your data is collected in two ways: (1) data you provide to us directly, such as through
                    inquiry forms, email correspondence, or phone calls; and (2) data collected automatically
                    by our IT systems when you visit the website, such as technical data (e.g., browser type,
                    operating system, time of access).
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                  <h3 className="font-semibold text-charcoal-800">What do we use your data for?</h3>
                  <p>
                    We use your data to process booking inquiries, respond to your questions, provide our
                    property management and yacht charter services, and ensure our website functions correctly.
                    Some data is collected to ensure the website is provided without errors.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                  <h3 className="font-semibold text-charcoal-800">What rights do you have regarding your data?</h3>
                  <p>
                    You have the right to receive information about the origin, recipient, and purpose of your
                    stored personal data free of charge at any time. You also have the right to request the
                    correction or deletion of this data. If you have given your consent to data processing,
                    you can revoke this consent at any time. You also have the right to request the restriction
                    of the processing of your personal data under certain circumstances and to lodge a complaint
                    with the competent supervisory authority.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">3. Hosting & Server Logs</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  This website is hosted by external service providers (hosting providers). The personal data
                  collected on this website is stored on the servers of the hosting providers. This may include
                  IP addresses, browser requests, meta and communication data, website access, and other data
                  generated through the use of a website.
                </p>
                <p>
                  The use of hosting providers is for the purpose of fulfilling contracts with our potential
                  and existing customers (Art. 6 para. 1 lit. b GDPR) and in the interest of a secure, fast,
                  and efficient provision of our online offering by a professional provider (Art. 6 para. 1
                  lit. f GDPR).
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">4. Inquiry Forms & Communication</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  When you contact us via inquiry form, email, or telephone, your provided data (name, email
                  address, phone number, message content, property/yacht preferences, travel dates) will be
                  stored and processed for the purpose of handling your request and in case of follow-up
                  questions. We do not share this data without your consent.
                </p>
                <p>
                  The processing of this data is based on Art. 6 para. 1 lit. b GDPR if your request is
                  related to the performance of a contract or pre-contractual measures. In all other cases,
                  processing is based on our legitimate interest in effectively handling inquiries directed
                  to us (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR).
                </p>
                <p>
                  The data you send us via inquiry forms remains with us until you request deletion, revoke
                  your consent for storage, or the purpose for data storage no longer applies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">5. Google Cloud Storage</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  We use Google Cloud Storage for hosting images and media content. Google Cloud complies
                  with GDPR requirements. For more information, see{' '}
                  <a href="https://cloud.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">
                    Google Cloud Privacy
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">6. Your Rights Under GDPR</h2>
              <div className="bg-cream-100 rounded-2xl p-8 space-y-3">
                <p><strong>Right of access</strong> (Art. 15 GDPR) — You may request confirmation and a copy of your personal data.</p>
                <p><strong>Right to rectification</strong> (Art. 16 GDPR) — You may request correction of inaccurate data.</p>
                <p><strong>Right to erasure</strong> (Art. 17 GDPR) — You may request deletion of your personal data.</p>
                <p><strong>Right to restriction</strong> (Art. 18 GDPR) — You may request restriction of processing.</p>
                <p><strong>Right to data portability</strong> (Art. 20 GDPR) — You may receive your data in a portable format.</p>
                <p><strong>Right to object</strong> (Art. 21 GDPR) — You may object to processing based on legitimate interests.</p>
                <p><strong>Right to withdraw consent</strong> (Art. 7 para. 3 GDPR) — You may withdraw consent at any time.</p>
                <p><strong>Right to lodge a complaint</strong> — You may lodge a complaint with a supervisory authority.</p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">7. Contact</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <p>
                  For data protection inquiries, please contact:<br />
                  <strong>Prime Luxury Stays</strong><br />
                  Email: <a href="mailto:info@primeluxurystays.com" className="text-gold-600 hover:text-gold-700">info@primeluxurystays.com</a><br />
                  Phone: <a href="tel:+498989930046" className="text-gold-600 hover:text-gold-700">+49 89 899 300 46</a>
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
