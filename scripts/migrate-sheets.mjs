#!/usr/bin/env node
/**
 * Migrate availability data from Google Sheets to database
 * 
 * Usage: node scripts/migrate-sheets.mjs
 * 
 * Requires:
 * - GCS_CREDENTIALS_BASE64 env var
 * - DATABASE_URL env var
 * - Google Sheets API enabled
 * - Sheet shared with service account
 */

import { google } from 'googleapis';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const SPREADSHEET_ID = '1TLIQU2HXq9okBaBNN12ntfVirCg4sFzkatRMZhR-cvI';

// Initialize database
const sql = neon(process.env.DATABASE_URL);

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const credentialsBase64 = process.env.GCS_CREDENTIALS_BASE64;
  
  if (!credentialsBase64) {
    throw new Error('GCS_CREDENTIALS_BASE64 environment variable not set');
  }
  
  const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'));
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  return google.sheets({ version: 'v4', auth });
}

// Parse property name to extract capacity
// e.g., "Es Boscarro (8)" -> { name: "Es Boscarro", capacity: 8 }
function parsePropertyName(raw) {
  const match = raw?.match(/^(.+?)\s*\((\d+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), capacity: parseInt(match[2]) };
  }
  return { name: raw?.trim() || '', capacity: null };
}

// Parse week label to extract dates
// e.g., "27.12.-03.01." -> { start: Date, end: Date }
function parseWeekLabel(label, year = 2026) {
  if (!label) return { start: null, end: null };
  
  // Format: "DD.MM.-DD.MM."
  const match = label.match(/(\d{2})\.(\d{2})\.-(\d{2})\.(\d{2})\./);
  if (!match) return { start: null, end: null };
  
  const [, startDay, startMonth, endDay, endMonth] = match;
  
  // Handle year transitions (Dec -> Jan)
  let startYear = year;
  let endYear = year;
  
  // If start month is Dec (12) and end month is Jan (01), end is next year
  if (parseInt(startMonth) === 12 && parseInt(endMonth) === 1) {
    endYear = year;
    startYear = year - 1;
  }
  
  try {
    const start = new Date(startYear, parseInt(startMonth) - 1, parseInt(startDay));
    const end = new Date(endYear, parseInt(endMonth) - 1, parseInt(endDay));
    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}

// Determine status from cell value
function parseStatus(value) {
  if (!value || value.trim() === '' || value === '-') {
    return 'unknown';
  }
  
  const v = value.toLowerCase().trim();
  
  // Owner/blocked
  if (v.includes('owner') || v.includes('blocked') || v.includes('belegt') || v.includes('reserviert')) {
    return 'owner';
  }
  
  // On request
  if (v.includes('a.a') || v.includes('anfrage') || v.includes('request')) {
    return 'on_request';
  }
  
  // Numbers typically mean week number or price = available
  if (/^\d+$/.test(v)) {
    return 'available';
  }
  
  // Contains booking info
  if (v.includes('booked') || v.includes('gebucht')) {
    return 'booked';
  }
  
  return 'unknown';
}

async function createTable() {
  console.log('Creating sheet_availability table...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS sheet_availability (
      id SERIAL PRIMARY KEY,
      region VARCHAR(100) NOT NULL,
      week_label VARCHAR(50) NOT NULL,
      week_start DATE,
      week_end DATE,
      property_name VARCHAR(255) NOT NULL,
      property_capacity INTEGER,
      property_location VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'unknown',
      raw_value TEXT,
      notes TEXT,
      imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      sheet_row INTEGER,
      sheet_column INTEGER,
      UNIQUE(region, week_label, property_name)
    )
  `;
  
  await sql`CREATE INDEX IF NOT EXISTS idx_sheet_avail_region ON sheet_availability(region)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sheet_avail_property ON sheet_availability(property_name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sheet_avail_status ON sheet_availability(status)`;
  
  console.log('Table created successfully.');
}

async function migrateSheet(sheets, sheetName) {
  console.log(`\nMigrating sheet: ${sheetName}`);
  
  // Fetch sheet data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'`,
  });
  
  const rows = response.data.values || [];
  
  if (rows.length < 3) {
    console.log(`  Skipping ${sheetName} - not enough rows`);
    return 0;
  }
  
  // Row 0: Header info (ignored)
  // Row 1: Property names with capacity
  // Row 2: Locations
  // Row 3+: Week data
  
  const propertyRow = rows[1] || [];
  const locationRow = rows[2] || [];
  
  // Extract properties (columns B onwards, index 1+)
  const properties = [];
  for (let col = 1; col < propertyRow.length; col++) {
    const raw = propertyRow[col];
    if (!raw || raw.trim() === '') continue;
    
    const { name, capacity } = parsePropertyName(raw);
    const location = locationRow[col]?.trim() || null;
    
    if (name) {
      properties.push({ col, name, capacity, location });
    }
  }
  
  console.log(`  Found ${properties.length} properties`);
  
  // Process week rows (row 3 onwards)
  let insertCount = 0;
  
  for (let rowIdx = 3; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const weekLabel = row[0]?.trim();
    
    if (!weekLabel || !weekLabel.includes('.')) continue;
    
    const { start: weekStart, end: weekEnd } = parseWeekLabel(weekLabel);
    
    for (const prop of properties) {
      const cellValue = row[prop.col] || '';
      const status = parseStatus(cellValue);
      
      try {
        await sql`
          INSERT INTO sheet_availability (
            region, week_label, week_start, week_end,
            property_name, property_capacity, property_location,
            status, raw_value, sheet_row, sheet_column
          ) VALUES (
            ${sheetName}, ${weekLabel}, ${weekStart}, ${weekEnd},
            ${prop.name}, ${prop.capacity}, ${prop.location},
            ${status}, ${cellValue}, ${rowIdx}, ${prop.col}
          )
          ON CONFLICT (region, week_label, property_name) 
          DO UPDATE SET
            status = EXCLUDED.status,
            raw_value = EXCLUDED.raw_value,
            imported_at = CURRENT_TIMESTAMP
        `;
        insertCount++;
      } catch (err) {
        console.error(`  Error inserting row ${rowIdx}, col ${prop.col}:`, err.message);
      }
    }
  }
  
  console.log(`  Inserted/updated ${insertCount} availability records`);
  return insertCount;
}

async function main() {
  console.log('=== Google Sheets to Database Migration ===\n');
  
  try {
    // Create table
    await createTable();
    
    // Initialize Sheets client
    const sheets = getGoogleSheetsClient();
    
    // Get spreadsheet metadata to find all sheet names
    console.log('\nFetching spreadsheet metadata...');
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const sheetNames = metadata.data.sheets
      ?.map(s => s.properties?.title)
      .filter(Boolean) || [];
    
    console.log(`Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`);
    
    // Migrate each sheet
    let totalRecords = 0;
    for (const sheetName of sheetNames) {
      // Skip sheets that are clearly not availability data
      if (sheetName.toLowerCase().includes('template') || 
          sheetName.toLowerCase().includes('archive')) {
        console.log(`\nSkipping sheet: ${sheetName}`);
        continue;
      }
      
      const count = await migrateSheet(sheets, sheetName);
      totalRecords += count;
    }
    
    console.log(`\n=== Migration Complete ===`);
    console.log(`Total records: ${totalRecords}`);
    
    // Show sample data
    const sample = await sql`
      SELECT region, property_name, week_label, status, raw_value 
      FROM sheet_availability 
      ORDER BY region, week_start 
      LIMIT 10
    `;
    
    console.log('\nSample data:');
    console.table(sample);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
