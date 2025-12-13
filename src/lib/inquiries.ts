import { sql } from './db'
import type { Property } from './properties'

export type InquiryStatus = 'new' | 'contacted' | 'closed'

export interface Inquiry {
  id: number
  property_id: number | null
  property_slug: string | null
  property_name: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  full_name: string
  email: string
  phone: string | null
  message: string | null
  source_url: string | null
  status: InquiryStatus
  created_at: string
}

export async function createInquiry(input: {
  property?: Property | null
  property_slug?: string | null
  check_in?: string | null
  check_out?: string | null
  guests?: number | null
  full_name: string
  email: string
  phone?: string | null
  message?: string | null
  source_url?: string | null
}) {
  const result = await sql`
    INSERT INTO inquiries (
      property_id,
      property_slug,
      property_name,
      check_in,
      check_out,
      guests,
      full_name,
      email,
      phone,
      message,
      source_url,
      status
    )
    VALUES (
      ${input.property?.id ?? null},
      ${input.property?.slug ?? input.property_slug ?? null},
      ${input.property?.name ?? null},
      ${input.check_in ?? null},
      ${input.check_out ?? null},
      ${input.guests ?? null},
      ${input.full_name},
      ${input.email},
      ${input.phone ?? null},
      ${input.message ?? null},
      ${input.source_url ?? null},
      'new'
    )
    RETURNING id
  `

  return result[0]?.id as number | undefined
}

export async function getInquiriesAdmin(): Promise<Inquiry[]> {
  const rows = await sql`
    SELECT *
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT 500
  `
  return rows as Inquiry[]
}


