import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_sylBbdhg6G5V@ep-patient-paper-adp6qv4r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function migrate() {
  console.log('🔧 Running admin schema migration...\n');

  // Create property_images table
  console.log('📸 Creating property_images table...');
  await sql`
    CREATE TABLE IF NOT EXISTS property_images (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('   ✅ property_images table created');

  // Create property_availability table  
  console.log('📅 Creating property_availability table...');
  await sql`
    CREATE TABLE IF NOT EXISTS property_availability (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      price_per_week DECIMAL(10, 2) NOT NULL,
      price_per_night DECIMAL(10, 2),
      min_nights INTEGER DEFAULT 7,
      status VARCHAR(20) DEFAULT 'available',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_dates CHECK (end_date >= start_date)
    )
  `;
  console.log('   ✅ property_availability table created');

  // Create admin_users table
  console.log('👤 Creating admin_users table...');
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('   ✅ admin_users table created');

  // Create admin_sessions table
  console.log('🔐 Creating admin_sessions table...');
  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      session_token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('   ✅ admin_sessions table created');

  // Add index for better query performance
  console.log('📊 Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_availability_property ON property_availability(property_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_availability_dates ON property_availability(start_date, end_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(session_token)`;
  console.log('   ✅ Indexes created');

  // Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
  console.log('👤 Creating default admin user...');
  const bcryptHash = '$2b$10$rOzJqQZQGhFQ4mVFqZHN7.Q1f5S7VGxWmZn5qYfYqYfYqYfYqYfYq'; // This is a placeholder
  
  // Simple hash for demo - in production use bcrypt
  const simplePassword = 'primeluxury2024'; // Change this!
  
  try {
    await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES ('admin@primeluxurystays.com', ${simplePassword}, 'Admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('   ✅ Default admin user created (email: admin@primeluxurystays.com)');
  } catch (e) {
    console.log('   ℹ️  Admin user already exists');
  }

  console.log('\n✅ Migration complete!');
  console.log('\n📝 Default admin credentials:');
  console.log('   Email: admin@primeluxurystays.com');
  console.log('   Password: primeluxury2024');
  console.log('\n⚠️  CHANGE THE PASSWORD IN PRODUCTION!');
}

migrate().catch(console.error);

