import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/)?.[1];
const sql = neon(dbUrl);

// Initial WIP tasks from the provided list
const wipTasks = [
  {
    title: 'Send 2nd email to past customer list',
    next_step: 'Draft and send follow-up email to 600+ past customers',
    priority: 'high',
    assigned_to: 'Andrea'
  },
  {
    title: 'Follow up with current pipeline prospects',
    next_step: 'Schedule demos/calls with interested leads (e.g., Mr. Schubert)',
    priority: 'high',
    assigned_to: 'Andrea'
  },
  {
    title: 'Establish sales process',
    next_step: 'Document clear steps: Interest → Demo → Proposal → Close',
    priority: 'high',
    assigned_to: 'Ben'
  },
  {
    title: 'Get first booking/deal',
    next_step: 'Focus all efforts on closing one property rental',
    priority: 'high',
    assigned_to: 'Gundula, Andrea'
  },
  {
    title: 'Create Work In Progress list in app',
    next_step: 'Add WIP tracking tab to admin side of app',
    priority: 'high',
    assigned_to: 'Ben',
    is_complete: true
  },
  {
    title: 'Schedule regular management meetings',
    next_step: 'Set up 2-3x weekly calls to review WIP and business development',
    priority: 'high',
    assigned_to: 'Ben, Gundula, Andrea'
  },
  {
    title: "Document Gundula's process/knowledge",
    next_step: 'Turn institutional knowledge into software/database for scalability',
    priority: 'medium',
    assigned_to: 'Ben, Gundula'
  },
  {
    title: 'Define roles and responsibilities',
    next_step: 'Clarify who owns sales, marketing, operations, tech',
    priority: 'medium',
    assigned_to: 'Ben, Gundula, Andrea'
  },
  {
    title: 'Fix region filter display issue',
    next_step: 'When clicking 4 areas of island, show correct houses per region',
    priority: 'medium',
    assigned_to: 'Ben'
  },
  {
    title: 'Review Port Andratx categorization',
    next_step: 'Decide if village should be separate or merged into regional categories',
    priority: 'low',
    assigned_to: 'Ben, Gundula'
  },
  {
    title: 'Add house features visibility',
    next_step: 'Show pool heating and other paid extras clearly to customers',
    priority: 'medium',
    assigned_to: 'Ben'
  },
  {
    title: 'Add boats to the app',
    next_step: 'Upload boat inventory to the platform',
    priority: 'medium',
    assigned_to: 'Andrea, Ben'
  },
  {
    title: 'Build organic content strategy',
    next_step: 'Plan short-form video content (Reels/TikTok) showcasing villas',
    priority: 'medium',
    assigned_to: 'Ben'
  },
  {
    title: 'Potential Mallorca trip for content',
    next_step: 'Visit properties to create marketing content',
    priority: 'low',
    assigned_to: 'Ben'
  },
  {
    title: 'AI training for team',
    next_step: 'Teach Gundula/Andrea basic AI tools to improve efficiency',
    priority: 'low',
    assigned_to: 'Ben'
  }
];

async function seedWipTasks() {
  console.log('Creating WIP tasks table if not exists...');
  
  // Create the table
  await sql`
    CREATE TABLE IF NOT EXISTS wip_tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      next_step TEXT,
      priority VARCHAR(20) NOT NULL DEFAULT 'medium',
      assigned_to VARCHAR(100),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      is_complete BOOLEAN NOT NULL DEFAULT false,
      completed_at TIMESTAMP WITH TIME ZONE,
      category VARCHAR(100),
      sort_order INTEGER DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_wip_tasks_status ON wip_tasks(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_wip_tasks_priority ON wip_tasks(priority)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_wip_tasks_is_complete ON wip_tasks(is_complete)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_wip_tasks_assigned_to ON wip_tasks(assigned_to)`;
  
  console.log('Table created successfully!');
  
  // Check if tasks already exist
  const existing = await sql`SELECT COUNT(*) as count FROM wip_tasks`;
  if (parseInt(existing[0].count) > 0) {
    console.log(`WIP tasks table already has ${existing[0].count} tasks. Skipping seed.`);
    console.log('To re-seed, first delete existing tasks with: DELETE FROM wip_tasks;');
    return;
  }
  
  console.log('Seeding WIP tasks...');
  
  for (let i = 0; i < wipTasks.length; i++) {
    const task = wipTasks[i];
    await sql`
      INSERT INTO wip_tasks (title, next_step, priority, assigned_to, is_complete, status, completed_at, sort_order)
      VALUES (
        ${task.title},
        ${task.next_step},
        ${task.priority},
        ${task.assigned_to},
        ${task.is_complete || false},
        ${task.is_complete ? 'complete' : 'active'},
        ${task.is_complete ? new Date().toISOString() : null},
        ${i}
      )
    `;
    console.log(`  ✓ ${task.title}`);
  }
  
  console.log(`\n✅ Successfully seeded ${wipTasks.length} WIP tasks!`);
}

seedWipTasks().catch(console.error);
