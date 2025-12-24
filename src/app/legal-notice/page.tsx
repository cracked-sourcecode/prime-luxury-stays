import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Legal Notice | Impressum | Prime Luxury Stays',
  description: 'Legal information and company details for Prime Luxury Stays, registered in Germany.',
}

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-charcoal-500 hover:text-gold-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="font-merriweather text-4xl md:text-5xl text-charcoal-900 mb-4">
              Legal Notice
            </h1>
            <p className="text-charcoal-500 text-lg">Impressum</p>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mt-6" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Company Info */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Information provided according to Sec. 5 German Telemedia Act (TMG)
              </h2>
              
              <div className="bg-white rounded-2xl border border-cream-200 p-8 mb-6">
                <p className="text-charcoal-900 font-semibold text-xl mb-4">Prime Luxury Stays</p>
                <address className="not-italic text-charcoal-600 leading-relaxed">
                  Otto-Wagner-Str. 5 L<br />
                  82110 Germering<br />
                  Germany
                </address>
              </div>
            </section>

            {/* Representatives */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Represented by
              </h2>
              <div className="bg-cream-100 rounded-2xl p-8">
                <ul className="list-none p-0 m-0 space-y-2 text-charcoal-700">
                  <li>Andrea Jurina</li>
                  <li>Gundula Hess</li>
                  <li>Ben Deveran</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Contact
              </h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <div className="space-y-3 text-charcoal-600">
                  <p>
                    <span className="text-charcoal-400 text-sm uppercase tracking-wide">Phone:</span><br />
                    <a href="tel:+498989930046" className="text-gold-600 hover:text-gold-700 font-medium">
                      +49 89 899 300 46
                    </a>
                  </p>
                  <p>
                    <span className="text-charcoal-400 text-sm uppercase tracking-wide">Email:</span><br />
                    <a href="mailto:info@primeluxurystays.com" className="text-gold-600 hover:text-gold-700 font-medium">
                      info@primeluxurystays.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Register Entry */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Register Entry
              </h2>
              <div className="bg-cream-100 rounded-2xl p-8">
                <p className="text-charcoal-600 mb-2">
                  Registered at <strong>Amtsgericht München</strong>
                </p>
                <p className="text-charcoal-500 text-sm">
                  Registration Number: <span className="italic">Pending</span>
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Dispute Resolution
              </h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <p className="text-charcoal-600 leading-relaxed mb-4">
                  The European Commission provides a platform for online dispute resolution (ODR):
                </p>
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
                >
                  https://ec.europa.eu/consumers/odr
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-charcoal-500 mt-6 text-sm leading-relaxed">
                  We are not obligated and generally not willing to participate in dispute 
                  resolution proceedings before a consumer arbitration board.
                </p>
              </div>
            </section>

            {/* Liability Disclaimer */}
            <section className="mb-12">
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Liability for Content
              </h2>
              <div className="text-charcoal-600 leading-relaxed space-y-4">
                <p>
                  As a service provider, we are responsible for our own content on these pages 
                  according to general laws pursuant to § 7 para.1 TMG. However, according to 
                  §§ 8 to 10 TMG, we are not obligated as a service provider to monitor transmitted 
                  or stored third-party information or to investigate circumstances that indicate 
                  illegal activity.
                </p>
                <p>
                  Obligations to remove or block the use of information under general law remain 
                  unaffected. However, liability in this regard is only possible from the point 
                  in time at which we become aware of a specific legal violation. Upon becoming 
                  aware of such violations, we will remove this content immediately.
                </p>
              </div>
            </section>

            {/* Copyright */}
            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">
                Copyright
              </h2>
              <div className="text-charcoal-600 leading-relaxed space-y-4">
                <p>
                  The content and works created by the site operators on these pages are subject 
                  to German copyright law. Duplication, processing, distribution, or any form of 
                  commercialization of such material beyond the scope of the copyright law shall 
                  require the prior written consent of its respective author or creator.
                </p>
                <p>
                  Downloads and copies of this site are only permitted for private, non-commercial use.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

