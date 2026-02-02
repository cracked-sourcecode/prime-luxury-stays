import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import OpenAI from 'openai';
import { config } from 'dotenv';

// Load .env file
config();

const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/)?.[1];

// Get OpenAI key from environment or .env file (key name is GPT_API)
const openaiKey = process.env.GPT_API || envContent.match(/GPT_API=["']?([^"'\n]+)/)?.[1];

console.log('OpenAI Key found:', openaiKey ? 'Yes' : 'No');

const sql = neon(dbUrl);
const openai = new OpenAI({ apiKey: openaiKey });

async function translateText(text) {
  if (!text) return null;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional translator. Translate the following English text to German. Return ONLY the translated text.' },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    });
    return response.choices[0]?.message?.content?.trim();
  } catch (err) {
    console.error('Translation error:', err.message);
    return null;
  }
}

async function translateTasks() {
  console.log('Fetching tasks without German translations...');
  const tasks = await sql`SELECT id, title, next_step, notes FROM wip_tasks WHERE title_de IS NULL`;
  
  console.log(`Found ${tasks.length} tasks to translate\n`);
  
  for (const task of tasks) {
    console.log(`Translating: ${task.title}`);
    
    const title_de = await translateText(task.title);
    const next_step_de = task.next_step ? await translateText(task.next_step) : null;
    const notes_de = task.notes ? await translateText(task.notes) : null;
    
    await sql`
      UPDATE wip_tasks 
      SET title_de = ${title_de}, next_step_de = ${next_step_de}, notes_de = ${notes_de}
      WHERE id = ${task.id}
    `;
    
    console.log(`  → ${title_de}`);
  }
  
  console.log('\n✅ All tasks translated!');
}

translateTasks().catch(console.error);
