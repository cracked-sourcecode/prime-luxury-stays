import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | AGB | Prime Luxury Stays',
  description: 'Terms and conditions for Prime Luxury Stays property rental and yacht charter services.',
}

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-charcoal-500 text-lg">Allgemeine Geschäftsbedingungen (AGB)</p>
            <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full mt-6" />
          </div>

          <div className="space-y-10 text-charcoal-600 leading-relaxed">
            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">1. Scope & Definitions</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  These Terms and Conditions govern the use of the Prime Luxury Stays website
                  (primeluxurystays.com) and all booking inquiries, property rental agreements,
                  and yacht charter services provided by Prime Luxury Stays ("we", "us", "our"),
                  Otto-Wagner-Str. 5 L, 82110 Germering, Germany.
                </p>
                <p>
                  "Guest" or "Client" refers to the person making a booking inquiry or entering
                  into a rental/charter agreement. "Property" refers to any holiday rental listed
                  on our platform. "Yacht" refers to any vessel listed for charter on our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">2. Booking & Reservations</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  All inquiries submitted through our website are non-binding requests. A binding
                  reservation is only established once we confirm availability, pricing, and the
                  guest accepts the terms in writing (email confirmation constitutes written form).
                </p>
                <p>
                  Reservation confirmations will include the property/yacht name, dates, pricing
                  breakdown, payment schedule, cancellation terms, and any additional fees (cleaning,
                  security deposit, pool heating, etc.).
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">3. Pricing & Payment</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  All prices displayed on the website are indicative and subject to change. Final
                  pricing will be confirmed in the reservation confirmation. Prices are quoted in
                  Euros (€) unless otherwise stated.
                </p>
                <p>
                  Additional costs such as security deposits, cleaning fees, pool heating, and
                  tourist taxes may apply and will be clearly communicated before booking confirmation.
                </p>
                <p>
                  Payment terms (deposit amount, balance due date, accepted payment methods) will
                  be specified in the individual booking confirmation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">4. Cancellation Policy</h2>
              <div className="bg-cream-100 rounded-2xl p-8 space-y-4">
                <p>
                  Cancellation terms vary by property and booking period. Specific cancellation
                  conditions will be included in the booking confirmation. Generally:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellations more than 60 days before arrival: deposit may be refundable minus administrative fees.</li>
                  <li>Cancellations 30–60 days before arrival: 50% of total rental may be due.</li>
                  <li>Cancellations less than 30 days before arrival: full rental amount may be due.</li>
                </ul>
                <p className="text-charcoal-500 text-sm">
                  We strongly recommend travel insurance to protect against unforeseen cancellations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">5. Security Deposit</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  A security deposit (Kaution) may be required for property rentals. The deposit
                  amount will be stated in the booking confirmation. The deposit will be returned
                  within 14 days after departure, provided no damage has been caused and the
                  property is left in an acceptable condition.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">6. Guest Responsibilities</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  Guests are expected to treat the property and its contents with care. Maximum
                  occupancy limits must be respected. Guests are liable for any damage caused
                  during their stay beyond normal wear and tear. Subletting or unauthorized use
                  of the property is prohibited.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">7. Yacht Charter Terms</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  Yacht charters include a professional crew. Itineraries are subject to weather
                  conditions and the captain's discretion for safety. Charter pricing includes
                  crew, fuel (unless otherwise stated), and standard insurance. Food, beverages,
                  port fees, and special requests may incur additional charges.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">8. Liability</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8 space-y-4">
                <p>
                  Prime Luxury Stays acts as an intermediary between property owners/yacht operators
                  and guests. While we carefully vet all properties and yachts, we cannot be held
                  liable for circumstances beyond our control, including but not limited to:
                  construction works in the vicinity, weather conditions, utility failures, or
                  changes made by the property owner.
                </p>
                <p>
                  Our liability is limited to the commission portion of the booking value.
                  We are not liable for indirect or consequential damages.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">9. Applicable Law & Jurisdiction</h2>
              <div className="bg-cream-100 rounded-2xl p-8 space-y-4">
                <p>
                  These terms are governed by the laws of the Federal Republic of Germany. Place
                  of jurisdiction is Munich, Germany. For consumers within the EU, mandatory
                  consumer protection provisions of their country of residence apply.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-merriweather text-2xl text-charcoal-900 mb-4">10. Contact</h2>
              <div className="bg-white rounded-2xl border border-cream-200 p-8">
                <p>
                  <strong>Prime Luxury Stays</strong><br />
                  Otto-Wagner-Str. 5 L, 82110 Germering, Germany<br />
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
