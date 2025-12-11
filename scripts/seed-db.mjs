import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_sylBbdhg6G5V@ep-patient-paper-adp6qv4r-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(DATABASE_URL);

const propertiesData = [
  {
    name: 'Vista Malgrat',
    slug: 'vista-malgrat',
    house_type: 'Villa',
    license_number: 'ETV/3730',
    registry_number: 'ESFCTU0000070210002684220000000000000000000ETV/37309',
    address: 'Calle Gaspar M. Jovellanos 42A, 07180 Santa Ponsa',
    city: 'Santa Ponsa',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.5089,
    longitude: 2.4789,
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    description: 'Stunning villa in the prestigious area of Santa Ponsa with breathtaking views of the Malgrats Islands. This beautifully appointed property offers luxury living with modern amenities and traditional Mediterranean charm.',
    short_description: 'Luxury villa with stunning Malgrats Islands views in Santa Ponsa',
    featured_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    website_url: 'https://www.villa-vista-malgrat.com/',
    commission_percent: 22,
    has_pool: true,
    has_sea_view: true,
    has_ac: true,
    has_heating: true,
    is_active: true,
    is_featured: true,
    min_stay_nights: 7,
  },
  {
    name: 'Tres Reyes',
    slug: 'tres-reyes',
    house_type: 'Villa',
    license_number: 'ETV/6151',
    address: 'Calle Gaspar M Jovellanos 15A, 07180 Santa Ponsa',
    city: 'Santa Ponsa',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.5095,
    longitude: 2.4801,
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    description: 'Beautiful family villa in the heart of Santa Ponsa. This exclusive property combines comfort with elegance, featuring spacious living areas and a private pool. Perfect for family getaways with July and August availability.',
    short_description: 'Elegant family villa in Santa Ponsa with private pool',
    featured_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    commission_percent: 22,
    has_pool: true,
    has_sea_view: false,
    has_ac: true,
    has_heating: true,
    is_active: true,
    is_featured: false,
    min_stay_nights: 7,
  },
  {
    name: 'Sunset Dreams',
    slug: 'sunset-dreams',
    house_type: 'Villa',
    license_number: 'ETV/11530',
    registry_number: 'ESFCTU000007032000399900000000000000000000ETV/115302',
    address: 'Carrer Congre 62-64, 07157 Port d\'Andratx',
    city: 'Port d\'Andratx',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.5456,
    longitude: 2.3823,
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    description: 'Exclusive villa in the prestigious Port d\'Andratx with spectacular sunset views over the Mediterranean. This luxury property offers the perfect blend of sophistication and comfort, ideal for those seeking the ultimate Mallorcan experience.',
    short_description: 'Prestigious Port d\'Andratx villa with Mediterranean sunset views',
    featured_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    commission_percent: 20,
    has_pool: true,
    has_sea_view: true,
    has_ac: true,
    has_heating: true,
    is_active: true,
    is_featured: true,
    min_stay_nights: 7,
  },
  {
    name: 'Sa Vinya',
    slug: 'sa-vinya',
    house_type: 'Finca',
    license_number: 'Pending',
    address: 'Near Cas Concos',
    city: 'Cas Concos',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.4312,
    longitude: 3.1456,
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    description: 'First sea line house with breathtaking views and access to the sea. This modern, well-kept property features a live-in housekeeper and offers an unparalleled coastal living experience. Perfect for those seeking privacy and natural beauty.',
    short_description: 'First-line seafront finca with breathtaking coastal views',
    featured_image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80',
    commission_percent: 20,
    has_pool: true,
    has_sea_view: true,
    has_ac: true,
    has_heating: true,
    is_beachfront: true,
    is_active: true,
    is_featured: true,
    min_stay_nights: 30,
  },
  {
    name: 'Mariluz',
    slug: 'mariluz',
    house_type: 'Villa',
    license_number: 'ETV/12951',
    address: 'Calle Miro 65, Port d\'Andratx',
    city: 'Port d\'Andratx',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.5467,
    longitude: 2.3867,
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    description: 'Stunning villa with panoramic sea views and harbour views of Port d\'Andratx. This exclusive property offers the perfect vantage point to enjoy the beauty of one of Mallorca\'s most prestigious ports.',
    short_description: 'Sea and harbour views in exclusive Port d\'Andratx',
    featured_image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&q=80',
    has_pool: true,
    has_sea_view: true,
    has_ac: true,
    has_heating: true,
    is_active: true,
    is_featured: false,
    min_stay_nights: 7,
  },
  {
    name: '4 Elements',
    slug: '4-elements',
    house_type: 'Villa',
    license_number: 'ETV/10688',
    address: 'Bonaire, Alcudia',
    city: 'Alcudia',
    region: 'Mallorca',
    country: 'Spain',
    latitude: 39.8312,
    longitude: 3.1234,
    bedrooms: 5,
    bathrooms: 5,
    max_guests: 10,
    description: 'Modern luxury villa in the exclusive Bonaire area of Alcudia. This stunning property represents the perfect harmony of design and nature, offering an exceptional retreat in northern Mallorca.',
    short_description: 'Modern luxury villa in exclusive Bonaire, Alcudia',
    featured_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    has_pool: true,
    has_sea_view: true,
    has_ac: true,
    has_heating: true,
    is_active: true,
    is_featured: false,
    min_stay_nights: 7,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create tables
    console.log('📦 Creating tables...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        house_type VARCHAR(100) NOT NULL DEFAULT 'Villa',
        license_number VARCHAR(100),
        registry_number VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        region VARCHAR(100) DEFAULT 'Mallorca',
        country VARCHAR(100) DEFAULT 'Spain',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        bedrooms INTEGER,
        bathrooms INTEGER,
        max_guests INTEGER,
        description TEXT,
        short_description VARCHAR(500),
        featured_image VARCHAR(500),
        images TEXT[],
        website_url VARCHAR(500),
        owner_price_per_day DECIMAL(10, 2),
        sales_price_per_day DECIMAL(10, 2),
        cleaning_fee DECIMAL(10, 2),
        commission_percent DECIMAL(5, 2),
        has_pool BOOLEAN DEFAULT false,
        has_sea_view BOOLEAN DEFAULT false,
        has_ac BOOLEAN DEFAULT false,
        has_heating BOOLEAN DEFAULT false,
        has_wifi BOOLEAN DEFAULT true,
        is_beachfront BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        availability_status VARCHAR(50) DEFAULT 'available',
        min_stay_nights INTEGER DEFAULT 7,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
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
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Tables created!\n');

    // Clear existing data
    console.log('🧹 Clearing existing property data...');
    await sql`DELETE FROM properties`;
    console.log('✅ Cleared!\n');

    // Insert properties
    console.log('🏠 Inserting properties...');
    
    for (const property of propertiesData) {
      await sql`
        INSERT INTO properties (
          name, slug, house_type, license_number, registry_number,
          address, city, region, country, latitude, longitude,
          bedrooms, bathrooms, max_guests, description, short_description,
          featured_image, website_url, commission_percent,
          has_pool, has_sea_view, has_ac, has_heating, is_beachfront,
          is_active, is_featured, min_stay_nights
        ) VALUES (
          ${property.name}, ${property.slug}, ${property.house_type}, 
          ${property.license_number || null}, ${property.registry_number || null},
          ${property.address || null}, ${property.city || null}, ${property.region}, ${property.country},
          ${property.latitude || null}, ${property.longitude || null},
          ${property.bedrooms || null}, ${property.bathrooms || null}, ${property.max_guests || null},
          ${property.description || null}, ${property.short_description || null},
          ${property.featured_image || null}, ${property.website_url || null},
          ${property.commission_percent || null},
          ${property.has_pool || false}, ${property.has_sea_view || false},
          ${property.has_ac || false}, ${property.has_heating || false},
          ${property.is_beachfront || false},
          ${property.is_active || true}, ${property.is_featured || false},
          ${property.min_stay_nights || 7}
        )
      `;
      console.log(`  ✅ ${property.name}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   Total properties: ${propertiesData.length}`);

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM properties`;
    console.log(`   Verified in DB: ${count[0].count} properties\n`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

