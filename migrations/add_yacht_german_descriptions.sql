-- Add German description columns to yachts table
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS short_description_de TEXT;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS long_description_de TEXT;
