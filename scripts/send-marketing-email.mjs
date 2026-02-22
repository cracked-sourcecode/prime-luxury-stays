import { Resend } from 'resend';

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Andrea Jurina <aj@primeluxurystays.com>';

// All valid CRM emails
const RECIPIENTS = [
  'mj@skylinemedia.de',
  'ben@rubiconprgroup.com',
  'adrian.braun@cis-academy.ch',
  'aboldyreff@me.com',
  'a.cron@cron-consulting.com',
  'al@kaholding.de',
  'alexruesch88@gmail.com',
  'alexandra@styledhome.ch',
  'alice_eckert@web.de',
  'kkhudson77@gmail.com',
  'elencorose@hotmail.com',
  'beckmann22397@aol.com',
  'Andrea.Eckhart@wienwork.at',
  'dresi2@gmx.de',
  'andrea_juengling@hotmail.com',
  'saxer_andrea@bluewin.ch',
  'andrea.grozaj@gmail.com',
  'bastibrandt@gmx.net',
  'melissameyer94@hotmail.de',
  'andreas.schulig@gmail.com',
  'meagan.bremner@luxuryretreats.com',
  'ajdgreen@googlemail.com',
  'andrew.lynas@lynasfoodservice.com',
  'rachel.niggli@niag.ch',
  'anja.heiner@gmx.de',
  'anna.misko@web.de',
  'Pankratova@gmx.de',
  'annavey34@gmail.com',
  'anne.schulz-guehlstorff@argo.work',
  'anton.neu@arcor.de',
  'simone@nico-huelkenberg.de',
  'anita.kasnitz@arcor.de',
  'artur@montanhas.de',
  'braun@augenpraxisklinik.com',
  'draheim@mail.de',
  'oliver.spiewak@gmx.de',
  'axelschaefer@gmx.net',
  'barbara@langhamm.de',
  'monaco.ab@bluewin.ch',
  'weber_beat@bluewin.ch',
  'kontakt@beate-schmidt.de',
  'a.benz@benz-rohrreinigung.de',
  'berndbecker@gmx.de',
  'bbosch@engbers.de',
  'Bsommer@sommer.com.mx',
  'bianca1012@hotmail.de',
  'barbara.langhammer@langhamm.de',
  'westendorfbirgitt@gmail.com',
  'bodo.stein@web.de',
  'j.a.bothe@gmail.com',
  'brittamarc@aol.com',
  'brittanolte@aol.com',
  'carabrumberg@web.de',
  'holzherr@gmx.net',
  'caldi@campo.group',
  'carola.studlar@studlar.de',
  'mail@carolin-hachenberg.de',
  'caroline.burkhart@gmail.com',
  'caro_zimmer@hotmail.de',
  'ce@endter.eu',
  'carsten.spiess@gmx.net',
  'alexander@celinevictor.com',
  'acappleyards@gmail.com',
  'christian.goetze@gcon.de',
  'christianknoop@gmx.de',
  'christian-zimmermann@mail.de',
  'christiane@grahlke.de',
  'BOC2013@web.de',
  'loew@livia-group.com',
  'rieder-j@web.de',
  'ckirste@bluewin.ch',
  'christoph@better.team',
  'hughesclare@me.com',
  'csgummersbach@gmail.com',
  'claudia-guenther-ol@gmx.de',
  'volker.haxel@gmx.de',
  'claudia_meyer1@freenet.de',
  'od@evion.at',
  'corinagmuender@bluewin.ch',
  'corinnalaura.koch@gmail.com',
  'c_ch@bluewin.ch',
  'C.Eckebrecht@web.de',
  'craigbrown_90@outlook.com',
  'csanjuan@me.com',
  'uhager@crystal-travel.ch',
  'mahnel@impuls-consulting.de',
  'daniel.holmgren@maxi.ica.se',
  'lej78dp@gmail.com',
  'daniel.schwartz@whitecase.com',
  'danja_wieczorek@gmx.de',
  'david.baker@prem-realestate.com',
  'davyd.ioffe@gmail.com',
  'davide10@gmx.net',
  'wilson_d27@sky.com',
  'denise.schindler88@gmail.com',
  'eveeliinaa_@hotmail.com',
  'weichselbaumer@trustpromotion.de',
  'oesch9@gmx.net',
  'diana.rinderle@gmail.com',
  'dilara.strampfer@gmx.de',
  'dirk.luetje@gmx.de',
  'Dirk.tetzlaff@gmx.de',
  'ditte.lagoni@gmail.com',
  'lechner.adalbert@web.de',
  'agnetha.pindur@googlemail.com',
  'salehaltayar@gmail.com',
  'mail@a-meinecke.de',
  'anna_ploessner@me.com',
  'chfitz@dr-fitz.de',
  'Nadine.Duhr@gmail.com',
  'frank_t_weigand@web.de',
  'gabriele@vallentin.net',
  'm.angenendt@columbus-essen.de',
  'jangv@web.de',
  'ina.ziegert@googlemail.com',
  'joachim.Dietrich@cms-hs.com',
  'kathrinkoehler@web.de',
  'k.gasser@gasser-partner.at',
  'miros@swissonline.ch',
  'nicole.mecklinger@web.de',
  'patrick@dr-weninger.at',
  'nicole.freund@ibero.com',
  'Katharina.Schubert@adentics.de',
  'Christina@fairytalewedding-mallorca.com',
  'sia.hadifar@gmx.de',
  'stephen.goetze@gmx.de',
  'peters_daniela@hotmail.com',
  'svendbuhl@web.de',
  'tim.schlun@se-legal.de',
  'dr.tino.mueller@gmx.de',
  'uhbrauer@web.de',
  'alexmaier220889@googlemail.com',
  'ctinabeier@hotmail.de',
  'edeltraud.wiedemann@gmx.de',
  'ebb-schmuck@live.de',
  'Edwinslutter@gmail.com',
  'ralf.eisenbrandt@gmail.com',
  'elena_van_sintern@posteo.de',
  'schenkel@netcologne.de',
  'maierellen@web.de',
  'ec@generalica.ch',
  'erika.chavez1215@gmail.com',
  'marco.ferstl@excellentair.de',
  'maltafranzi@gmail.com',
  'bachmann.fabian@kabelmail.de',
  'fabian.gamsjaeger@gmx.net',
  'marti@racinereisen.ch',
  'cnln@bluewin.ch',
  'n.ostermann@ostermann-gruppe.de',
  'jennie@better.team',
  'sissu-2003@web.de',
  'almeo@web.de',
  'simone.pickrahn@googlemail.com',
  'rb-ellerau@gmx.net',
  'schertler@bluewin.ch',
  'schrollfriedl@gmail.com',
  'faye@lacelaboratory.com',
  'fayzaschwegler@gmail.com',
  'ralf.klefisch@gmx.de',
  'fernando.feraboli@gmail.com',
  'fiona.nordt@web.de',
  'florentinkesel@me.com',
  'sterzing@st-sued.de',
  'francis@prakriti.ch',
  'F.mairlot@magegroup.com',
  'info@frankdinter.de',
  'f.hoegel@gmx.de',
  'frank.kocher@kocherregalbau.de',
  'Frankmildenberger@mildenberger-verlag.de',
  'frank.schilling-invest@gmx.de',
  'willam.franz@gmail.com',
  's.henning@henning-pferdetransporter.de',
  'f.lanz@ubv.ch',
  'mini_scholey@hotmail.com',
  'gerd.rumpf@gmx.de',
  'gesa.clausen-hansen@gmx.de',
  'Gian-Luca.Itter@gmx.de',
  'gioia.thun@gmx.net',
  'pinaschulze@hotmail.com',
  'Gneukomm@catam.ch',
  'g.kaeser@kfd-steuerberater.de',
  'miv-jork@web.de',
  'wagner@reiselaedle-hofen.de',
  'hannah.pongratz@mail.de',
  'Sandra.Tekeser@gmx.de',
  'hanspeter.kurzmeyer@gmx.ch',
  'Wunder.henrike@gmail.com',
  'henry.graetz@gmx.de',
  'holgerhoefler@gmail.com',
  'einszweidrei@gmx.info',
  'michelle@edgeretreats.com',
  'ilse.wagner@joachim-wagner.net',
  'insa.stoehr@celseo.de',
  'isabelvonwesterholt@web.de',
  'Isamonterrey@gmail.com',
  'i.moerixbauer@gmx.at',
  'jcarvajal@arcanopartners.com',
  'james.west@cruxproductdesign.com',
  'jan.miczaika@gmail.com',
  'jan.scheffel@gmail.com',
  'alicia.g@web.de',
  'schrickel-jana@hotmail.de',
  'j.trifkovic@hotel-dunord.de',
  'j.fedunikmayer@gmail.com',
  'jasmina_rossi@hotmail.com',
  'jennifer.powers@redbull.com',
  'andia.bischof@gmail.com',
  'jerome.bischof@gmail.com',
  'jobaines@gmail.com',
  'jochen.deecke@dfs-ag.de',
  'jochen@langhamm.de',
  'h.helbling@firep.international',
  'hugh_gilbert@hotmail.com',
  'kriebel.jonas@gmail.com',
  'jonasvo@gmx.de',
  'jj@joka.de',
  'joerg.pankla@gmail.com',
  'schucker.josef@web.de',
  'fine4886@web.de',
  'juliakreutner@gmx.de',
  'info@juergenknubben.de',
  'info@cafe-stolz.de',
  'karen.v.harwood@gmail.com',
  'home@buehlertina.de',
  'kagriesemer@hotmail.com',
  'karinneubauer@hotmail.com',
  'kp270559@googlemail.com',
  'karl.reiker@gmx.de',
  'karsten@karstenkoelsch.de',
  'katarina.brywe@carlakliniken.se',
  'r.groetsch@outlook.com',
  'kathryn@360privatetravel.com',
  'katja.hamann@allianz.de',
  'k.vetter@vetter-gvg.de',
  'k.golze@gmx.de',
  'kayschubert@hotmail.de',
  'k.peter@laminatdepot.de',
  'kzeder@web.de',
  'Kldamm@unitybox.de',
  'natasa.mermer@kouneli-media.de',
  'kristin.allerding@gmx.de',
  'lvschubert@gundlach.de',
  'laura.vonschubert@gundlach.de',
  'Lflerlage@delphin-apotheke.biz',
  'store@maximal-outlet.de',
  'lisa.heier@gmx.de',
  'ivanromero@asiagardens.es',
  'lrwklick@web.de',
  'holtzluc20@yahoo.fr',
  'luciaruggieri@icloud.com',
  'luisa_juergens@outlook.com',
  'l.schmutz@tksarchitekten.ch',
  'MC@Luxcara.com',
  'mlkp@poindecker.at',
  'madline-herr@freenet.de',
  'kai@mallorcafoodclub.com',
  'malte@nemitz.sh',
  'veith_manuel@hotmail.com',
  'manuela.wille@wille-beratung.de',
  'meinhardt@bluewin.ch',
  'sabi10@hotmail.de',
  'jennifer-2502@gmx.de',
  '29@marcelschmelzer.com',
  'marcela.pesek@gmx.de',
  'marco-aberle@gmx.de',
  'marciagantenbeinspam@gmail.com',
  'daisymarco@bluewin.ch',
  'Fleck1@gmx.net',
  'marcus.freitag@nexti.de',
  'mareike@mberghorn.de',
  'mareikesiemer@gmx.de',
  'margot.helm@hotmail.com',
  'marian.arnold@web.de',
  'maclassens@gmail.com',
  'marina_bullert@yahoo.de',
  'mario@hauptstadt-helden.de',
  'raimund.broemmel@gmail.com',
  'mario.viazzoli@viazzoli.net',
  'markfoster08@btinternet.com',
  'ksp-nachrichten@mail.de',
  'markus.brand@brand-automobile.ch',
  'mcp@kuegele.com',
  'Egerer.melanie@gmx.de',
  'hauck.markus@gmail.com',
  'betmark@hotmail.de',
  'markus.knoeller@gmail.com',
  'bauer_melanie@hotmail.de',
  'm.klemm@master.de',
  'geschaeftsleitung@krieg.de',
  'matthew.hay91@gmail.com',
  'mb@bonczkowitz.com',
  'Matthias.Klaiber@fricke.de',
  'mm@tfm-Wohnbau.de',
  'matthiasmaresch@aol.com',
  'mh.moser@me.com',
  'susanne.muehlhaus@gmx.de',
  'meikebayer@mail.de',
  'elkemeretz@yahoo.de',
  'larshn19@gmail.com',
  'michael.englert@englert-holding.de',
  'michaelfuchs@de.pepperl-fuchs.com',
  'michael.hermes@gmx.com',
  'langemicha@googlemail.com',
  'michael.lindner@mattig-lindner.de',
  'morellmichael@hotmail.com',
  'info@reise-dorenkamp.de',
  'info@russ-hse.de',
  'michael.t.weis@gmail.com',
  'mw@moebel-wilken.de',
  'mw@wilken.tv',
  'mk.branwen@gmail.com',
  'mike.baur@swissventures.group',
  'familiewlach@gmail.com',
  'miri.hager@hispeed.ch',
  'm.aloys@elizabeth.at',
  'monikagraeser@hotmail.com',
  'morten@ebbesen.dk',
  'lunaohmar@yandex.com',
  'gabriel@theluxurytravelbook.com',
  'muriel.dogwiler@hispeed.ch',
  'laurama_80@hotmail.com',
  'florian.boss@my-humancapital.de',
  'meurrens@meurrens-machinery.be',
  'nvanuem@web.de',
  'n.ellrich@hotmail.com',
  'nathalie.herzog@outlook.de',
  'morganep@vap-company.com',
  'nvb@vonbargenundpartner.de',
  'freddie@theluxurytravelbook.com',
  'nico.tasch@lumitech.com',
  'nicola.buerk@gbp-architekten.de',
  'nicola.pflug@web.de',
  'nicole_gehrig@gmx.ch',
  'nikeco@bluewin.ch',
  'Nicolemutschler@hoehenbalance.de',
  'niklas.brywe@hjartmott.se',
  'ninifee2011@hotmail.com',
  'kraus.nina@gmx.net',
  'norpod@web.de',
  'olaf.nicke@gmx.de',
  'coo@offengroup.de',
  'Oliver.Scharnweber@gmail.com',
  'kerstin@tamimi.de',
  'simsly@gmx.de',
  'Oliver@tamimi.de',
  'ondrejduda43@gmail.com',
  'ortwin.nuernberger@hotmail.de',
  'Otraussnigg@gmx.de',
  'support@paarmonie.com',
  'pammyo@btopenworld.com',
  'ruschek1993@web.de',
  'paul.lang@gmx.ch',
  'me@phm.rocks',
  'peter@stikel.com',
  'peter@vinnemeier.com',
  'peter.weckesser@gmail.com',
  'petra.duerig@gmail.com',
  'petra.hecht@tcare-personalservice.de',
  'petra.hegmann@gmx.de',
  'Petra.Kamp@senner-waldweg.de',
  'ps@toechterle.net',
  'info@petra-wick-immobilienservice.de',
  'p.wenk05@gmx.de',
  'philipp.bock@bock.vc',
  'wiechmann.philipp@gmx.de',
  'pia.rebhorn@gmx.de',
  'nicole.pangerl@gmail.com',
  'hugo@kitzinger.de',
  'meike.schell1@gmail.com',
  'rainerkugler@gmx.de',
  'janna.eisenbrandt@gmail.com',
  'r.neumaier@np-real-estate.de',
  'melinaschnirch@hotmail.de',
  'regina@montanhas.de',
  'info@reiseloft.com',
  'renelouismeyer@bluemail.ch',
  'finn.orthmann@orthmann.ch',
  'rw@iventuregroup.com',
  'r.gugolz@bluewin.ch',
  'robert@mariamartinez.de',
  'robert.roth@rossi-training.at',
  'robert.smola@ge.com',
  'robert.unternaehrer@bluewin.ch',
  'klutinius@gmx.de',
  'rolf.straubinger@googlemail.com',
  'theisslceline@gmail.com',
  'Ronald.zemp@z-cap.ch',
  'manuela.reif@reifb.de',
  'ruedigerthul@web.de',
  'hendrik.rusch@gmx.de',
  'ronald.zemp@rz-capital.com',
  'Sabine.Schulz@endlichzuhause.com',
  'said@hbs-dubai.com',
  'sandra.baerthel@web.de',
  'sandra.thomas2008@freenet.de',
  'sarah@familie-thamm.net',
  'saschakammer@gmx.de',
  'scott@davidson.ac',
  'i.mayer@mayer-frankfurt.de',
  'rokni@systrade.de',
  'silvia.rexhepaj@gmx.de',
  'stubbesilvia@gmail.com',
  'simon@spglimited.com',
  'simone.breuer@gmx.net',
  'simoneb@hispeed.ch',
  'sinaschwarz93@gmx.de',
  's.Buchholz@buchholz-hydraulik.de',
  'Stefankretzschmar73@googlemail.com',
  'stefan.leimgruber@swlegal.ch',
  'office@stefanposch.com',
  'stefan.raab1@freenet.de',
  'Stephan.Stubner@hhl.de',
  'stefan.wagner@handyfuchs.de',
  'tamm.susi@googlemail.com',
  'sylvia_kilian@gmx.de',
  's.geertz@hbi-immo-gmbh.de',
  'Sven.koellmann@fibona.de',
  'splueddemann@gmx.de',
  'svenja.kromer@gmx.com',
  'thomas.bechter@gmx.com',
  'm-t-beringer@web.de',
  'thomas.bierfreund@vr-tuebingen.de',
  'tholst01@aol.com',
  'thomaskoch.ag@googlemail.com',
  'tm@vzch.com',
  'thomas.schinecker@roche.com',
  'thomas@schneidawind.net',
  'tinahaeussermann@gmx.de',
  't.boettcher@logicpile.de',
  'meibom@copeca.de',
  'Tobias.Schumacher@de.ey.com',
  'kuehl@sager-deus.de',
  't.denk@denkservice.com',
  'ulrike.flax@chello.at',
  'ulrike.koehler@web.de',
  'UteKoerner@gmx.de',
  'birk@deutsche-bauwert.com',
  'uwe.danziger@web.de',
  'Uwe.Krauter@gmx.de',
  'schilling-greifswald@gmx.de',
  'beate-baldus@gmx.de',
  'valerie_handal@hotmail.com',
  'vanessagstrein@outlook.com',
  'ruba.privat@bluewin.ch',
  'verena_schenkel@hotmail.com',
  'vicky@kolzen.de',
  'viola.breitkreuz@wetropa.de',
  'v.breitkreuz@gmx.de',
  'violetafalabella@hotmail.com',
  'stbervens@aol.com',
  'vroese@web.de',
  'Volker.Wester@cristie.de',
  'walter.cihal@main.co.at',
  'w.bovens@lueber.com',
  'vclassen@mobau-wirtz-classen.de',
  'willi.thomas@hotmail.de',
  's.bader@novumverlag.com',
  'yvonne.luethy@bluewin.ch',
  'yvonnew@rfw-koeln.de',
];

// URLs
const WEBSITE_URL = 'https://www.primeluxurystays.com/?lang=de';
const FOUR_ELEMENTS_URL = 'https://www.primeluxurystays.com/properties/4-elements?lang=de';
const VILLA_DEL_MAR_URL = 'https://www.primeluxurystays.com/properties/villa-del-mar?lang=de';
const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays-rpr/Company%20Logo';

// Email content
const SUBJECT = 'Private Villen + Yachten | Mallorca & Ibiza Sommer 2026';

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">

<p>Liebe Gäste,</p>

<p>mein Name ist Andrea Jurina von <a href="${WEBSITE_URL}" style="color: #b8860b;"><strong>Prime Luxury Stays</strong></a> — ein deutsches Luxusvillen-Unternehmen auf Mallorca und Ibiza.</p>

<p>Wir verwalten über 20 exklusive Objekte, darunter:</p>

<ul>
  <li><a href="${FOUR_ELEMENTS_URL}" style="color: #b8860b;"><strong>4 Elements</strong></a> – zwei Pools, Jacuzzi, privates Fitnessstudio & Sauna, Panorama-Meerblick in Alcudia</li>
  <li><a href="${VILLA_DEL_MAR_URL}" style="color: #b8860b;"><strong>Villa del Mar</strong></a> – 15m Pool, Dachterrasse, Meerblick in Paguera</li>
</ul>

<p>Ergänzend bieten wir Ihnen privaten <strong>Yachtcharter</strong> mit und ohne Crew als Daycharter oder gerne auch als Unterkunft im Wochencharter.</p>

<p><strong>Direkt buchen — keine Plattformgebühren, Concierge Service inklusive.</strong></p>

<p>Wenn Sie diesen Sommer einen Urlaub auf den Balearen planen, würde ich mich freuen, Ihnen unsere verfügbaren Villen zu zeigen.</p>

<p>Mit freundlichen Grüßen,</p>

<p>
<img src="${LOGO_URL}" alt="Prime Luxury Stays" width="160" style="display: block; margin-bottom: 15px;" /><br>
<strong>Andrea Jurina</strong><br>
Geschäftsführerin<br><br>
<strong>PRIME LUXURY STAYS</strong><br>
München · Mallorca · Miami<br><br>
E-Mail: <a href="mailto:aj@primeluxurystays.com" style="color: #b8860b;">aj@primeluxurystays.com</a><br>
DE: <a href="tel:+498989930046" style="color: #b8860b;">+49 89 899 300 46</a><br>
ES: <a href="tel:+34634306076" style="color: #b8860b;">+34 634 306 076</a><br>
Web: <a href="${WEBSITE_URL}" style="color: #b8860b;">primeluxurystays.com</a>
</p>

</body>
</html>
`;

// TEST MODE - send to test recipients first
const TEST_MODE = false;
const TEST_RECIPIENTS = ['mj@skylinemedia.de', 'ben@rubiconprgroup.com'];

// Send emails in batches
async function sendEmails() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  const resend = new Resend(RESEND_API_KEY);
  
  if (TEST_MODE) {
    console.log('🧪 TEST MODE - Sending to test recipients only');
    console.log(`   To: ${TEST_RECIPIENTS.join(', ')}`);
    console.log('');
    
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: TEST_RECIPIENTS,
        subject: SUBJECT,
        html: HTML_CONTENT,
      });

      if (error) {
        console.error('❌ Error:', error);
      } else {
        console.log('✅ Test email sent!');
        console.log(`   Email ID: ${data.id}`);
      }
    } catch (err) {
      console.error('❌ Failed:', err.message);
    }
    return;
  }

  console.log(`📧 Sending individual emails to ${RECIPIENTS.length} recipients...`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < RECIPIENTS.length; i++) {
    const email = RECIPIENTS[i];
    const progress = `[${i + 1}/${RECIPIENTS.length}]`;
    
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: SUBJECT,
        html: HTML_CONTENT,
      });

      if (error) {
        console.error(`${progress} ❌ ${email}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`${progress} ✅ ${email}`);
        successCount++;
      }
    } catch (err) {
      console.error(`${progress} ❌ ${email}: ${err.message}`);
      errorCount++;
    }

    // Rate limit: 10 emails per second max for Resend
    await new Promise(r => setTimeout(r, 150));
  }

  console.log('');
  console.log('📊 Summary:');
  console.log(`   ✅ Sent: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📧 Total: ${RECIPIENTS.length}`);
}

sendEmails();
