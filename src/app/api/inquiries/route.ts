import { NextRequest, NextResponse } from 'next/server'
import { getPropertyBySlug } from '@/lib/properties'
import { createInquiry } from '@/lib/inquiries'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/email'
import { sql } from '@/lib/db'

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
      locale,
    } = body ?? {}

    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required.' },
        { status: 400 }
      )
    }

    let property = null
    try {
      property = property_slug ? await getPropertyBySlug(property_slug) : null
    } catch (propErr) {
      console.error('Failed to get property:', propErr)
      // Continue without property - not critical
    }

    // Save to database
    let id: number | undefined
    try {
      id = await createInquiry({
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
    } catch (dbErr) {
      console.error('Database insert error:', dbErr)
      return NextResponse.json(
        { success: false, error: 'Failed to save inquiry. Please try again.' },
        { status: 500 }
      )
    }

    // Add/update customer in CRM as a lead
    try {
      // Check if customer already exists by email
      const existingCustomer = await sql`
        SELECT id FROM customers WHERE email = ${email} LIMIT 1
      `
      
      if (existingCustomer.length === 0) {
        // Create new customer as a lead
        const propertyInfo = property ? `Inquiry for: ${property.name}` : (message?.includes('[SERVICE INQUIRY:') ? 'Service inquiry' : 'General inquiry')
        await sql`
          INSERT INTO customers (name, email, phone, notes, source, status)
          VALUES (${full_name}, ${email}, ${phone || null}, ${propertyInfo}, 'website', 'lead')
        `
      } else {
        // Update existing customer with latest info if phone was provided
        if (phone) {
          await sql`
            UPDATE customers 
            SET phone = COALESCE(phone, ${phone}),
                updated_at = NOW()
            WHERE id = ${existingCustomer[0].id}
          `
        }
      }
    } catch (crmErr) {
      console.error('CRM insert error (non-critical):', crmErr)
      // Don't fail the inquiry if CRM insert fails
    }

    // Send email notifications (completely non-blocking - don't await)
    const emailData = {
      fullName: full_name,
      email,
      phone: phone ?? null,
      message: message ?? null,
      propertyName: property?.name ?? null,
      propertyImage: property?.featured_image ?? null,
      propertySlug: property?.slug ?? null,
      propertyLocation: property ? `${property.city || property.region}, ${property.country}` : null,
      propertyBedrooms: property?.bedrooms ?? null,
      propertyBathrooms: property?.bathrooms ?? null,
      propertyMaxGuests: property?.max_guests ?? null,
      checkIn: check_in ?? null,
      checkOut: check_out ?? null,
      guests: typeof guests === 'number' ? guests : null,
      sourceUrl: source_url ?? null,
      locale: locale ?? 'en',
    }

    // Fire and forget - emails should never break the form
    try {
      sendInquiryNotification(emailData).catch(err => {
        console.error('Failed to send admin notification:', err)
      })
      sendInquiryConfirmation(emailData).catch(err => {
        console.error('Failed to send customer confirmation:', err)
      })
    } catch (emailErr) {
      console.error('Email setup error:', emailErr)
      // Don't return error - inquiry was saved successfully
    }

    return NextResponse.json({ success: true, id })
  } catch (e) {
    console.error('Inquiry submit error:', e)
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}


