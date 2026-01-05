-- Add German language fields to properties table
-- These fields allow properties to have both English and German content

ALTER TABLE properties ADD COLUMN IF NOT EXISTS name_de VARCHAR(255);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS short_description_de VARCHAR(500);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_de TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_type_de VARCHAR(100);

-- Optional: Set default German values for existing properties
-- (Admin will need to fill these in properly)
UPDATE properties SET 
    name_de = name,
    short_description_de = short_description,
    description_de = description,
    house_type_de = CASE house_type
        WHEN 'Villa' THEN 'Villa'
        WHEN 'Finca' THEN 'Finca'
        WHEN 'Apartment' THEN 'Wohnung'
        WHEN 'House' THEN 'Haus'
        WHEN 'Penthouse' THEN 'Penthouse'
        WHEN 'Townhouse' THEN 'Stadthaus'
        ELSE house_type
    END
WHERE name_de IS NULL;

