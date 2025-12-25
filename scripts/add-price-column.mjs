import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Read .env file manually
const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/)?.[1];

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(dbUrl);

async function addPriceColumn() {
  try {
    // Add price_per_week column to properties if it doesn't exist
    await sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS price_per_week DECIMAL(10, 2)
    `;
    console.log('✓ Added price_per_week column to properties');

    // Add price_per_week_high for seasonal range display
    await sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS price_per_week_high DECIMAL(10, 2)
    `;
    console.log('✓ Added price_per_week_high column to properties');
    
    console.log('\n✅ Schema updated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPriceColumn();
