import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/admin'
import { getSpreadsheetData, extractSpreadsheetId } from '@/lib/sheets'

// GET - Fetch availability data from configured spreadsheets
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    
    // Get spreadsheet URL from query params or environment
    const { searchParams } = new URL(request.url)
    const sheetUrl = searchParams.get('url') || process.env.AVAILABILITY_SHEET_URL
    
    if (!sheetUrl) {
      return NextResponse.json({ 
        error: 'No spreadsheet URL configured',
        message: 'Please add AVAILABILITY_SHEET_URL to your environment variables or provide a ?url= parameter'
      }, { status: 400 })
    }
    
    const spreadsheetId = extractSpreadsheetId(sheetUrl)
    if (!spreadsheetId) {
      return NextResponse.json({ 
        error: 'Invalid spreadsheet URL',
        message: 'Could not extract spreadsheet ID from the provided URL'
      }, { status: 400 })
    }
    
    const data = await getSpreadsheetData(spreadsheetId)
    
    return NextResponse.json({ 
      success: true, 
      data,
      spreadsheetUrl: sheetUrl 
    })
  } catch (error: any) {
    console.error('Error fetching availability:', error)
    
    // Handle specific Google API errors
    if (error?.code === 403) {
      return NextResponse.json({ 
        error: 'Access denied',
        message: 'The service account does not have access to this spreadsheet. Please share it with: rubicon-storage@ecstatic-valve-465521-v6.iam.gserviceaccount.com'
      }, { status: 403 })
    }
    
    if (error?.code === 404) {
      return NextResponse.json({ 
        error: 'Spreadsheet not found',
        message: 'The spreadsheet could not be found. Please check the URL.'
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch availability data',
      message: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

