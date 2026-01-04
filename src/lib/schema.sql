-- =============================================
-- Prime Luxury Stays - Complete Database Schema
-- =============================================

-- Properties table (main listing data)
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    house_type VARCHAR(100) NOT NULL DEFAULT 'Villa',
    license_number VARCHAR(100),
    registry_number VARCHAR(255),
    
    -- Location
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100) DEFAULT 'Mallorca',
    country VARCHAR(100) DEFAULT 'Spain',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Property details
    bedrooms INTEGER,
    bathrooms INTEGER,
    max_guests INTEGER,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Featured image (synced from property_images)
    featured_image TEXT,
    website_url VARCHAR(500),
    
    -- Pricing (internal - not shown publicly)
    owner_price_per_day DECIMAL(10, 2),
    sales_price_per_day DECIMAL(10, 2),
    cleaning_fee DECIMAL(10, 2),
    commission_percent DECIMAL(5, 2),
    
    -- Amenities
    has_pool BOOLEAN DEFAULT false,
    has_sea_view BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    has_heating BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT true,
    is_beachfront BOOLEAN DEFAULT false,
    
    -- Distances (in minutes)
    distance_beach VARCHAR(50),          -- e.g. "5 min", "10 min", "N/A"
    distance_restaurants VARCHAR(50),
    distance_old_town VARCHAR(50),
    distance_airport VARCHAR(50),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    availability_status VARCHAR(50) DEFAULT 'available',
    min_stay_nights INTEGER DEFAULT 7,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Property Images (Cloud Storage URLs)
-- =============================================
CREATE TABLE IF NOT EXISTS property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Cloud Storage Info
    image_url TEXT NOT NULL,           -- Full GCS URL: https://storage.googleapis.com/bucket/path
    storage_bucket VARCHAR(255),        -- e.g., 'primeluxurystays'
    storage_path VARCHAR(500),          -- e.g., 'properties/villa-malgrat/hero.jpg'
    
    -- Image metadata
    caption TEXT,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    image_type VARCHAR(50) DEFAULT 'gallery', -- 'hero', 'gallery', 'floor_plan', 'amenity'
    
    -- Dimensions (optional, for optimization)
    width INTEGER,
    height INTEGER,
    file_size INTEGER,                  -- bytes
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Property Availability & Pricing
-- =============================================
CREATE TABLE IF NOT EXISTS property_availability (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_per_week DECIMAL(10, 2) NOT NULL,
    price_per_night DECIMAL(10, 2),
    min_nights INTEGER DEFAULT 7,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'booked', 'blocked'
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- =============================================
-- Property Owners (Internal)
-- =============================================
CREATE TABLE IF NOT EXISTS property_owners (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    owner_name VARCHAR(255),
    owner_phone VARCHAR(100),
    owner_email VARCHAR(255),
    company_name VARCHAR(255),
    is_agent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Inquiries / Lead Capture
-- =============================================
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    property_slug TEXT,
    property_name TEXT,
    
    -- Guest details
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Booking details
    check_in DATE,
    check_out DATE,
    guests INTEGER,
    message TEXT,
    
    -- Tracking
    source_url TEXT,
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'closed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Admin Users & Sessions
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_featured ON property_images(property_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_property_images_order ON property_images(property_id, display_order);

CREATE INDEX IF NOT EXISTS idx_availability_property ON property_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_availability_dates ON property_availability(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
