import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function createYachtsTable() {
  console.log('Creating yachts table...')

  try {
    // Create yachts table
    await sql`
      CREATE TABLE IF NOT EXISTS yachts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        
        -- Basic Info
        yacht_type VARCHAR(100), -- 'motor', 'sailing', 'catamaran', 'superyacht'
        manufacturer VARCHAR(255),
        model VARCHAR(255),
        year_built INTEGER,
        
        -- Descriptions
        short_description TEXT,
        long_description TEXT,
        
        -- Specifications
        length_meters DECIMAL(10, 2),
        beam_meters DECIMAL(10, 2),
        draft_meters DECIMAL(10, 2),
        gross_tonnage DECIMAL(10, 2),
        max_speed_knots INTEGER,
        cruising_speed_knots INTEGER,
        fuel_capacity_liters INTEGER,
        water_capacity_liters INTEGER,
        
        -- Capacity
        guest_cabins INTEGER,
        crew_cabins INTEGER,
        max_guests INTEGER,
        crew_members INTEGER,
        
        -- Location
        home_port VARCHAR(255),
        cruising_area TEXT, -- e.g., 'Balearic Islands, French Riviera'
        region VARCHAR(100), -- 'Mediterranean', 'Caribbean', etc.
        
        -- Pricing
        price_per_day DECIMAL(12, 2),
        price_per_week DECIMAL(12, 2),
        price_per_day_high DECIMAL(12, 2),
        price_per_week_high DECIMAL(12, 2),
        currency VARCHAR(3) DEFAULT 'EUR',
        
        -- Amenities (boolean flags)
        has_jacuzzi BOOLEAN DEFAULT false,
        has_gym BOOLEAN DEFAULT false,
        has_stabilizers BOOLEAN DEFAULT false,
        has_jet_ski BOOLEAN DEFAULT false,
        has_tender BOOLEAN DEFAULT false,
        has_water_toys BOOLEAN DEFAULT false,
        has_wifi BOOLEAN DEFAULT false,
        has_air_conditioning BOOLEAN DEFAULT false,
        has_satellite_tv BOOLEAN DEFAULT false,
        has_diving_equipment BOOLEAN DEFAULT false,
        
        -- Additional amenities as JSON
        amenities JSONB DEFAULT '[]',
        water_toys_list JSONB DEFAULT '[]',
        
        -- Images
        featured_image TEXT,
        gallery_images JSONB DEFAULT '[]',
        
        -- Status
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        
        -- SEO
        meta_title VARCHAR(255),
        meta_description TEXT,
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Yachts table created')

    // Create yacht availability table
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_availability (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER REFERENCES yachts(id) ON DELETE CASCADE,
        
        -- Availability period
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        
        -- Status: 'available', 'booked', 'blocked', 'maintenance'
        status VARCHAR(50) DEFAULT 'available',
        
        -- Pricing for this period
        price_per_day DECIMAL(12, 2),
        price_per_week DECIMAL(12, 2),
        
        -- Booking reference if booked
        booking_reference VARCHAR(100),
        notes TEXT,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Yacht availability table created')

    // Create yacht inquiries table
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_inquiries (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER REFERENCES yachts(id) ON DELETE SET NULL,
        yacht_name VARCHAR(255),
        
        -- Customer info
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        
        -- Charter details
        charter_type VARCHAR(50), -- 'day', 'week', 'custom'
        start_date DATE,
        end_date DATE,
        guests INTEGER,
        
        -- Request details
        message TEXT,
        special_requests TEXT,
        
        -- Status
        status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'
        
        -- Source
        source_url TEXT,
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Yacht inquiries table created')

    // Create yacht crew table (optional - for detailed crew info)
    await sql`
      CREATE TABLE IF NOT EXISTS yacht_crew (
        id SERIAL PRIMARY KEY,
        yacht_id INTEGER REFERENCES yachts(id) ON DELETE CASCADE,
        
        role VARCHAR(100) NOT NULL, -- 'captain', 'chef', 'stewardess', 'deckhand', etc.
        name VARCHAR(255),
        nationality VARCHAR(100),
        languages TEXT, -- comma-separated
        bio TEXT,
        photo_url TEXT,
        years_experience INTEGER,
        certifications TEXT,
        
        is_active BOOLEAN DEFAULT true,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✓ Yacht crew table created')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_slug ON yachts(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_region ON yachts(region)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_active ON yachts(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yachts_featured ON yachts(is_featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_availability_yacht ON yacht_availability(yacht_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_availability_dates ON yacht_availability(start_date, end_date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_inquiries_yacht ON yacht_inquiries(yacht_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_yacht_inquiries_status ON yacht_inquiries(status)`
    console.log('✓ Indexes created')

    console.log('\n✅ Yacht schema created successfully!')
    console.log('\nTables created:')
    console.log('  - yachts (main yacht listings)')
    console.log('  - yacht_availability (charter periods & pricing)')
    console.log('  - yacht_inquiries (booking requests)')
    console.log('  - yacht_crew (crew member profiles)')

  } catch (error) {
    console.error('Error creating yacht schema:', error)
    throw error
  }
}

createYachtsTable()

