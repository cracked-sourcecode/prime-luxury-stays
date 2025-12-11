-- Properties table for Prime Luxury Stays
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
    
    -- Media
    featured_image VARCHAR(500),
    images TEXT[], -- Array of image URLs
    website_url VARCHAR(500),
    
    -- Pricing (internal - not shown publicly per user preference)
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
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    availability_status VARCHAR(50) DEFAULT 'available', -- available, pending, unavailable
    min_stay_nights INTEGER DEFAULT 7,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property owners table (internal use only)
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

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    check_in DATE,
    check_out DATE,
    guests INTEGER,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);

