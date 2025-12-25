import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/)?.[1];
const sql = neon(dbUrl);

async function setSamplePrices() {
  // Set sample prices for properties that don't have them
  const updates = [
    { slug: 'mariluz', low: 5500, high: 8500 },
    { slug: 'tres-reyes', low: 7200, high: 12000 },
    { slug: 'sa-vinya', low: 4800, high: 7500 },
    { slug: 'es-turo-del-golf', low: 6000, high: 9500 },
    { slug: 'villa-porto-novo', low: 8500, high: 15000 },
    { slug: 'casa-contenta', low: 5200, high: 8000 },
  ];

  for (const u of updates) {
    await sql`
      UPDATE properties 
      SET price_per_week = ${u.low}, price_per_week_high = ${u.high}
      WHERE slug = ${u.slug}
    `;
    console.log(`✓ Updated ${u.slug}: €${u.low} - €${u.high}`);
  }

  console.log('\n✅ Sample prices set!');
}

setSamplePrices();
