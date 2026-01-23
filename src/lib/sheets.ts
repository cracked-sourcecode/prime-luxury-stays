import { google } from 'googleapis'

// Initialize Google Sheets API with service account credentials
function getGoogleSheetsClient() {
  const credentialsBase64 = process.env.GCS_CREDENTIALS_BASE64
  
  if (!credentialsBase64) {
    throw new Error('GCS_CREDENTIALS_BASE64 environment variable not set')
  }
  
  const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'))
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  
  return google.sheets({ version: 'v4', auth })
}

export interface SheetData {
  sheetName: string
  headers: string[]
  rows: string[][]
}

export interface SpreadsheetData {
  spreadsheetId: string
  title: string
  sheets: SheetData[]
}

/**
 * Fetches all sheets from a Google Spreadsheet
 */
export async function getSpreadsheetData(spreadsheetId: string): Promise<SpreadsheetData> {
  const sheets = getGoogleSheetsClient()
  
  // Get spreadsheet metadata
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
  })
  
  const title = metadata.data.properties?.title || 'Untitled'
  const sheetTitles = metadata.data.sheets?.map(s => s.properties?.title || 'Sheet') || []
  
  // Fetch data from all sheets
  const sheetDataPromises = sheetTitles.map(async (sheetName) => {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'`,
    })
    
    const values = response.data.values || []
    const headers = values[0] || []
    const rows = values.slice(1)
    
    return {
      sheetName,
      headers,
      rows,
    }
  })
  
  const sheetData = await Promise.all(sheetDataPromises)
  
  return {
    spreadsheetId,
    title,
    sheets: sheetData,
  }
}

/**
 * Fetches a specific range from a sheet
 */
export async function getSheetRange(
  spreadsheetId: string, 
  range: string
): Promise<string[][]> {
  const sheets = getGoogleSheetsClient()
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  
  return response.data.values || []
}

/**
 * Extract spreadsheet ID from a Google Sheets URL
 */
export function extractSpreadsheetId(url: string): string | null {
  // Match patterns like:
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}
