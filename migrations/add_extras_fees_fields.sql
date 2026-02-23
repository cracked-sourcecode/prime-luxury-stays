-- Add extras & fees columns to properties table
-- deposit_amount: Security deposit / Kaution
-- pool_heating_fee: Pool heating cost per week / Poolheizung
-- (cleaning_fee already exists in original schema)

ALTER TABLE properties ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10, 2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pool_heating_fee DECIMAL(10, 2);
