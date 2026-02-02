-- =============================================
-- Yachts Schema - Prime Luxury Stays
-- =============================================

-- Main yachts table
CREATE TABLE IF NOT EXISTS yachts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Yacht specs
    model VARCHAR(255),                    -- e.g., 'RIVA Argo 90'
    yacht_type VARCHAR(100) DEFAULT 'Motor Yacht', -- 'Motor Yacht', 'Sailing Yacht', 'Catamaran', etc.
    year_built INTEGER,
    length_meters DECIMAL(5, 2),           -- e.g., 28.49
    beam_meters DECIMAL(5, 2),             -- width, e.g., 6.5
    draft_meters DECIMAL(5, 2),            -- depth below waterline
    
    -- Capacity
    guest_cabins INTEGER,
    max_guests INTEGER,
    crew_members INTEGER,
    
    -- Descriptions (bilingual)
    description TEXT,
    description_de TEXT,
    short_description VARCHAR(500),
    short_description_de VARCHAR(500),
    
    -- Technical specs
    engines TEXT,                          -- e.g., '2 x MTU 2000'
    cruising_speed_knots DECIMAL(5, 1),    -- e.g., 22
    max_speed_knots DECIMAL(5, 1),
    fuel_capacity_liters INTEGER,
    water_capacity_liters INTEGER,
    has_stabilizers BOOLEAN DEFAULT false,
    stabilizer_type VARCHAR(100),          -- e.g., '0-Speed Stabilizer'
    
    -- Water toys (stored as JSON array)
    water_toys JSONB DEFAULT '[]'::jsonb,
    
    -- Amenities
    has_jacuzzi BOOLEAN DEFAULT false,
    has_gym BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT true,
    has_ac BOOLEAN DEFAULT true,
    amenities JSONB DEFAULT '[]'::jsonb,   -- Additional amenities as array
    
    -- Featured image
    featured_image TEXT,
    hero_video TEXT,                       -- Video URL for hero section
    
    -- Location/Destination
    home_port VARCHAR(255),                -- e.g., 'Palma de Mallorca'
    destination VARCHAR(100) DEFAULT 'Mallorca',
    available_destinations JSONB DEFAULT '["Mallorca"]'::jsonb,
    
    -- Pricing (daily/weekly charter rates)
    price_per_day DECIMAL(12, 2),
    price_per_week DECIMAL(12, 2),
    low_season_price_per_day DECIMAL(12, 2),
    high_season_price_per_day DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'EUR',
    price_includes TEXT,                   -- What's included in price
    price_includes_de TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    availability_status VARCHAR(50) DEFAULT 'available',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Yacht Images
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
    image_type VARCHAR(50) DEFAULT 'gallery', -- 'hero', 'gallery', 'cabin', 'exterior', 'interior'
    
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Yacht Availability/Charter Calendar
CREATE TABLE IF NOT EXISTS yacht_availability (
    id SERIAL PRIMARY KEY,
    yacht_id INTEGER NOT NULL REFERENCES yachts(id) ON DELETE CASCADE,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_per_day DECIMAL(12, 2),
    min_days INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'booked', 'maintenance'
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT yacht_valid_dates CHECK (end_date >= start_date)
);

-- Property-Yacht Association (for adding yachts to property stays)
CREATE TABLE IF NOT EXISTS property_yacht_options (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    yacht_id INTEGER REFERENCES yachts(id) ON DELETE CASCADE,
    
    is_recommended BOOLEAN DEFAULT false,
    special_rate DECIMAL(12, 2),           -- Optional discounted rate when booked with property
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(property_id, yacht_id)
);

-- Yacht Inquiries
CREATE TABLE IF NOT EXISTS yacht_inquiries (
    id SERIAL PRIMARY KEY,
    yacht_id INTEGER REFERENCES yachts(id) ON DELETE SET NULL,
    yacht_name TEXT,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL, -- If inquiry includes property
    property_name TEXT,
    
    -- Guest details
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Charter details
    charter_date DATE,
    charter_end_date DATE,
    guests INTEGER,
    message TEXT,
    
    -- Charter type
    charter_type VARCHAR(50) DEFAULT 'day_charter', -- 'day_charter', 'week_charter', 'event'
    
    -- Tracking
    source_url TEXT,
    status VARCHAR(20) DEFAULT 'new',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_yachts_slug ON yachts(slug);
CREATE INDEX IF NOT EXISTS idx_yachts_destination ON yachts(destination);
CREATE INDEX IF NOT EXISTS idx_yachts_active ON yachts(is_active);
CREATE INDEX IF NOT EXISTS idx_yachts_featured ON yachts(is_featured);

CREATE INDEX IF NOT EXISTS idx_yacht_images_yacht ON yacht_images(yacht_id);
CREATE INDEX IF NOT EXISTS idx_yacht_images_featured ON yacht_images(yacht_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_yacht_images_order ON yacht_images(yacht_id, display_order);

CREATE INDEX IF NOT EXISTS idx_yacht_availability_yacht ON yacht_availability(yacht_id);
CREATE INDEX IF NOT EXISTS idx_yacht_availability_dates ON yacht_availability(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_property_yacht_property ON property_yacht_options(property_id);
CREATE INDEX IF NOT EXISTS idx_property_yacht_yacht ON property_yacht_options(yacht_id);

CREATE INDEX IF NOT EXISTS idx_yacht_inquiries_created ON yacht_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_yacht_inquiries_status ON yacht_inquiries(status);
