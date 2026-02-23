/**
 * One-time script: update all yachts with fresh EN + DE descriptions.
 * Run: node -r dotenv/config scripts/update-yacht-descriptions.js
 */
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const descriptions = {
  'barracuda-iii': {
    short_description: 'Stunning 2024 RIVA Argo 90 motor yacht with four en-suite cabins, professional crew, and a full water toys package. Ideal for families or groups of up to eight seeking luxury, comfort, and unforgettable Mediterranean days.',
    short_description_de: 'Atemberaubende RIVA Argo 90 Motoryacht von 2024 mit vier Suitenkabinen, professioneller Crew und vollem Wassersport-Equipment. Ideal für Familien oder Gruppen bis acht Personen – Luxus, Komfort und unvergessliche Mittelmeertage.',
    long_description: 'Barracuda III is a 28.5-metre RIVA Argo 90 delivered in 2024, offering contemporary design and exceptional comfort. She features four en-suite guest cabins, a spacious flybridge with sun loungers and dining, and a main deck salon that opens onto the cockpit. The professional crew of two ensures seamless service, and the full water toys package—including tender, paddleboards, and snorkelling gear—makes every day on the water memorable. Perfect for week-long charters or special occasions along the Mallorca and Balearic coast.',
    long_description_de: 'Die Barracuda III ist eine 28,5 Meter lange RIVA Argo 90 aus dem Jahr 2024 mit zeitgenössischem Design und außergewöhnlichem Komfort. An Bord finden Sie vier Gästekabinen mit eigenem Bad, eine großzügige Flybridge mit Sonnenliegen und Esstisch sowie einen Salon auf dem Hauptdeck mit Zugang zum Heckcockpit. Die zweiköpfige professionelle Crew sorgt für einen reibungslosen Service; das komplette Wassersport-Paket – inkl. Beiboot, Paddleboards und Schnorchelausrüstung – macht jeden Tag auf dem Wasser unvergesslich. Ideal für einwöchige Charter oder besondere Anlässe entlang der Küste von Mallorca und den Balearen.',
  },
  'cranchi-m44-ht-trixi': {
    short_description: 'Popular day charter yacht for up to 11 guests, combining style and performance. The Cranchi M44 HT Trixi offers a comfortable cockpit, shaded seating, and easy access to swimming and water sports—perfect for groups and families exploring the coast.',
    short_description_de: 'Beliebtes Tagescharter-Boot für bis zu 11 Gäste: Stil und Fahrspaß in einem. Die Cranchi M44 HT Trixi bietet einen komfortablen Cockpitbereich, schattige Sitzplätze und einfachen Zugang zum Wasser – ideal für Gruppen und Familien an der Küste.',
    long_description: 'Cranchi M44 HT Trixi is a 13.8-metre motor yacht from 2018, built for day charters and coastal exploration. She accommodates up to 11 guests in comfort, with a large cockpit for lounging and dining, a hardtop for shade, and a bathing platform for swimming and water toys. Her agile handling and modern design make her a favourite for half-day or full-day trips around Mallorca. Professional skipper included; ideal for corporate outings, birthdays, or family adventures.',
    long_description_de: 'Die Cranchi M44 HT Trixi ist eine 13,8 Meter lange Motoryacht von 2018, konzipiert für Tagescharter und Küstenfahrten. An Bord haben bis zu 11 Gäste Platz: großer Cockpitbereich zum Entspannen und Essen, Hardtop für Schatten und eine Badeplattform für Schwimmen und Wassersport. Wendigkeit und zeitgemäßes Design machen sie zur beliebten Wahl für Halb- oder Ganztagestouren rund um Mallorca. Professioneller Skipper inklusive; ideal für Firmenevents, Geburtstage oder Familienausflüge.',
  },
  'bavaria-46-topaz': {
    short_description: 'A 14.5-metre sailing yacht for up to 8 guests, offering the classic sailing experience with modern comfort. Bavaria 46 TOPAZ features a spacious cockpit, well-appointed interior, and easy handling—perfect for those who love wind and sea.',
    short_description_de: 'Eine 14,5 Meter lange Segelyacht für bis zu 8 Gäste: klassisches Segelerlebnis mit modernem Komfort. Die Bavaria 46 TOPAZ bietet ein geräumiges Cockpit, komfortable Innenausstattung und einfache Handhabung – ideal für alle, die Wind und Meer lieben.',
    long_description: 'Bavaria 46 TOPAZ is a 14.5-metre sailing yacht from the Bavaria C46 line, delivered in 2024. She offers three guest cabins and a bright, modern interior with full galley and salon. The large cockpit with twin helms is perfect for sailing enthusiasts and relaxed cruising; the bathing platform and optional water toys add to the fun. Whether you want to sail yourself (with skipper briefing) or enjoy a skippered charter, TOPAZ is an excellent choice for a week or a day on the Balearic waters.',
    long_description_de: 'Die Bavaria 46 TOPAZ ist eine 14,5 Meter lange Segelyacht aus der Bavaria-C46-Serie, Baujahr 2024. An Bord: drei Gästekabinen und ein helles, modernes Interieur mit voll ausgestatteter Galley und Salon. Das große Cockpit mit Doppelsteuer eignet sich perfekt für segelbegeisterte Gäste und entspannte Törns; Badeplattform und optionale Wassersportgeräte runden das Angebot ab. Ob mit eigenem Skipper-Briefing oder mit Charter-Skipper – die TOPAZ ist eine hervorragende Wahl für eine Woche oder einen Tag auf den Balearen.',
  },
  'beneteau-54': {
    short_description: 'A 16-metre Beneteau Oceanis 54 sailing yacht from 2023, blending performance and comfort. Spacious deck and interior, ideal for families or groups of up to 8 looking for a true sailing experience in the Mediterranean.',
    short_description_de: 'Eine 16 Meter lange Beneteau Oceanis 54 Segelyacht von 2023: Fahrleistung und Komfort in einem. Großzügiges Deck und Innenbereich – ideal für Familien oder Gruppen bis 8 Personen, die ein echtes Segelerlebnis im Mittelmeer suchen.',
    long_description: 'This Beneteau Oceanis 54 is a 15.98-metre cruising yacht from 2023, designed for comfortable sailing and relaxed living aboard. She features a large cockpit with dining and lounging space, a bright interior salon with galley, and accommodation for guests in well-finished cabins. Easy to sail with modern rigging and equipment; professional skipper available for charter. Perfect for week-long cruises along the Mallorca coast or day sails with family and friends.',
    long_description_de: 'Diese Beneteau Oceanis 54 ist eine 15,98 Meter lange Fahrtenyacht von 2023, konzipiert für entspanntes Segeln und Wohnkomfort an Bord. Großes Cockpit mit Essecke und Sitzbereich, heller Innen-Salon mit Galley und komfortable Gästekabinen. Dank moderner Takelung und Ausrüstung leicht zu segeln; Charter-Skipper auf Wunsch verfügbar. Ideal für einwöchige Törns entlang der Küste Mallorcas oder Tagesausflüge mit Familie und Freunden.',
  },
  'dufour-470-an': {
    short_description: 'A 14.85-metre Dufour 470 sailing yacht from 2024, offering modern design and excellent sailing performance. Up to 6 guests in three cabins, with a spacious cockpit and sleek interior—ideal for couples or small groups.',
    short_description_de: 'Eine 14,85 Meter lange Dufour 470 Segelyacht von 2024: zeitgemäßes Design und starke Segelleistung. Bis zu 6 Gäste in drei Kabinen, geräumiges Cockpit und elegantes Interieur – ideal für Paare oder kleine Gruppen.',
    long_description: 'The Dufour 470 is a 14.85-metre cruiser from 2024, combining responsive sailing with comfortable living. Three cabins provide accommodation for up to six guests; the open-plan salon and galley are bright and well finished. The cockpit is designed for both sailing and relaxing, with easy access to the bathing platform. Available with or without skipper for day charters or longer cruises in the Balearics.',
    long_description_de: 'Die Dufour 470 ist eine 14,85 Meter lange Fahrtenyacht von 2024: lebhaftes Segelverhalten und hoher Wohnkomfort. Drei Kabinen für bis zu sechs Gäste; offener Salon und Galley sind hell und hochwertig ausgestattet. Das Cockpit eignet sich gleichermaßen zum Segeln und Entspannen, mit direktem Zugang zur Badeplattform. Mit oder ohne Skipper buchbar – für Tagescharter oder längere Törns auf den Balearen.',
  },
  'fountain-pajot-46-aurora': {
    short_description: 'A 14-metre Fountain Pajot FP46 catamaran from 2024, offering space, stability, and style. Up to 10 guests in five cabins, with a large flybridge and cockpit—perfect for families and groups who want comfort and room to move.',
    short_description_de: 'Ein 14 Meter langer Fountain Pajot FP46 Katamaran von 2024: Platz, Stabilität und Stil. Bis zu 10 Gäste in fünf Kabinen, mit großer Flybridge und Cockpit – ideal für Familien und Gruppen, die Komfort und Bewegungsfreiheit schätzen.',
    long_description: 'Fountain Pajot 46 AURORA is a 13.94-metre catamaran from 2024, built for comfort and socialising. Five cabins accommodate up to 10 guests; the saloon and galley are open and inviting, and the flybridge offers additional lounging and dining space. The wide cockpit and trampoline forward make her ideal for sunbathing and outdoor living. Stable under sail and at anchor, she is a superb choice for week-long charters or special events in the Mediterranean.',
    long_description_de: 'Die Fountain Pajot 46 AURORA ist ein 13,94 Meter langer Katamaran von 2024, konzipiert für Komfort und Geselligkeit. Fünf Kabinen für bis zu 10 Gäste; Salon und Galley sind offen und einladend, die Flybridge bietet zusätzlichen Sitz- und Essbereich. Das breite Cockpit und das vordere Trampolin laden zum Sonnen und Leben im Freien ein. Unter Segel und vor Anker stabil, ist sie eine ausgezeichnete Wahl für einwöchige Charter oder besondere Anlässe im Mittelmeer.',
  },
  'fountain-pajot-47-saona': {
    short_description: 'A 14-metre Fountain Pajot 47 catamaran from 2018, offering generous space for up to 11 guests. Spacious saloon, flybridge, and cockpit make her ideal for families and groups seeking a relaxed, roomy charter in the Balearics.',
    short_description_de: 'Ein 14 Meter langer Fountain Pajot 47 Katamaran von 2018 mit großzügigem Platz für bis zu 11 Gäste. Geräumiger Salon, Flybridge und Cockpit machen sie zur idealen Wahl für Familien und Gruppen, die eine entspannte, geräumige Charter auf den Balearen suchen.',
    long_description: 'Fountain Pajot 47 SAONA is a 14-metre catamaran from 2018, designed for large groups and extended stays. She accommodates up to 11 guests in comfortable cabins, with a large saloon, well-equipped galley, and multiple outdoor areas including flybridge and cockpit. Her catamaran hull provides stability and space; the layout is ideal for families or friends sharing a week of cruising, swimming, and exploring the coast. Professional crew available for a carefree charter experience.',
    long_description_de: 'Die Fountain Pajot 47 SAONA ist ein 14 Meter langer Katamaran von 2018, konzipiert für große Gruppen und längere Aufenthalte. An Bord finden bis zu 11 Gäste in komfortablen Kabinen Platz; großer Salon, gut ausgestattete Galley und mehrere Außenbereiche inkl. Flybridge und Cockpit. Der Katamaran-Rumpf sorgt für Stabilität und Platz; die Aufteilung eignet sich ideal für Familien oder Freunde auf einwöchiger Charter mit Segeln, Schwimmen und Küstenerkundung. Professionelle Crew auf Wunsch für eine sorgenfreie Charter.',
  },
};

async function main() {
  console.log('Updating yacht descriptions (EN + DE)...\n');
  for (const [slug, text] of Object.entries(descriptions)) {
    const r = await sql`
      UPDATE yachts SET
        short_description = ${text.short_description},
        short_description_de = ${text.short_description_de},
        long_description = ${text.long_description},
        long_description_de = ${text.long_description_de},
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING id, name
    `;
    if (r.length) console.log('Updated:', r[0].name);
    else console.log('Skipped (not found):', slug);
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
