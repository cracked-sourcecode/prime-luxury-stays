import { NextRequest, NextResponse } from 'next/server'
import { getPropertyBySlug } from '@/lib/properties'
import { createInquiry } from '@/lib/inquiries'

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

    return NextResponse.json({ success: true, id })
  } catch (e) {
    console.error('Inquiry submit error:', e)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}


