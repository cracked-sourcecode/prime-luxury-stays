import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/)?.[1];
const sql = neon(dbUrl);

async function checkPrices() {
  const properties = await sql`
    SELECT id, name, slug, price_per_week, price_per_week_high 
    FROM properties 
    WHERE is_active = true
    LIMIT 5
  `;
  console.log('Properties with prices:');
  properties.forEach(p => {
    console.log(`- ${p.name}: €${p.price_per_week || 'NOT SET'} - €${p.price_per_week_high || 'NOT SET'}`);
  });
}

checkPrices();
