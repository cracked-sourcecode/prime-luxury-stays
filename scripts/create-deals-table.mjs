import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function createDealsTable() {
  console.log('Creating deals table...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      value DECIMAL(12, 2),
      currency TEXT DEFAULT 'EUR',
      stage TEXT DEFAULT 'lead',
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      customer_name TEXT,
      customer_email TEXT,
      property_id INTEGER,
      property_name TEXT,
      check_in DATE,
      check_out DATE,
      guests INTEGER,
      notes TEXT,
      probability INTEGER DEFAULT 0,
      expected_close_date DATE,
      owner TEXT,
      source TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      closed_at TIMESTAMP
    )
  `;
  
  console.log('✅ Deals table created!');
  
  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_deals_customer ON deals(customer_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at)`;
  
  console.log('✅ Indexes created!');
  
  // Add tags column to customers for list building
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS tags TEXT[]`;
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMP`;
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0`;
  
  console.log('✅ Customer columns added!');
}

createDealsTable().catch(console.error);

