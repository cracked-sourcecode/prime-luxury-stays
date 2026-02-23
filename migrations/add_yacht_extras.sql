-- Add extras column to yachts table for technical extras and add-ons
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS extras TEXT;
