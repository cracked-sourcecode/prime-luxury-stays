import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Get property stats
    const propertiesResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active
      FROM properties
    `
    
    // Get customer stats
    const customersResult = await sql`
      SELECT COUNT(*) as total FROM customers
    `
    
    // Get inquiry stats
    const inquiriesResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent,
        COUNT(*) FILTER (WHERE status = 'new' OR status IS NULL) as pending
      FROM inquiries
    `
    
    // Get recent inquiries
    const recentInquiries = await sql`
      SELECT id, full_name, email, property_name, created_at, status
      FROM inquiries
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    // Get recent customers
    const recentCustomers = await sql`
      SELECT id, name, email, phone, created_at
      FROM customers
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    const stats = {
      totalProperties: Number(propertiesResult[0]?.total) || 0,
      activeProperties: Number(propertiesResult[0]?.active) || 0,
      totalCustomers: Number(customersResult[0]?.total) || 0,
      totalInquiries: Number(inquiriesResult[0]?.total) || 0,
      recentInquiries: Number(inquiriesResult[0]?.recent) || 0,
      pendingInquiries: Number(inquiriesResult[0]?.pending) || 0
    }
    
    return NextResponse.json({
      stats,
      recentInquiries,
      recentCustomers
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}

