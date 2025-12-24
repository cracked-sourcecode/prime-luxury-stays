import { NextRequest, NextResponse } from 'next/server'
import { getPropertyBySlug } from '@/lib/properties'
import { createInquiry } from '@/lib/inquiries'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      property_slug,
      check_in,
      check_out,
      guests,
      full_name,
      email,
      phone,
      message,
      source_url,
    } = body ?? {}

    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required.' },
        { status: 400 }
      )
    }

    const property = property_slug ? await getPropertyBySlug(property_slug) : null

    // Save to database
    const id = await createInquiry({
      property,
      property_slug: property_slug ?? null,
      check_in: check_in ?? null,
      check_out: check_out ?? null,
      guests: typeof guests === 'number' ? guests : null,
      full_name,
      email,
      phone: phone ?? null,
      message: message ?? null,
      source_url: source_url ?? null,
    })

    // Send email notifications (non-blocking)
    const emailData = {
      fullName: full_name,
      email,
      phone: phone ?? null,
      message: message ?? null,
      propertyName: property?.name ?? null,
      checkIn: check_in ?? null,
      checkOut: check_out ?? null,
      guests: typeof guests === 'number' ? guests : null,
      sourceUrl: source_url ?? null,
    }

    // Send notification to admin
    sendInquiryNotification(emailData).catch(err => {
      console.error('Failed to send admin notification:', err)
    })

    // Send confirmation to customer
    sendInquiryConfirmation(emailData).catch(err => {
      console.error('Failed to send customer confirmation:', err)
    })

    return NextResponse.json({ success: true, id })
  } catch (e) {
    console.error('Inquiry submit error:', e)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}


