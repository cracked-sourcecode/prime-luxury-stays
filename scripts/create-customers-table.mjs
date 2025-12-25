import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function createCustomersTable() {
  console.log('Creating customers table...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      notes TEXT,
      source TEXT DEFAULT 'import',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('✅ Customers table created!');
  
  // Create index on email for faster lookups
  await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name)`;
  
  console.log('✅ Indexes created!');
}

createCustomersTable().catch(console.error);
