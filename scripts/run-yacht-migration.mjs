import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log('Running yachts schema migration...');
  
  try {
    // Create yachts table
    await sql`
      CREATE TABLE IF NOT EXISTS yachts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        model VARCHAR(255),
        yacht_type VARCHAR(100) DEFAULT 'Motor Yacht',
        year_built INTEGER,
        length_meters DECIMAL(5, 2),
        beam_meters DECIMAL(5, 2),
        draft_meters DECIMAL(5, 2),
        guest_cabins INTEGER,
        max_guests INTEGER,
        crew_members INTEGER,
        description TEXT,
        description_de TEXT,
        short_description VARCHAR(500),
        short_description_de VARCHAR(500),
        engines TEXT,
        cruising_speed_knots DECIMAL(5, 1),
        max_speed_knots DECIMAL(5, 1),
        fuel_capacity_liters INTEGER,
        water_capacity_liters INTEGER,
        has_stabilizers BOOLEAN DEFAULT false,
        stabilizer_type VARCHAR(100),
        water_toys JSONB DEFAULT '[]'::jsonb,
        has_jacuzzi BOOLEAN DEFAULT false,
        has_gym BOOLEAN DEFAULT false,
        has_wifi BOOLEAN DEFAULT true,
        has_ac BOOLEAN DEFAULT true,
        amenities JSONB DEFAULT '[]'::jsonb,
        featured_image TEXT,
        hero_video TEXT,
        home_port VARCHAR(255),
        destination VARCHAR(100) DEFAULT 'Mallorca',
        available_destinations JSONB DEFAULT '["Mallorca"]'::jsonb,
        price_per_day DECIMAL(12, 2),
        price_per_week DECIMAL(12, 2),
        low_season_price_per_day DECIMAL(12, 2),
        high_season_price_per_day DECIMAL(12, 2),
        currency VARCHAR(10) DEFAULT 'EUR',
        price_includes TEXT,
        price_includes_de TEXT,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        availability_status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Created yachts table');

    // Create yacht_images table
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_images (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER NOT NULL REFERENCES yachts(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        storage_bucket VARCHAR(255),
        storage_path VARCHAR(500),
        caption TEXT,
        caption_de TEXT,
        alt_text VARCHAR(255),
        alt_text_de VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        image_type VARCHAR(50) DEFAULT 'gallery',
        width INTEGER,
        height INTEGER,
        file_size INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Created yacht_images table');

    // Create yacht_availability table
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_availability (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER NOT NULL REFERENCES yachts(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        price_per_day DECIMAL(12, 2),
        min_days INTEGER DEFAULT 1,
        status VARCHAR(20) DEFAULT 'available',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT yacht_valid_dates CHECK (end_date >= start_date)
      )
    `;
    console.log('✅ Created yacht_availability table');

    // Create property_yacht_options table
    await sql`
      CREATE TABLE IF NOT EXISTS property_yacht_options (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        yacht_id INTEGER REFERENCES yachts(id) ON DELETE CASCADE,
        is_recommended BOOLEAN DEFAULT false,
        special_rate DECIMAL(12, 2),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(property_id, yacht_id)
      )
    `;
    console.log('✅ Created property_yacht_options table');

    // Create yacht_inquiries table
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_inquiries (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER REFERENCES yachts(id) ON DELETE SET NULL,
        yacht_name TEXT,
        property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
        property_name TEXT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        charter_date DATE,
        charter_end_date DATE,
        guests INTEGER,
        message TEXT,
        charter_type VARCHAR(50) DEFAULT 'day_charter',
        source_url TEXT,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Created yacht_inquiries table');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_slug ON yachts(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_destination ON yachts(destination)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_active ON yachts(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_featured ON yachts(is_featured)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_images_yacht ON yacht_images(yacht_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_images_featured ON yacht_images(yacht_id, is_featured)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_availability_yacht ON yacht_availability(yacht_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_inquiries_created ON yacht_inquiries(created_at DESC)`;
    console.log('✅ Created indexes');

    console.log('\n✅ Yachts schema created successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

runMigration();
