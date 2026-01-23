-- Sheet Availability Table
-- Stores property availability data migrated from Google Sheets

CREATE TABLE IF NOT EXISTS sheet_availability (
    id SERIAL PRIMARY KEY,
    
    -- Region/tab from the sheet
    region VARCHAR(100) NOT NULL,           -- e.g., 'N+', 'NOS+', 'SOSW1', 'SW2', 'IBIZA'
    
    -- Week info
    week_label VARCHAR(50) NOT NULL,        -- Original format: "27.12.-03.01."
    week_start DATE,
    week_end DATE,
    
    -- Property info
    property_name VARCHAR(255) NOT NULL,    -- e.g., "Es Boscarro"
    property_capacity INTEGER,              -- Number in parentheses, e.g., 8
    property_location VARCHAR(255),         -- City/area, e.g., "Santa Margalida"
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'unknown',  -- 'available', 'booked', 'owner', 'on_request', 'unknown'
    raw_value TEXT,                         -- Original cell value for reference
    notes TEXT,                             -- Any additional notes from the sheet
    
    -- Metadata
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sheet_row INTEGER,
    sheet_column INTEGER,
    
    -- Unique constraint to prevent duplicates
    UNIQUE(region, week_label, property_name)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sheet_avail_region ON sheet_availability(region);
CREATE INDEX IF NOT EXISTS idx_sheet_avail_property ON sheet_availability(property_name);
CREATE INDEX IF NOT EXISTS idx_sheet_avail_status ON sheet_availability(status);
CREATE INDEX IF NOT EXISTS idx_sheet_avail_week ON sheet_availability(week_start, week_end);
