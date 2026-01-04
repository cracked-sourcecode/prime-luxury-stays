-- Migration: Add distance fields to properties table
-- Run this in your Neon database console

ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_beach VARCHAR(50);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_restaurants VARCHAR(50);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_old_town VARCHAR(50);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_airport VARCHAR(50);

-- Set default values for existing properties (optional)
UPDATE properties SET 
    distance_beach = '5 min',
    distance_restaurants = '10 min',
    distance_old_town = '15 min',
    distance_airport = '25 min'
WHERE distance_beach IS NULL;

