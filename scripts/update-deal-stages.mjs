import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL);

async function updateStages() {
  console.log('Updating deal stages...');
  
  // Update 'lead' to 'interested'
  const leadResult = await sql`UPDATE deals SET stage = 'interested' WHERE stage = 'lead' RETURNING id`;
  console.log(`Updated ${leadResult.length} deals from 'lead' to 'interested'`);
  
  // Update 'qualified' to 'demo'
  const qualifiedResult = await sql`UPDATE deals SET stage = 'demo' WHERE stage = 'qualified' RETURNING id`;
  console.log(`Updated ${qualifiedResult.length} deals from 'qualified' to 'demo'`);
  
  // Show current stages
  const stages = await sql`SELECT stage, COUNT(*)::int as count FROM deals GROUP BY stage ORDER BY count DESC`;
  console.log('\nCurrent stage distribution:');
  stages.forEach(s => console.log(`  ${s.stage}: ${s.count} deals`));
  
  console.log('\nDone!');
}

updateStages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
