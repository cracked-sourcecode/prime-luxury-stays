import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const barracudaYacht = {
  name: 'Barracuda III',
  slug: 'barracuda-iii',
  manufacturer: 'RIVA',
  model: 'Argo 90',
  yacht_type: 'Motor Yacht',
  year_built: 2024,
  length_meters: 28.49,
  beam_meters: 6.5,
  guest_cabins: 4,
  max_guests: 8,
  crew_members: 4,
  short_description: 'Stunning 2024 RIVA Argo 90 motor yacht with 4 en-suite cabins, professional crew, and full water toys package.',
  long_description: `The Barracuda III is a stunning 2024 RIVA Argo 90, representing the pinnacle of Italian yacht craftsmanship. This magnificent motor yacht combines sleek, contemporary design with exceptional performance and luxury amenities.

With 4 beautifully appointed en-suite cabins, the Barracuda III comfortably accommodates up to 8 guests in supreme comfort. The professional crew of 4 ensures an impeccable experience from the moment you step aboard.

Powered by twin MTU 2000 engines, this yacht cruises effortlessly at 22 knots, with zero-speed stabilizers ensuring smooth sailing in all conditions. The spacious deck areas are perfect for sunbathing, al fresco dining, and enjoying the stunning Mediterranean coastline.

The yacht comes equipped with an impressive array of water toys, including a Williams Jet-Tender, Jet Ski, Seabob, SUP Paddleboards, inflatables, and snorkeling equipment – everything you need for the ultimate day at sea.`,
  cruising_speed_knots: 22,
  max_speed_knots: 28,
  has_stabilizers: true,
  has_jet_ski: true,
  has_tender: true,
  has_water_toys: true,
  water_toys_list: JSON.stringify([
    'Williams Jet-Tender',
    'Jet Ski',
    'Seabob',
    'SUP Paddleboard',
    'Inflatables',
    'Snorkeling Equipment'
  ]),
  has_jacuzzi: false,
  has_gym: false,
  has_wifi: true,
  has_air_conditioning: true,
  amenities: JSON.stringify([
    'Air Conditioning',
    'WiFi',
    'Entertainment System',
    'Outdoor Dining',
    'Sun Deck',
    'Swim Platform'
  ]),
  home_port: 'Palma de Mallorca',
  region: 'Mallorca',
  cruising_area: 'Balearic Islands',
  is_active: true,
  is_featured: true,
};

async function seedYacht() {
  console.log('Seeding Barracuda III yacht...');
  
  try {
    // Check if yacht already exists
    const existing = await sql`SELECT id FROM yachts WHERE slug = ${barracudaYacht.slug}`;
    
    if (existing.length > 0) {
      console.log('Yacht already exists, updating...');
      await sql`
        UPDATE yachts SET
          name = ${barracudaYacht.name},
          manufacturer = ${barracudaYacht.manufacturer},
          model = ${barracudaYacht.model},
          yacht_type = ${barracudaYacht.yacht_type},
          year_built = ${barracudaYacht.year_built},
          length_meters = ${barracudaYacht.length_meters},
          beam_meters = ${barracudaYacht.beam_meters},
          guest_cabins = ${barracudaYacht.guest_cabins},
          max_guests = ${barracudaYacht.max_guests},
          crew_members = ${barracudaYacht.crew_members},
          short_description = ${barracudaYacht.short_description},
          long_description = ${barracudaYacht.long_description},
          cruising_speed_knots = ${barracudaYacht.cruising_speed_knots},
          max_speed_knots = ${barracudaYacht.max_speed_knots},
          has_stabilizers = ${barracudaYacht.has_stabilizers},
          has_jet_ski = ${barracudaYacht.has_jet_ski},
          has_tender = ${barracudaYacht.has_tender},
          has_water_toys = ${barracudaYacht.has_water_toys},
          water_toys_list = ${barracudaYacht.water_toys_list}::jsonb,
          has_wifi = ${barracudaYacht.has_wifi},
          has_air_conditioning = ${barracudaYacht.has_air_conditioning},
          amenities = ${barracudaYacht.amenities}::jsonb,
          home_port = ${barracudaYacht.home_port},
          region = ${barracudaYacht.region},
          cruising_area = ${barracudaYacht.cruising_area},
          is_active = ${barracudaYacht.is_active},
          is_featured = ${barracudaYacht.is_featured},
          updated_at = NOW()
        WHERE slug = ${barracudaYacht.slug}
      `;
      console.log('✅ Yacht updated successfully!');
    } else {
      await sql`
        INSERT INTO yachts (
          name, slug, manufacturer, model, yacht_type, year_built,
          length_meters, beam_meters, guest_cabins, max_guests, crew_members,
          short_description, long_description,
          cruising_speed_knots, max_speed_knots,
          has_stabilizers, has_jet_ski, has_tender, has_water_toys, water_toys_list,
          has_wifi, has_air_conditioning, has_jacuzzi, has_gym, amenities,
          home_port, region, cruising_area,
          is_active, is_featured
        ) VALUES (
          ${barracudaYacht.name}, ${barracudaYacht.slug}, ${barracudaYacht.manufacturer}, ${barracudaYacht.model}, ${barracudaYacht.yacht_type}, ${barracudaYacht.year_built},
          ${barracudaYacht.length_meters}, ${barracudaYacht.beam_meters}, ${barracudaYacht.guest_cabins}, ${barracudaYacht.max_guests}, ${barracudaYacht.crew_members},
          ${barracudaYacht.short_description}, ${barracudaYacht.long_description},
          ${barracudaYacht.cruising_speed_knots}, ${barracudaYacht.max_speed_knots},
          ${barracudaYacht.has_stabilizers}, ${barracudaYacht.has_jet_ski}, ${barracudaYacht.has_tender}, ${barracudaYacht.has_water_toys}, ${barracudaYacht.water_toys_list}::jsonb,
          ${barracudaYacht.has_wifi}, ${barracudaYacht.has_air_conditioning}, ${barracudaYacht.has_jacuzzi}, ${barracudaYacht.has_gym}, ${barracudaYacht.amenities}::jsonb,
          ${barracudaYacht.home_port}, ${barracudaYacht.region}, ${barracudaYacht.cruising_area},
          ${barracudaYacht.is_active}, ${barracudaYacht.is_featured}
        )
      `;
      console.log('✅ Yacht created successfully!');
    }
    
    console.log('\n🛥️  Barracuda III RIVA Argo 90 is now available at /yachts/barracuda-iii');
  } catch (err) {
    console.error('❌ Error seeding yacht:', err.message);
    process.exit(1);
  }
}

seedYacht();
