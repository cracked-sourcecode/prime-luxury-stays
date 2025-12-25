import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

// Raw customer data
const rawCustomers = `Mr. Tatlici	lunaohmar@yandex.com	0044 2032870817
Enrico Campigotto	ec@generalica.ch	0041 79 698 1955
Adrian Braun	adrian.braun@cis-academy.ch	0041 793 560919
Ulrich Müller-Albring	pp@confijuzed.com	0179 906 9598
Stefan Stubner	Stephan.Stubner@hhl.de	0151 65170 000
Rainer Kugler	rainerkugler@gmx.de	0170 964 3670
Uwe Schmoeckel	beate-baldus@gmx.de	0163 4112171
Karin Neubauer	karinneubauer@hotmail.com	0043 664 390 1 380
Alexander Schaber	schaberablex@web.de	0178 818 8880
Evelijn Schulte	evelijnschulte@me.com	0031 651988354
Simone Breuer	simone.breuer@gmx.net	0175 3187268
Katja Vetter	k.vetter@vetter-gvg.de	0172-29 25 289
Jonas Kriebel	kriebel.jonas@gmailcom	0151 15002828
Ortwin Nürnberger	ortwin.nuernberger@hotmail.de	0049 172 994 33 27
Nikolay Sinakevich	uhager@crystal-travel.ch	0041 79 756 26 08
Dennis Oestreich	oesch9@gmx.net	0174-5820816
Stephanie Howe - LR	amy.harris@luxuryretreats.com	
Pamela Oliver/FeWo	pammyo@btopenworld.com	0044 792 1973383
Margot Helm	margot.helm@hotmail.com	0043 6767330750
Mimi Harte - LR	heather.marshall@luxuryretreats.com	
Yoran Hensel	yoranhensel@mac.com	0031 654 221188
Emotion Sports	marie@mallorcaopen.org	0034 695 107 264
Isabella Gumpp	gumppimmobilien@t-online.de	0171 655 1218
Chris Rowe	chris.rowe@leathwaite.com	0041 7880 91764
Lukas Schmutz	l.schmutz@tksarchitekten.ch	0041 78 891 19 66
Joanna Baines	jobaines@gmail.com	0034 622 541 599
Fayza Schwegler - R	fayzaschwegler@gmail.com	0151 67224062
Gian Luca Itter	Gian-Luca.Itter@gmx.de	0171 2219 855
Edward Cheng	cngan@camperandnicholosons.com	
Dr.Dr. Alexander Marti	ctinabeier@hotmail.de	0041 79 3952721
Steffen Schnizer	steffen.schnizer@westrock-mps.com	0049 176 1150 7103
Frank Mildenberger	Frankmildenberger@mildenberger-verlag.de	0049 171-1456436
Alexander Gromer	snort1515@aol.com	0170 2326002
Marcel Sabitzer	sabi10@hotmail.de	0162 2831 531
Wajdi Abdmoulah	kontakt@wa-pm.de	0 172 883 49 27
Hans Tekeser	Sandra.Tekeser@gmx.de	0174 209 6484
Sandra Draisaitl	sandra.draisaitl@t-online.de	0177 6127283
Nina Kraus	kraus.nina@gmx.net	0172-9732532
Lauri Karp	lauri.karp@treasuryview.com	0160 979 56 822
Jonathan Wilkinson-Airbnb		00420 724127699
Dr. Keith Dunleavy - LR	mark.fitzpatrick@luxuryretreats.com	
Ondrej Duda	ondrejduda43@gmail.com	0042 19089 94914
Volker Wester	Volker.Wester@cristie.de	0049 1761 9795 715
David Alaba - LR	patrick@luxuryretreats.com	0151 22317982
Peter Möhl	peter.moehl@acara.ch	0041 79 634 70 91
Norbert Podschlapp	norpod@web.de	0171 508 9845
Dr. Ralf Müller-Hartwich	Katharina.Schubert@adentics.de	0172 567 3822
Daniel Holmgren	daniel.holmgren@maxi.ica.se	0046 705 942990
Filipe Albert - LR - R	meagan.bremner@luxuryretreats.com	0055-11976501317
Comites 1901	od@evion.at	0043 664 886 11704
Simon Strapp - LR	onlinebookings@luxuryretreats.com	001 8529 337 9950
Lars Wendelbo	lw@wendelbo.dk	0045 408 77524
H.U. Meyer	miv-jork@web.de	0 171 2467811
Randy Cohen - LR	heather.marshall@luxuryretreats.com	
Alan Deer - LR	amy.harrisluxuryretreats.com	
Martin Blochberger - LR	ibrahim.elsibai@luxuryretreats.com	
Karen Brandt	bastibrandt@gmx.net	0177 7974631
Christine Dieng	christine.dieng@t-online.de	0176-30516585
Kathryn Davies	kathryn@360privatetravel.com	00852 9223 6502
Melanie Kefalidis - LR	heather.marshall@luxuryretreats.com	001 544 7282
Jack Morrison-Betts - ER	edward@edgeretreats.com	0044 7836 357 256
Marc-Olaf Hilgenfeldt	mhilgenfeldt@gmail.com	0171 900 1236
Viola Breitkreuz	v.breitkreuz@gmx.de	0173 3464052
Stefan Buchholz	s.Buchholz@buchholz-hydraulik.de	0151 24 183 180
Günter Thesen	Guenter.Thesen@Thesen-ag.com	0172 5253544
Sune Nilsson - TB	freddie@theluxurytravelbook.com	0046 70 870 34 64
Amanda Kauer	amanda@kauer.ch	0041 79 2511182
Andrew Baker - LR	meagan.bremner@luxuryretreats.com	
Sabine Schulz	Sabine.Schulz@endlichzuhause.com	0172 4351736
Hamid Yazdtschi	h.yazdtschi@gildegruppe.com	0171 811 9540
Miriam Aloys	m.aloys@elizabeth.at	0043 664 3375287
Dr. Sven Schmidt	sven.c.schmidt@t-online.de	0178-4158193
Mathias Düsterdick	m.duesterdick@gerchgroup.com	0171 4077061
Walter Hammele	Walter.hammele@hammele-gmbh.de	0172 89 24242
Marcel Uhlemann	muhlemann@mac.com	0049 151 15772098
Soren Moller	info@textstyle.dk	
Alisa Kolb-LR	elisabeth.cook@luxuryretreats.com	
Dr. Andreas Meinecke	mail@a-meinecke.de	0178 8916180
Dr. Georg Jansen	m.angenendt@columbus-essen.de	0201 8410 10
Klara Schedl	klara@schedl.de	0163 3319513
Irina Parhuta	parhuta_irina@mail.ru	007 903 9253883
Marco Gantenbein	marciagantenbeinspam@gmail.com	00971 56 1150 800
Simon Walker - LR	Amy.harris@luxuryretreats.com	011 44 152 527 099
Matthias Klaiber	Matthias.Klaiber@fricke.de	0171 8628146
Lin Rogers	Hgniewek@LRogersElectric.com	1-404-580-7875
Juan Urrutia - LR	Amy.harris@luxuryretreats.com	0052 1 155 3901 3602
Laura von Schubert	lvschubert@gundlach.de	0171 4851584
Matthias Casanova	matthiascasanova7@gmailcom	0 170 2246913
Antonio Zaforteza Rodes	azr@portadriano.com	
Simone Breuer	simone.breuer@gmx.net	0175-3187268
Arif Inayatullah	arifinayat@yahoo.com	001 91 79132290
Dr. Altayar	salehaltayar@gmail.com	
Silvia Sell	silvia.sell@conex-gmbh.de	0176 1 89 00 603
Markus Knoflach	betmark@hotmail.de	
Paul Lang	paul.lang@gmx.ch	0041 4495 40442
Mariette Mreches-Tousssaint	mariette.toussaint@education.lu	0035 26211 49341
Ingo Nenn	I.Nenn@t-online.de	0172 300 9570
Mariette Schretter - LR	Heather.marshall@luxuryretreats.com	
Jürgen Budde	j.budde@budde.de	0171 4910022
Volker Haxel	volker.haxel@gmx.de	0171 9969863
Phillip Wiechmann	wiechmann.philipp@gmx.de	0172 4049 981
Simone Pickrahn	simone.pickrahn@googlemail.com	0177 616 7572
Fabrice Pastor	secreariat@mcinternationalsports.com	
Worthy Dye - LR	julien.leclerc@luxuryretreats.com	
Dr. Schwalbe/Altenfeld	Christina@fairytalewedding-mallorca.com	0162 408 3307
Dr. Franz Ihm	franz.ihm@tectusbrokers.com	0043 676 52 39 632
Cristina San Juan - LR	mani.chanmany@luxuryretreats.com	
Marcus Hanke	marcus.hanke@ymail.com	0044 7976749408
Dr. Kai Horstschäfer	kai.horstschaefer@t-online.de	0173 6241408
Walter Cihal	walter.cihal@main.co.at	0043 664 4323845
Arhold/Hülkenberg	simone@nico-huelkenberg.de	0177 7822705
Regina Montanhas	regina@montanhas.de	0173 205 4220
Michael Russ	info@russ-hse.de	0176 227 14309
Mario Oberdorfer	oberdorfer@hostprofis.com	0043 676 840180888
Wolfgang Baer	wolfgang.baer@handelshof.de	0171 3082807
Ann Cormack - LR	svetlana.boldor@luxuryretreats.com	
Uwe Busch	druwebusch@icloud.com	41768171926
Robert Östreicher	robert@mariamartinez.de	
Mark Eugeni - LR	Jay@luxuryretreats.com	
Francois Mairlot	F.mairlot@magegroup.com	0032 475 663013
Christiane Kamarys	c.kamarys@web.de	0151 44343776
Dr. Viktor Maier	alexmaier220889@googlemail.com	0176 84 130 963
Peter Möhl	peter.moehl@avara.ch	0041 79 634 70 91
Scott Davidson	scott@davidson.ac	0044 77 855 72 000
Christopher Lotz	christopher.lotz@ecp-company.com	0163 846 6818
Maren Greinacher	greinacher@t-online.de	0172 8345599
Jiri Jirasek	jirasek@fortunalibri.cz	00420 602 200 630
Thomas Bierfreund	thomas.bierfreund@vr-tuebingen.de	0173 88 68096
Ralf Dieter	ralf.dieter@durr.com	0170 8560630
Mikael Kramer	mk.branwen@gmail.com	0046 705396509
Rainer Bätz	rainer_baetz@t-online.de	0172 8644682
Fred Arbogast	vakanz@wizzard.space	00352 6211 96903
Johanna Herrod	cl.walker gilbert@btinternet.com	0044 79009804674
Urs Leuthold	leuthold@rfpag.ch	0041 79 661 70 69
Florian Gschwandtner - LR	mark.fitzpatrick@luxuryretreats.com	0043 6507 77019
Ralph Sven Kaufmann	sven.kaufmann@scopein.de	0172 211 8425
Matthias Maresch	matthiasmaresch@aol.com	0172 8282 164
Hanspeter Kurzmeyer	hanspeter.kurzmeyer@gmx.ch	0041 79 700 55 44
Oliver Meyer	olivermeyer@behnmeyer.com.my	60192605781
Anika Schork	schork.anika@t-online.de	0160 91758860
F.K. Wassung	maltafranzi@gmail.com	00356 999 39449
Omnicare Holding Oliver Tamimi	Oliver@tamimi.de	0171 5262 000
Christian Götze	christian.goetze@gcon.de	0170 2334117
Lars Wendelbo - LR	lw@wendelbo.dk	0045 408 77524
Fabian Bachmann - LR	bachmann.fabian@kabelmail.de	0176 22156278
Ingolf Knaup	ingknaup@aol.com	0171 68 37 468
Cornelia Eckebrecht	C.Eckebrecht@web.de	0173 6744 173
Christina Hettel	rieder-j@web.de	0157 31337642
Giuseppina Schulze	pinaschulze@hotmail.com	0152 2 9548 260
Fam. Böckmann	schild@racinereisen.ch	0041 79 250 27 84
Steffen Strauss	d.strauss@engelbert-strauss.de	0151 1951 5757
Peter Frohmüller	p.frohmueller@citrus-tel.de	0172 7858 530
Nicole Keller	nikeco@bluewin.ch	0041 79 388 3448
Torsten Fenger	torsten.fenger@fenger-gruppe.de	0174 3434 170
Petra Bärwaldt	petra.baerwaldt@t-online.de	1712265090
Nadine van Uem	nvanuem@web.de	0041 76 771 62 50
Michael Lindner	michael.lindner@mattig-lindner.de	0170 798 9020
Marina Classens	maclassens@gmail.com	0044 7747432762
Sven & Sylvia Kilian	sylvia_kilian@gmx.de	0151 41242999
Marina Classens - R	maclassens@gmail.com	0044 7747432762
Juergen Deister	jergen.deister@gmail.com	0172 578 1537
Petra Kamp	Petra.Kamp@senner-waldweg.de	0171 749 1828
Fritz Lanz	f.lanz@ubv.ch	0041 79 4014724
George Robinson - LR - R	jessica.dalporto@luxuryretreats.com	0034 664 618539
Andrew Donaldson-LR	Amy.harris@luxuryretreats.com	
Markus Hauck	lisa.heier@gmx.de	0178 7909181
Martina Bühler	Buehler.tt@t-online.de	
Paarmonie GmbH	support@paarmonie.com	0172 311 9310
Oliver Brück	oliver.brueck@firmengruppe-brueck.de	0177 7889110
Jasmina Panic	kukle23@ymail.com	0170 366 6822
Benjamin Weindel	Benjamin.Weindel@wls-group.eu	0170 777 1773
Carola Studlar Gutschein	carola.studlar@studlar.de	0171 621 81 48
Andrea Eckhart	Andrea.Eckhart@wienwork.at	0043 664-8174010
Michael Hüsken	a-m.huesken@t-online.de	15152559139
Adrian Braun	adrian.braun@cis-academy.ch	0041 793 560919
Julian Kiefer	jk@t-online.de	0176 813 90020
Racine Reisen Böckmann	marti@racinereisen.ch	0041 79 250 27 84
Pia Rebhorn	pia.rebhorn@gmx.de	
Fam. Brönnimann	cnln@bluewin.ch	
Arndt Brüning	kristina.bruening@bruening-gruppe.de	0173 2489262
Ulrich Müller-Albring	pp@confijuzed.com	0179 906 9598
Jonas Kriebel	kriebel.jonas@gmail.com	0151 15002828
Rüdiger Thul	ruedigerthul@web.de	0175 2065 290
Carola Studlar	carola.studlar@studlar.de	0171 621 81 48
Mette Jung	larshn19@gmail.com	0045 23484734
Josef Schucker	schucker.josef@web.de	0041 79 1994434
Crystal Travel	uhager@crystal-travel.ch	0041 79 756 26 08
Madline Herr	madline-herr@freenet.de	0176 8217 9227
Wilhelm Bovens	w.bovens@lueber.com	0041 79 6003 047
Marcel Schmelzer	jennifer-2502@gmx.de	0163 71 11222
Felix Mailänder	felix.mailaender@t-online.de	
Nina Kraus	kraus.nina@gmx.net	0172-9732532
Violeta Falabella	violetafalabella@hotmail.com	0056 992212222
Florentin Kesel	florentinkesel@me.com	0171 933 9865
Jochen Schneider	jochen.schneider@schalke04.de	
Michael Weis	michael.t.weis@gmail.com	
Christian Zimmermann	christian-zimmermann@mail.de	0171 4251111
Alice + Olaf Roßbach	alicerossbach@t-online.de	0171 7572372
Jan Wolff	alicia.g@web.de	
Melanie Egerer	egerer.melanie@gmx.de	
Ingolf Knaup	ingknaup@aol.com	0171 68 37 468
Gerd & Eva Rumpf	gerd.rumpf@gmx.de	0173 3838 110
Michael Morell	morellmichael@hotmail.com	0043 699 19677492
Gerhard Haunold	gerhard@translation.at	
Glen Neukomm	Gneukomm@catam.ch	0043 79 286 5619
Imke Engel	imke.engel@t-online.de	0177 337 1539
Dr. Mirko Ros	miros@swissonline.ch	0041 79 667 80 52
Coreen Scholtz	Wade.Manricks@luxuryretreats.com	
Frank Ohrem STO	tfelix@t-online.de	0221 9484717
Willi Orban	willi.thomas@hotmail.de	1627333377
Christoph Behn	christoph@better.team	0175 72 22448
Peter Möhl	peter.moehl@avara.ch	0041 79 634 70 91
Clare Hughes	hughesclare@me.com	0044 7787532032
Petra Duerig	petra.duerig@gmail.com	
Walter Hammele	Walter.hammele@hammele-gmbh.de	0172 89 24242
Mikael Kramer	mk.branwen@gmail.com	0046 705396509
Robin Kindler	r.kindler@kindler-fries.de	01573 3696402
Nicci Roessler	freddie@theluxurytravelbook.com	
Lukas Schmutz	l.schmutz@tksarchitekten.ch	0041 78 891 19 66
Lin Rogers	Hgniewek@LRogersElectric.com	001 404 580 7875
Hans-Jürgen Pick	hj.pickpick-textiles-wohnen.de	0171-7901758
Dr. Georg-Dietrich Jansen	jangv@web.de	0201 8410 10
Chuanjun Pan (Agency)LR	svetlana.boldor@luxuryretreats.com	
Mikkel Storm-Jensen	mikkelsj@yahoo.co.uk	0044 7776 245 160
Reisebüro Förster & Wolff	foerster-wolff@t-online.de	0 172 433 55 50
Dr. Adalbert Lechner	lechner.adalbert@web.de	0171 6391157
Johanna Herrod	hugh_gilbert@hotmail.com	0044 79009804674
Karen & Andreas Brandt	bastibrandt@gmx.net	0177 7974631
Klara Schedl	klara@schedl.de	0163 3319513
Markus Knoflach	betmark@hotmail.de	0041 78 621 63 69
Marco Rose	j.waigand@arena11.com	
Ellen Maier / Marc Thiel	maierellen@web.de	0172 8281188
Rebecca Duke - (Agency ) Luxury Retreats	Andriana Hnatykiw	
Tobias Meibom	meibom@copeca.de	0171 7910582
David Ioffe	davyd.ioffe@gmail.com	15777910146
Corina Gmünder	corinagmuender@bluewin.ch	0041 71 245 0313
Robert Smola	robert.smola@ge.com	0041 79 285 26 89
Elana van Sintern	elena_van_sintern@posteo.de	0177 9560176
Daniel Dutta	d.dutta@dutta.de	0179 4790324
Anna Misko	anna.misko@web.de	0170 73 99822
Marco Asensio		
Beat Weber	weber_beat@bluewin.ch	0041 7964 73636
Volker Roese	vroese@web.de	0171 800 4824
Timo Fahl	Tfahl@hfbauunternehmen.de	0170 2135365
Jürgen Schuster	juergen-schuster@schuster-automobile.de	0172 2872190
Thomas Metzger	tm@vzch.com	0041 79 638 80 00
Silvia Rexhepaj	silvia.rexhepaj@gmx.de	0152 08632487
Marcus Fleck	Fleck1@gmx.net	
Marco Gantenbein UMB 2021	daisymarco@bluewin.ch	00971 56 1150 800
Florentin Kesel	florentinkesel@me.com	0171 933 9865
Alexander Lammerting	al@kaholding.de	
Murillo Sanchez	laurama_80@hotmail.com	
Franz Ihm	franz.ihm@tectusbrokers.com	0043 676 52 39 632
Clare Huges	hughesclare@me.com	0044 7787532032
Lee McCarthy-LR	amy.harris@luxuryretreats.com	
Chrissy Appleyard	acappleyards@gmail.com	0044 7779 326360
Dr. Oliver Duys	oduys@orrick.com	0175 2270024
Elena van Sintern	elana_van_sintern@posteo.de	0177 9560176
Remo Altorfer	r.altorfer@altorfer-architekten.ch	0041 79 577 78 79
Christine Kamarys	c.kamarys@web.de	0151 44343776
Insa Stöhr	insa.stoehr@celseo.de	0170/5514966
Jens Burkhardt	jens.burkhardt@galabau-burkhardt.de	0163 415 3200
Wolfgang Bader	s.bader@novumverlag.com	0043 676/6314892
Cristina San Juan	csanjuan@me.com	
Mario Barth	mario@hauptstadt-helden.de	
Julie Jones	mark.fitzpatrick@luxuryretreats.com	
Shahram Rokni	i.mayer@mayer-frankfurt.de	0172 988 6445
Denk Pro Cycling	weichselbaumer@trustpromotion.de	0176 6689 5695
Rolf Straubinger	rolf.straubinger@googlemail.com	0172 7297829
Rainer Abenstein	felicitas.abenstein@abensteinbau.com	0171 4498046
Antonio Zaforteza	azr@portadriano.com	
Barry Hunter		
Holger Schwarz	einszweidrei@gmx.info	0176 43687992
Nadine Meurrens	meurrens@meurrens-machinery.be	0032 474-31 56 65
Jaime Carvajal	jcarvajal@arcanopartners.com	0034 699 460473
Matthias Bonczkowitz	mb@bonczkowitz.com	0151 15773020
Jörg Kasten	jk@boyden.de	0171 890 0989
Marina Hermann	marina_bullert@yahoo.de	0171 8153741
Ana Martinez - LR	Heather.Marshall@luxuryretreats.com	
Nicola Pflug	nicola.pflug@web.de	0151 14169155
Thomas P. Holderried	Thomas.Holderried@sileos.de	
Nathalie Herzog	nathalie.herzog@outlook.de	0041 79 442 14 82
Michael Wilken	mw@moebel-wilken.de	0152 08892363
Ulli Ransiek	ulli.ransiek@drahtseilwerk-tepe.de	
Markus Knöller	markus.knoeller@gmail.com	0172 6137861
Uwe Schweele	Uwe.Schweele@saco.de	172 7821158
Britta Gonnermann	brittamarc@aol.com	0170 908 5345
Ralf Eisenbrandt	ralf.eisenbrandt@gmail.com	0041 79 909 4001
Mark Foster	markfoster08@btinternet.com	77 99783330
Hinnerk Kirsch	hinnerk kirsch@me.com	0176 4829 2412
Nele van Bargen	nvb@vonbargenundpartner.de	
Frank Dinter	info@frankdinter.de	0178 169 7005
Davidmartin Julia Pöschl	Julia.Poeschl@davidundmartin.com	0160 9792 2415
Vanessa Hilgenfeldt	mhilgenfeldt@gmail.com	0171 900 1236
Chris Rowe	chris.rowe@leathwaite.com	0041 7880 91764
Carola Studlar	carola.studlar@studlar.de	0171 621 81 48
Marian Wellige	m.wellige@t-online.de	0171 8772818
Andrea Beckmann	beckmann22397@aol.com	0172 4194199
Ute Körner	UteKoerner@gmx.de	
Corinne Stutz	c_ch@bluewin.ch	
Stefan Leimgruber	stefan.leimgruber@swlegal.ch	
Christine Dieng	christine.dieng@t-online.de	0176-30516585
Isabel von Westerholt	isabelvonwesterholt@web.de	0174 340 1896
Andreas Brandt STO	bastibrandt@gmx.net	0177 7974631
Thalia Bleilevens	thalia.bleilevens@t-online.de	0177 2872960
Markus Claudius Proll	mcp@kuegele.com	0043 676 5065882
Airbnb Jana K. Seeger		01515 166 8888
Maximilian Thomiak	maximilian.thomiak@accenture.com	
Familie Behn	jennie@better.team	0175 72 22448
Karen Martina Bühler	home@buehlertina.de	0171 2727137
Mallorca Food Club	kai@mallorcafoodclub.com	0152 34233561
Edwin Weindorfer	edwin.weindorfer@emotiongroup.com	
Jara Trifkovic	j.trifkovic@hotel-dunord.de	0152 5150 1050
David Wagner	davewagner@t-online.de	0175 566 7704
Maximilian Maier	susanne.muehlhaus@gmx.de	0175 410 8003
Jana Kristin Seeger	Nicole.Eckert@fmg.media	0151 5166 8888
Andrea Eckhart	Andrea.Eckhart@wienwork.at	0043 664-8174010
Mathias Düsterdick	m.duesterdick@gerchgroup.com	
Wolff van Sintern	elena_van:sintern@posteo.de	0173 4884148
Thomas Etz	b.etz@mavis.de	0171 521 30 40
Claudia & Marc Schröder	csgummersbach@gmail.com	0171 3288410
Susanne Tamm	s.tamm@tammus.de	0179 145 0062
Holger Fassmer	holger.fassmer@fassmer.de	0172 4308420
Carlo Caldi	caldi@campo.group	0171 2060003
Peter Weckesser	peter.weckesser@gmail.com	0152 22911880
Alfred Gantner	nina.hodel@partnersgroup.com	
Petra Hecht	petra.hecht@tcare-personalservice.de	0178 240 7891
Fam. Böckmann	marti@racinereisen.ch	0041 79 250 27 84
Daniel Polster	lej78dp@gmail.com	0170 5461225
Ute Körner	utekoerner@gmx.de	0171 6819 058
Markus Kusterer	m.kusterer@nuernberger-leasing.de	0172 7184 457
Eisenbrandt UMB2021	ralf.eisenbrandt@gmail.com	0041 79 909 4001
Kouneli Media GmbH	natasa.mermer@kouneli-media.de	0172 4822 622
Nele van Bargen UMBG	nvb@vonbargenundpartner.de	0171.29 15 647
Malte Huffmann - LR	patrick@luxuryretreats.com	0049 1512 7260166
Lisa Hauck	lisa.heier@gmx.de	0178 7909181
Andrea Jüngling	andrea_juengling@hotmail.com	0172 815 5961
Jonas Kriebel	kriebel.jonas@gmail.com	0151 15002828
Jürgen Schröer	js@uwg-management.com	
Alice Eckert	alice_eckert@web.de	0176 63228943
Silvia Stubbe	stubbesilvia@gmail.com	0172 4556683
Markus Claudius Proll	mcp@kuegele.com	0043 676 5065882
Dirk Tetzlaff	Dirk.tetzlaff@gmx.de	
Madline Herr	madline-herr@freenet.de	0176 8217 9227
Marc Wille	manuela.wille@wille-beratung.de	0172 540 8422
Mette Jung	larshn19@gmail.com	0045 23484734
Carsten Spiess	carsten.spiess@gmx.net	0172-6543867
Benjamin Weindel	Benjamin.Weindel@3s-business-consulting.de	0170 777 1773
Judith Traub	judith.traub@t-online.de	0171 470 5231
Prof. Peter Löw	loew@livia-group.com	0151 58562470
Christina Cotta	loew@livia-group.com	0172-8508996
Lisa ten Hövel	l.tenhoevel@googlemail.com	0160 97308993
Matthias Mahnel	mahnel@impuls-consulting.de	
Marina Hermann	marina_bullert@yahoo.de	0171 8153741
Beate Schmidt	kontakt@beate-schmidt.de	
Kirsten Zeder	kzeder@web.de	0172 864 5724
Claudia Haxel	volker.haxel@gmx.de	0171 9969863
Nicole Mutschler	Nicolemutschler@hoehenbalance.de	0160 9472 9926
Mario Götze	raimund.broemmel@gmail.com	0034 694 403 256
Gerd & Eva Rumpf / Mail	gerd.rumpf@gmx.de	0173 3838 110
Michael Fuchs	michaelfuchs@de.pepperl-fuchs.com	0173 8835 880
Marcel Schmelzer	29@marcelschmelzer.com	0163-4452929
Emotion Sports	edwin.weindorfer@emotiongroup.com	
Ralf Schnirch	melinaschnirch@hotmail.de	1727473752
Patrick Huber - LR	kirsten@luxuryretreats.com	
Andreas Camenzind	andreascamenzind@icould.com	0036 20 4444321
Imke Engel	imke.engel@t-online.de	0177 337 1539
Dr. Mirko Ros	mirosswiss@online.ch	0041 79 667 80 52
Peter Vinnemeier	peter@vinnemeier.com	0163 2348000
Anna Pankratova	Pankratova@gmx.de	
Faye Flensboug	faye@lacelaboratory.com	
Peter Stichling	peter@stikel.com	0172 3581 201
Christine Kirste	ckirste@bluewin.ch	0041 79 2422961
Jan Miczaika	jan.miczaika@gmail.com	0173 3092 638
Thomas Kopp	thomas.kopp@icebein.com	0041 76 203 2199
Isabela Kuster - Airbnb	Isamonterrey@gmail.com	
Vanessa Hilgenfeldt	vanessa.hilgenfeldt@gmail.com	0171-9001236
Nicola Medrow-Bürk	nicola.buerk@gbp-architekten.de	
Adrian Short - ER	murray@edgeretreats.com	0041 7947354183
Paul Müller	me@phm.rocks	1754364809
Elena van Sintern	elena_van _sintern@posteo.de	0177 956 0176
Oliver Offen	coo@offengroup.de	0172 450 6605
Axel Schäfer	axelschaefer@gmx.net	0171 7451549
Susan Rohde	crohde@w-rohde.de	0172 415 4018
Familie Huber	jan-alexander.huber@bain.com	
Lukas Schmutz	l.schmutz@tksarchitekten.ch	0041 79 359 3457
Gavin Neilan - LR -	automated@airbnb.com	
Stephen Götze	stephen.goetze@gmx.de	0151 -11623038
Valerie Handal	valerie_handal@hotmail.com	
Frank Veltup	frank.veltrup@icloud.com	0160 5335 739
Lucia Ruggiere	luciaruggieri@icloud.com	0174 344 9441
Marcus Fleck	Fleck1@gmx.net	0043 69912145860
Corina Gmünder	corinagmuender@bluewin.ch	0041 71 245 0313
Lin Rogers	Hgniewek@LRogersElectric.com	001 404 580 7875
Vanessa Hilgenfeldt	vanessa .hilgenfledt@gmailcom	0171-9001236
Deniz Hebler	eveeliinaa_@hotmail.com	0034 634 303 779
Thomas Berger	tominwilen@yahoo.de	0041 79 9638232
Volker Ervens	stbervens@aol.com	0172 5260810
IceNox Jona Schürings	info@icenox.vom	0174 6848262
Jerome Bischof	andia.bischof@gmail.com	0041 7640 93071
Nico Tasch	nico.tasch@lumitech.com	436642611750
Adrian Short ER	murray@edgeretreats.com	0041 7947354183
Antonio Zaforteza	azr@portadriano.com	
Sabine Eichenauer	sabine.eichenauer@t-online.de	0173 2675890
Katrin Lehbruner	info@katrinlehbruner.de	0179 90 99 113
Ronald Zemp	Ronald.zemp@z-cap.ch	0041 79 9498546
Artur Montanhas	artur@montanhas.de	0173 205 4220
Dr. Frank Weigand	frank_t_weigand@web.de	0177 7714129
Dr. Markus Sengpiel	patricia.sengpiel@t-online	0175 4145132
Andrea Hoffmann	dresi2@gmx.de	0170 2324 831
Oliver Tamimi	kerstin@tamimi.de	0173 5626 161
Thomas Barth	Thom_barth@t-online.de	0173 9372896
Tina Häussermann	tinahaeussermann@gmx.de	0172 950 6462
Andrea Siebenmann	andrea.grozaj@gmail.com	0041 76 329 04 22
Dr. Joachim Dietrich	joachim.Dietrich@cms-hs.com	0174 3444471
Nathalie Serfaty - LR	morganep@vap-company.com	0041 76 503 22 22
Fernando Feraboli	fernando.feraboli@gmail.com	0039 3466614522
Michael Lange	langemicha@googlemail.com	0175 3185968
Celine Victor e.U.	alexander@celinevictor.com	
Christiane Ott-Baumgartl	BOC2013@web.de	
Sharam Rokni	i.mayer@mayer-frankfurt.de	0172 988 6445
Thomas Holst	tholst01@aol.com	0171-3669693
Jochen Schmidt	jochen.schmidt@jochen-schmidt-holding.eu	0175 7214960
Michael Weis	michael.t.weis@gmail.com	0151 506 33 259
Antonio Zaforteza		
Renate Schröter	renate.schroeter@icloud.com	
Tracey Hill, Edge Retreats	kevin@edgeretreats.com	0044 77 71845975
Ana Martinez - LR	kkhudson77@gmail.com	001 9137064042
Ulrike Flax	ulrike.flax@chello.at	0043 650 4012057
Vera Brunbauer	vera.brunbauer@me.com	0043 699 101 07037
Bernd Krüger	bckrueger@t-online.de	0151 4310 2366
Etta-Belinda Maschke	etta-maschke@t-online.de	0151/22350571
Helgo Henoch	helgo@henoch.net	1715161735
Mario Viazzoli	mario.viazzoli@viazzoli.net	0041 79 2096620
Bodo Stein	bodo.stein@web.de	0049 163 6363673
Oliver Welter	simsly@gmx.de	0176 81058290
Matthias Hansen	mh@creareal.de	0170 7492709
Dr. Kurt Gasser	k.gasser@gasser-partner.at	
Dipl.Ing. Achim Plate	achim.plate@t-online.de	0171 644 04 68
Ralf Eisenbrandt	janna.eisenbrandt@gmail.com	0041 79 909 4001
Pierre Droingk (Pangerl)	nicole.pangerl@gmail.com	0172 6362 658
Eduardo Fernandez - LR	Mark.Fitzpatrick@luxuryretreats.com	005255 5402 3875
Ulli Ransiek & J. Tepe	ulli.ransiek@drahtseilwerk-tepe.de	0173 299 55 37
Mark Foster	markfoster08@btinternet.com	0077 99783330
Michael Wilken	mw@moebel-wilken.de	0152 08892363
Heinz Gerteiser	heinz.gerteiser@t-online.de	0160 4990 700
Yvonne Wipperfürth	yvonnew@rfw-koeln.de	0171 404 9555
Dr. Gabriele Vallentin	gabriele@vallentin.net	0170 288 6888
Thomas Beringer	m-t-beringer@web.de	01575-197 42 49
Dr. Frank Kebekus	kebekus@kebekus-zimmermann.de	
Leonie Koch	store@maximal-outlet.de	
Dr. Patrick Weninger	patrick@dr-weninger.at	0043 69917243838
Birgit Langhammer	barbara.langhammer@langhamm.de	0049 173 3914371
Jana Kirstin Seeger	Nicole.Eckert@fmg.media	0151 5166 8888
Tobias Laube	t_laube@t-online.de	0173-2948868
Memet Diler	diler@hb1.de	
Michael Englert	michael.englert@englert-holding.de	0172 764 7630
Frank Schilling	frank.schilling-invest@gmx.de	0171 4192945
David Martin GmbH	angelika.koehle@davidundmartin.com	
Dr. Korger-Najary - LR	ian.howie@luxuryretreats.com	0171 95 23 651
Stefan Leimgruber	stefan.leimgruber@swlegal.ch	
Corinna Stutz	c_ch@bluewin.ch	
Frank Dinter	info@frankdinter.de	0178 169 7005
Günter Thesen	guenter.thesen@thesen-ag.com	0172 5253 54 4
Familie Ostermann	almeo@web.de	0151 16336595
Philipp Bock	philipp.bock@bock.vc	0171 4460789
Johannes Boventer	johannes.boventer@myebs.de	0172 2326942
Fiona Nordt	fiona.nordt@web.de	0171/869 57 82
Uwe Birk	birk@deutsche-bauwert.com	1728515201
Clinton Großhandel	g.stember@clinton.de	0174 9292 001
Jochen Schmidt Holding	jochen.schmidt@jochen-schmidt-holding.eu	0175 7214960
Michael Hüsken	a-m.huesken@t-online.de	0151 52559139
Ulrike Köhler	ulrike.koehler@web.de	0174 3400472
Stefan Brodie - ER	nicholas@edgeretreasts.com	
Wolfgang M. Braydor	braydor@braydor.de	0170 76 30 770
Dr. Monika Bayat	m.bayat@bauergroup.com	0172 108 0469
Stefan Kretzschmar	Stefankretzschmar73@googlemail.com	0171 56 666 73
Claudia Günther	claudia-guenther-ol@gmx.de	0049 152 23460690
Sven Gennermann - Airbnb	Airbnb	0176 62769527
M.-L. Knappe-Poindecker	mlkp@poindecker.at	0043 664 3552197
Monika Gräser	monikagraeser@hotmail.com	0177-7747387
Rainer Kugler	rainerkugler@gmx.de	0170 964 3670
Axel Draheim	draheim@mail.de	0160 90538 927
Jennifer Sommer	jennifer.henseler@goolgemail.com	0173 262 4849
Michael Hüsken	a-m.huesken@t-online.de	0151 52559139
Robert Roth	robert.roth@rossi-training.at	0043 699 107 211 50
Dr. Sven Schmidt	peters_daniela@hotmail.com	0177 2445 021
Birgit Lütjen	birgitluetjen@robertcspies.de	0173/2143335
Jörg L. Jordan	jj@joka.de	0172 5600604
Jochen Schmidt	jochen.schmidt@jochen-schmidt-holding.eu	0175 7214960
Jennifer Illian	jennifer.illian@yahoo.de	0157/58479620
Seven.One Marcel Hahn	Marcel.Hahn@seven.one	0175 1815 123
Olaf Nicke	olaf.nicke@gmx.de	0176-41089477
Hans-Erwin Steinke	hans-erwin.steinke@t-online.de	0171 6767000
Thomas Bechter	thomas.bechter@gmx.com	0041 79 2914272
Viola Breitkreuz	viola.breitkreuz@wetropa.de	0173 3464052
Dagmar Backes	d-backes@web.de	0172 695 7913
Diana Rinderle	diana.rinderle@gmail.com	0041 79 680 76 39
Andry & Rachel Niggli - Rekl.	rachel.niggli@niag.ch	0041 79 246 21 22
Manuel Veith	veith_manuel@hotmail.com	0043 664 9360507
Familie Richter	rb-ellerau@gmx.net	0173 243 37 41
Achim Plate	achim.plate@t-online.de	0171 644 04 68
Yvonne Lüthy-Lüscher	yvonne.luethy@bluewin.ch	0041 78 853 14 98
Jochen Schmidt	jochen.schmidt@luxury-hideaway.com	0175 7214960
Gabriel Bekdas	juwelierbektas@yahoo.de	0151 15961451
Daniel Polster	d.polster@polster-pohl.de	
Stefan Posch	office@stefanposch.com	0152 21850116
Barbara Langhammer	barbara@langhamm.de	0173 3914371
Davide Itter	davide10@gmx.net	0170 179 3138
Reiseloft - Matthias Ginter	info@reiseloft.com	0170 4628375
Andreas Luthe	melissameyer94@hotmail.de	0176 70979839
Julia Kreutner	juliakreutner@gmx.de	0175 2471793
Oliver Scharnweber	Oliver.Scharnweber@gmail.com	
Carola Studlar	carola.studlar@studlar.de	0171 621 8148
Jonas Kriebel	kriebel.jonas@gmail.com	0151 15002828
Torben Kühl	kuehl@sager-deus.de	0170 831 6645
Bernd Becker	berndbecker@gmx.de	0151 425 11 884
Felix Schmid	felix.schmid0@icloud.com	0160 93274344
Lisa ten Hövel	l.tenhoevel@googlemail.com	0160 9730 8993
Clinton GmbH	g.stember@clinton.de	0174 9292 001
Birgit Lütjen	birgitluetjen@robertcspies.de	0173 2143335
Andreas Schulig	andreas.schulig@gmail.com	
Birgitt Westendorf	westendorfbirgitt@gmail.com	41791248634
Dagmar Mahnel	mahnel@impuls-consulting.de	0171 4558280
Caroline Gebhardt-Zimmer	caro_zimmer@hotmail.de	0160 9494 8235
Ulrich Doppertin	ulrich@doppertin.de	0172-1737513
Valnetine Aseyo - LR	fred.bouari@airbnb.com	
Gregor Käser	g.kaeser@kfd-steuerberater.de	0172/7869185
Raymond Huggenberger	rhuggenberger@icloud.com	0180 5705 9661
Marcus Freitag	marcus.freitag@nexti.de	0160 1914820
Carina Holzherr	holzherr@gmx.net	0170 9335180
Verena Schenkel	verena_schenkel@hotmail.com	0178 686 7925
Edeltraud Wiedemann	edeltraud.wiedemann@gmx.de	0172 6325 533
Alina Flötotto	Alina@labelkitchen.de	0152 29861315
Daniel Schwartz	daniel.schwartz@whitecase.com	0049 172 1727266
Elisabeth Schenkel	schenkel@netcologne.de	
Benz Rohrreinigung / A. Benz	a.benz@benz-rohrreinigung.de	0151 / 12114168
Viola Breitkreuz	viola.breitkreuz@wetropa.de	0173 3464052
Doris Mayr	doris.mayr@med-uni-muenchen.de	0172 4985009
Christiane Kuestermann	christiane@kuestermann.one	
Marcela Lüllig	marcela.pesek@gmx.de	
Romano Schmid	theisslceline@gmail.com	
Lutz Meichsner	l.meichsner@muetra.de	0171 6735555
Patrick Vialle (LR)	ian.howie@luxuryretreats.com	
Bernd M. Sommer Speissegger	Bsommer@sommer.com.mx	0052 55 4141 1775
Jochen Schmidt Holding AG	jochen.schmidt@jochen-schmidt-holding.eu	0175 721 4960
Johan Helbling - R.	h.helbling@firep.international	0041 79 237 5671
Meike Bayer	elkemeretz@yahoo.de	0151 51195015
Katarina Brywe	katarina.brywe@carlakliniken.se	0046 707721650
Karl Reiker	karl.reiker@gmx.de	
Jennifer Powers	jennifer.powers@redbull.com	0043 664 7510 2628
Niclas Über Airbnb	Airbnb	
Silvia Sell	silvia.sell@conex-gmbh.de	01761 89 00 603
Rosy Wave GmbH	manuela.reif@reifb.de	0049 1704747818
Katarina Wurpes	lkwurpes@gmail.com	
Susanne Schröter	sdschroetergmail.com	0152 23297408
Ditte Lagoni	ditte.lagoni@gmail.com	
Thomas Koch	thomaskoch.ag@googlemail.com	
Ferd. Pieroth	ralf.klefisch@gmx.de	0043 6648325609
Sven Plüddemann	splueddemann@gmx.de	0172 4075 304
Said Lachgar / Airbnb	said@hbs-dubai.com	00971 52 244 4467
Christiane Kamarys	c.kamarys@web.de	0151-44343776
Nicole Inselkammer	n.inselkammer@inka-holding.de	
Anja Fromm	anja.fromm@t-online.de	0173 4087205
Uwe Schilling	schilling-greifswald@gmx.de	0170 484 2508
Peggy Schuster	peggy.schuster@handyfuchs.de	0173 1626600
Chris Rowe	chris.rowe@leathwaite.com	0041 7880 917 64
Jörg Pankla	joerg.pankla@gmail.com	0171 2770055
Sven Feldhusen - FeWo	Fewo # HA-JYVQDF	
Frank Veltrup	Frank.veltrup@icloud.com	0160-5335739
Timo Fahl	Tfahl@hfbauunternehmen.de	0170 2135365
Lena Schwickert	Lflerlage@delphin-apotheke.biz	0179 5398461
Robert Janik	r.janik@janik-invest.de	0176 15 246 233
Dr. Ina Ziegert	ina.ziegert@googlemail.com	0172 7925287
Jochen Deecke	jochen.deecke@dfs-ag.de	
Fam. Ostermann	n.ostermann@ostermann-gruppe.de	0151-16336595
Familie Altenfeld-Schwalbe	dr.schalbe@gmail.com	170-4580700
Thomas Wetterling	Ilkawetterling@yahoo.de	0172 644 4003
Eva Opländer	eva@oplaender.net	0160 966 00119
Dr. Stephen Götze	stephen.goetze@gmx.de	0151 11623038
Jerome Bischof	jerome.bischof@gmail.com	0041 7640 93071
Jasmina Baur-Rossi	jasmina_rossi@hotmail.com	0041 765763605
Matthias Moser	mh.moser@me.com	0171 7160280
Sandra Thomas	sandra.thomas2008@freenet.de	0176 2496 8363
Dr. Ulrich Brauer	uhbrauer@web.de	0151 46756410
Dawn Wilson	wilson_d27@sky.com	0044 7535883935
Christiane Brock	christiane@grahlke.de	15112535142
Ilse Wagner	ilse.wagner@joachim-wagner.net	0172 4315042
Michael Lange	langemicha@googlemail.com	0175 31 85968
Peter Dietz	Peter.dietz@barth-galvalnik.de	0175 4304301
Leopold Amon	l.amon@gmx..at	0043 6766417277
Andrew Lynas	andrew.lynas@lynasfoodservice.com	044 7881816718
Francis Zoller	francis@prakriti.ch	0041 79 388 80 74
Jochen Schmidt Holding	jochen.schmidt@luxury-hideaway.com	0175 721 4960
Marco Aberle	marco-aberle@gmx.de	0171 / 6994841
Gesa Clausen-Hansen	gesa.clausen-hansen@gmx.de	0176 61106169
Vanessa Hilgenfeldt	vanessa.hilgenfeldt@gmail.com	0171-9001236
Carsten Endter	ce@endter.eu	0151 50 40 26 17
Christian Marchsreiter	christian@smashdocs.net	
Mariette Mreches-Toussaint	mariette.toussaint@education.lu	00352 621 149 341
Regina Montanhas	regina@montanhas.de	0173 205 4220
Arthur Kasnitz	anita.kasnitz@arcor.de	0160 366 4830
Melanie Bauer	bauer_melanie@hotmail.de	0171 7304320
Kathleen Söder	kathleen.soeder@yahoo.de	0171 9942006
Dr. Frederic Ziebarth	donata.ziebarth@googlemail.com	
Karsten Kölsch	karsten@karstenkoelsch.de	0160 5873 242
Torsten Denk	t.denk@denkservice.com	0151 5090 1899
Matthias Maresch	mm@tfm-Wohnbau.de	0172 8282 164
Axel Salzmann/Spiewak	oliver.spiewak@gmx.de	049 176 61 67 68 87
OSF Digital G. Cueto	gabriel.cueto@osf.digital	0175 75 22 224
Luxury Hideaway Marco		
Barbara Monaco	monaco.ab@bluewin.ch	0041 7943 13161
Gioia Pelzer	gioia.thun@gmx.net	0172 8412 444
Cara & Benedikt Brumberg	carabrumberg@web.de	0049 175 444 8677
Friedhelm Henning	s.henning@henning-pferdetransporter.de	0172 7038805
MY Human Capital	florian.boss@my-humancapital.de	0176-30702642
Matthias Mahnel	mahnel@impuls-consulting.de	0171 4558280
Thomas Beringer	m-t-beringer@web.de	01575-197 42 49
Susanne Tamm	tamm.susi@googlemail.com	0049 179 145 0062
Carolin Hachenberg	mail@carolin-hachenberg.de	0175 18 68 164
Master Immobilien/Marie Klemm	m.klemm@master.de	0151 28 07 69 16
Ralf Eisenbrandt - Rekl.	janna.eisenbrandt@gmail.com	0041 79 909 4001
Dr. Duhr	Nadine.Duhr@gmail.com	0172-6065493
Nadine Ostermann	n.ostermann@ostermann-gruppe.de	0151-16336595
Clinton GmbH	g.stember@clinton.de	
Michael Profanowicz	info@reise-dorenkamp.de	
Hannah Pongratz	hannah.pongratz@mail.de	0170 6500 408
Simone Büsing	simoneb@hispeed.ch	0041 794005363
Marcel Meinhardt	meinhardt@bluewin.ch	0041 794555707
Thomas Schinecker	thomas.schinecker@roche.com	0041 796282047
Claudia Meyer	claudia_meyer1@freenet.de	
Claudia Günther	claudia-guenther-ol@gmx.de	
Luxus Urlaub Holding	jochen.schmidt@luxury-hideaway.com	0175 721 4960
Michael Hermes	michael.hermes@gmx.com	0172 4528640
Markus Hauck	hauck.markus@gmail.com	0151 1261 3558
M.L. Knappe-Pointdecker	mlkp@pointdecker.at	0043 664 355 2197
Petra Schwärzler	ps@toechterle.net	0043 664 2357 118
Familie Braydor	braydor@braydor.de	
Dr. Siamak Hadifar	sia.hadifar@gmx.de	0171 41 55 913
Frank Högel	f.hoegel@gmx.de	0174-2062678
Susanne Tamm	s.tamm@tammus.de	0179-1450062
James West	james.west@cruxproductdesign.com	0044 787 969 2527
Lothar Klick	lrwklick@web.de	0175 2290555
Ulla Klopp	ullasandrock@web.de	
Ralf Neumaier	r.neumaier@np-real-estate.de	1702382999
Mareike und Christop Meurer	mareikesiemer@gmx.de	1629696070
Alice Eckert	alice_eckert@web.de	0176 6322 8943
Michael Hüsken	a-m.huesken@t-online.de	0151 52559139
Dr. Philipp Feldmann - LH	nicole.freund@ibero.com	1772572061
Familie Schertler	schertler@bluewin.ch	
Birgit Lütjen	birgitluetjen@robertcspies.de	01732143335
Dr. Marion Runnebaum -Rekl. Baustelle	marionrunnebaum@me.com	
Dr. Anna Plössner	anna_ploessner@me.com	
Dr. Svend Buhl	svendbuhl@web.de	15146259943
Jonathan Wilkinson	jwilkinson@discovery-group.cz	0042 602431348
Karl Steiner	karl.steiner@sks-laupen.ch	
Vanessa Gstrein	vanessagstrein@outlook.com	0049664 124 33 28
Rico Gugolz	r.gugolz@bluewin.ch	41796087213
Meike Bayer	meikebayer@mail.de	01515 1195015
Marianne Hitz/ Dentago AG	m.hitz@dentago.ch	00 41 79 352 37 38
Franz Willam	willam.franz@gmail.com	0151 5685 5649
Sven J. Köllmann	Sven.koellmann@fibona.de	1736669413
Nicole Gehrig	nicole_gehrig@gmx.ch	0041 789206967
Luxus Urlaub Holding GmbH	jochen.schmidt@luxury-hideaway.com	
Andreas Stauss - Storno!	andreas.stauss@stauss-immobilien.de	0172 7611116
Dirk Polick	sabine@polick.de	
Clinton GmbH	g.stember@clinton.de	0049 174 929 2001
Birgit Lütjen	birgitluetjen@robertcspies.de	0173 214 3335
Stefan Raab	stefan.raab1@freenet.de	0175 980 6241
Craig Brown	craigbrown_90@outlook.com	
Silke Grumbach-Flik	silke.flik@t-online.de	1702912785
Dr. Kathrin Köhler	kathrinkoehler@web.de	0049 173 632 49 59
Dr. Christian Fitz	chfitz@dr-fitz.de	0049 173 379 3292
Rolf Klutinius	klutinius@gmx.de	0173 546 4004
Nicola Twesten	nicola-twesten@t-online.de	0172-401 53 15
Nina Kraus	kraus.nina@gmx.net	0172-9732532
Ingolf Knaup	ingknaup@aol.com	0171 683 7468
Denk Pro Cycling	theresa_weichselbaumer2000@yahoo.de	0176 6689 5695
Petra Stich	har_har_har@t-online.de	491605385051
Familie Schroll-Friedl	schrollfriedl@gmail.com	
Christian Knoop	christianknoop@gmx.de	0178 8633 987
Conchi Weber	conchi.weber@t-online.de	0172 690 9990
Heinz Gerteiser	heinz.gerteiser@t-online.de	160 4990 700
Rainer Kassen / Schell	meike.schell1@gmail.com	0049 176 327 69 807
Arne Thomas	sandra.thomas@rtl.de	0179 110 2942
Otwin Traussnigg	Otraussnigg@gmx.de	01511 12 45 555
Matthew Hay	matthew.hay91@gmail.com	0044 7811279759
Dr. Nicole Mecklinger	nicole.mecklinger@web.de	0172 5211882
Katja Hamann	katja.hamann@allianz.de	0151 50443728
Henry Grätz	henry.graetz@gmx.de	0178 - 5057007
Nina Becker	ninifee2011@hotmail.com	0172 1348802
Fatos Ismajli	faots-ismajli@hotmail.com	0043 6641690466
Viola Breitkreuz	viola.breitkreuz@wetropa.de	0049 173 346 4052
Karin Pohlmann	kp270559@googlemail.com	01722414861
Jan Koch	jan.koch9@icloud.com	
Laura von Schubert	laura.vonschubert@gundlach.de	0171 485 1584
Barefoot Reisen GmbH	romina@barefoorreisen.de	
Fabian Gamsjäger	fabian.gamsjaeger@gmx.net	0043 660 3811176
Jana Eggerding-Tenhagen	jana.eggerding@dkv-mobility.com	0171 19 15 355
Sascha Vaassen	sv@vaassen.de	0151 588 84950
Rene Meyer	renelouismeyer@bluemail.ch	0041 79 209 41 77
Alexander Boldyreff	aboldyreff@me.com	0172 4569434
Timo Fahl	TFahl@hfbauunternehmen.de	0170 2135 365
Vicky Kolzen	vicky@kolzen.de	1732106001
Josefine Hübert	fine4886@web.de	1795808665
Alexandra Kast	alexandra@styledhome.ch	
Mike Baur	mike.baur@swissventures.group	
Anja Heiner	anja.heiner@gmx.de	0178 - 3456139
Ms. Courtney Kuzmanich - TB	gabriel@theluxurytravelbook.com	
Beat Weber	weber_beat@bluewin.ch	
Andreas Czayka	andreas.czayka@t-online.de	0171 687 37 24
Bothe Vermögensverwaltung	j.a.bothe@gmail.com	
Frank Kocher	frank.kocher@kocherregalbau.de	0151 4670 2086
Morten Ebbesen	morten@ebbesen.dk	
RZ Capital Ronald Zemp	ronald.zemp@rz-capital.com	0041 79 494 8546
Mona Motaghi	mm@fc-moto.de	1713345273
Wolfgang Braydor	braydor@braydor.de	
Jürgen Stolz	info@cafe-stolz.de	0175 5246 029
Sven Plüddemann	splueddemann@gmx.de	0172 4075 304
Karsten Meier	beateundkarsten@t-online.de	0151 568 55 649
Lomboki SL/Adriana Ojeda	ivanromero@asiagardens.es	0034 607 994 953
Nishil Patel - ER	atarra@edgeretreats.com	
Andre Pilss	elencorose@hotmail.com	0151 2060 5973
Michael Nicolai	nicolai@blup.de	0172 535 4299
Alexander Cron	a.cron@cron-consulting.com	0171 4931 321
Anna Vey	annavey34@gmail.com	0178 8670 816
Volker Roese	vroese@web.de	0171 800 4824
Simon Gillie	simon@spglimited.com	0044 7977055122
Frank Schilling	frank.schilling-invest@gmx.de	0151 234 32375
Anton Neu	anton.neu@arcor.de	0179 133 6636
Martin+Melanie Bauer	bauer_melanie@hotmail.de	0171 7304320
Alexander Rüsch	alexruesch88@gmail.com	1624528276
Karen Harwood	karen.v.harwood@gmail.com	0044 7725 601 573
Marian Arnold	marian.arnold@web.de	15129124582
Michael Weis	michael.t.weis@gmail.com	17643992723
Prof. Dr. Hugo Kitzinger	hugo@kitzinger.de	-8124957
Sharam Rokni	rokni@systrade.de	
Verena Bammert	ruba.privat@bluewin.ch	41 79 406 29 05
Suzana Bernhard	suzana.bernhard@dekra.com	0170 4867650
Remo Altorfer	r.altorfer@altorfer-architekten.ch	41 79 577 78 79
Michael Wilken	mw@wilken.tv	0152 08892363
Evenyne Siedle-Bank	esb@biv-freiburg.de	0172 8154343
Mike Wlach	familiewlach@gmail.com	0172 73 60 73 8
Excellentair/ Mike Wlach	marco.ferstl@excellentair.de	08331 756 93 6-0
Wilhelm Classen	vclassen@mobau-wirtz-classen.de	0151 10866210
Uwe Krauter	Uwe.Krauter@gmx.de	0173 3420625
Mathhias Krieg (Bruder)	geschaeftsleitung@krieg.de	
Britta Gonnermann	brittamarc@aol.com	0170 908 5345
Susanne Tamm	s.tamm@tammus.de	0179-1450062
Erika Chavez	erika.chavez1215@gmail.com	001 206 240 1594
Richard Orthmann	finn.orthmann@orthmann.ch	
Edith + Andy Vögtli	andy.vögtli@vögtli.ch	
Augen Arzt Klinik Heidelberg	braun@augenpraxisklinik.com	0178 6379 171
Dirk Lütje	Dirk.luetje@gmx.de	0171/ 3372421
Florian Gramann	florian.gramann@gramann-ahrberg.de	
Jeff Pollitt	alz707@me.com	
Nicole Kesselkaul	Nicole.Kesselkaul@creditweb.de	0172 99 55 133
Britta Nolte	brittanolte@aol.com	0172 9064055
Eva Opländer	eva@opländer.net	0160 966 00119
Sina Schwarz	sinaschwarz93@gmx.de	17670809847
Katharina Heß	k.hess@hess-montagen.de	0152 22 11 82 62
Jochen Schmidt Operations GmbH	jochen.schmidt@luxury-hideaway.com	
Richard Wissmeyer	rw@iventuregroup.com	0173 900 1000
Kristin Allerding	kristin.allerding@gmx.de	0177 821 1166
Jasmine Fedunik-Mayer	j.fedunikmayer@gmail.com	
Luisa Jürgens	luisa_juergens@outlook.com	1749147371
Volker Twes	info@olgawiebe.de	0170 3898900
Andrea Niedenhof	an@andrea-niedenhof.de	0172 3798067
Uwe Danziger	uwe.danziger@web.de	0173 6688 488
Sarah Thamm Verlängerung	sarah@familie-thamm.net	0162 4636630
Jürgen Knubben	info@juergenknubben.de	0170-2237040
Dr. Agnetha Pindur	agnetha.pindur@googlemail.com	0179 5089541
Sarah Thamm	sarah@familie-thamm.net	0162 4636630
Eugenio Mazorati	federica@marzorati.ch	
Lx TM GmbH	MC@Luxcara.com	0176 7016 2005
Florian Sterzing	sterzing@st-sued.de	0170 3246840
Sandra Bärthel	sandra.baerthel@web.de	01511 4630578
Christoph Baum	drbaum@t-online.de	0172 9188388
Dr. Tino Müller	dr.tino.mueller@gmx.de	0171 8330688
Daniela Westphälinger	dani.westphaelinger@icloud.com	0178 8215499
Petra Wick-Ruhs	info@petra-wick-immobilienservice.de	0171 41255520
Dr. Marion Runnebaum	marionrunnebaum@me.com	1713833142
Richard Wissmeyer	rw@iventuregroup.com	
Katrin Bornberg	katrin.bornberg@franke-bornberg.de	0173-2159701
Petra Hegmann	petra.hegmann@gmx.de	0151-65221346
Rebecca Julia Koch	j.koch@kleist-versicherungsmakler.de	0151-12069912
Modehaus Hämmerle	elisabeth.guggi@haemmerle-mode.at	
Torsten Denk	t.denk@denkservice.com	0151 50901899
Mareike Berghorn	mareike@mberghorn.de	
Mareike Berghorn Verl.	mareike@mberghorn.de	
Rossi Roth	robert.roth@rossi-training.at	0043 699 10721150
Familie Hüsken	sissu-2003@web.de	0151 52559139
Alice Eckert	alice_eckert@web.de	0176 6322 8943
Thomas Schneidawind	thomas@schneidawind.net	
Sandra Eberlein	sandra.eberlein@t-online.de	
Ralf Neumaier	ralf.neumaier@prinzbach.com	1702382999
Joachim Gerdes	jdg@gerdes-privat.de	
Dr. Agneta Pindur	agnetha.pindur@googlemail.com	0179 5089541
Veronica Rath	v-rath@t-online.de	
Kathrin Grötsch	r.groetsch@outlook.com	
Anne Schulz-Gühlstorff	anne.schulz-guehlstorff@argo.work	0162 297 88 34
Klaus Peter Schneidewind	kpschneidewind@t-online.de	
Dirk Lütje	dirk.luetje@gmx.de	0171 3372421
Edwin Slutter	Edwinslutter@gmail.com	
Markus Brand	markus.brand@brand-automobile.ch	0041 793415407
Markus Brand - Verlängerung	markus.brand@brand-automobile.ch	0041 793415407
Jochen Langhammer	jochen@langhamm.de	0173-391 43 71
Heinz Ernst	heinz.ernst@epost.ch	
Marko Kreuzberg	ksp-nachrichten@mail.de	1623666794
Karin Griesemer	kagriesemer@hotmail.com	0041 797346756
Udo Simons	udo.simons@sieksmeier.de	0178/2525001
Volker Dröder	avdroeder@t-online.de	
Donata Ziebarth	donata.ziebarth@gmail.com	49176-63134800
Niklas Schmidt	paulaandert@t-online.de	
George Scholey-FEWO	mini_scholey@hotmail.com	
Dilaria Strampfer	dilara.strampfer@gmx.de	
Ian Carnall - ER	michelle@edgeretreats.com	
Felix Mailänder	felix-mailaender@t-online.de	
David Baker	david.baker@prem-realestate.com	0172 6936886
Mirco Hager	miri.hager@hispeed.ch	
Carolin Rummenigge	carolinrummenigge@googlemail.com	49 172 8936125
Jochen Schmidt	jochen.schmidt@luxury-hideaway.com	
Svenja Kromer	svenja.kromer@gmx.com	
Robert Unternährer	robert.unternaehrer@bluewin.ch	
Janine v. Czapiewski	janienevonczapiewski@gmx.de	
Bianca Rahnenführer	bianca1012@hotmail.de	0177 2119735
Isabella Mörixbauer	i.moerixbauer@gmx.at	
Rusch/Dornseiff	hendrik.rusch@gmx.de	
Lisa Buitelaar Airbnb	airbnb	
Jonas Vogel	jonasvo@gmx.de	
Reisebüro Förster&Wolff/Reetz	info@foersterwolff.de	04105-635550
Markus Egerer	Egerer.melanie@gmx.de	
Haas/Philip über Reisebüro	wagner@reiselaedle-hofen.de	0174-3960627
Sascha Kammer	saschakammer@gmx.de	754350076
Astrid Wloka	astrid.wloka@t-online.de	0175 2721220
Kay Schubert	kayschubert@hotmail.de	1735802472
Niklas Brywe	niklas.brywe@hjartmott.se	0046 704 245957
Alexander Schmitz	Alexander.Schmitz@Bain.com	
Stefan Wagner	stefan.wagner@handyfuchs.de	
Dr. Stephen Götze	stephen.goetze@gmx.de	0049-151-11623038
Prof.Dr. Michael Nelles	Michael.Nelles@conpair.de	
Ralph Schnitzler	alph@webcity3000.de	
Övün Sever	oevuen@t-online.de	1714184554
Daniel Babic	Babic@sfp.ch	
Markus Fleck	fleck1@gmx.net	
Alice Düsterdick	aduesterdick@gmail.com	0171/4077061
Danja Wieczorek	danja_wieczorek@gmx.de	17623319270
Narges Ellrich	n.ellrich@hotmail.com	
David Hill	dhill@wickenham.co.uk	
Holger Höfler	holgerhoefler@gmail.com	
Mag. Birgit Wimmer	bkollment@novoinvest.at	
Corinna Koch	corinnalaura.koch@gmail.com	0160 96006930
Vanessa Hilgenfeldt	vanessa.hilgenfeldt@gmail.com	
Kevin Peter	k.peter@laminatdepot.de	0173 4282091
Sven Geertz	s.geertz@hbi-immo-gmbh.de	
Andrea Saxer	saxer_andrea@bluewin.ch	41 792517788
Muriel Dogwiler	muriel.dogwiler@hispeed.ch	004176 394 11 18
Hans-Dieter Pötsch	angela.engelke@volkswagen.de	
Jo Evans Airbnb		
Anton Neu	anton.neu@arcor,de	
Luxus Urlaub Holding	jochen.schmidt@luxury-hideaway.com	
Michael Bleilevens	m.erdbeerkulturen@gmx.de	
Luc Holtz/Sandy Neu	holtzluc20@yahoo.fr	
Malte Nemitz	malte@nemitz.sh	0179-9757477
Tobias Böttcher	t.boettcher@logicpile.de	0175 / 566 444 1
Altenfeld-Schwalbe	dorlemarella@web.de	
Jan Scheffel	jan.scheffel@gmail.com	
Philip Wenk-Weinas	p.wenk05@gmx.de	1718833870
Andrew Green	ajdgreen@googlemail.com	
Tobias Schumacher	Tobias.Schumacher@de.ey.com	160 939 15860
Marco Cestone	marcocestone@aol.de	0049 171 8105100
Katja Witte	k.golze@gmx.de	0162 10 40 258
Carolin Jentzsch	cj@twmedia.at	
Klaus Damm	Kldamm@unitybox.de	
Dr. Tim Schlun	tim.schlun@se-legal.de	0049-160-97226721
Angela Freese	bretschie@mac.com	0151 241 241 05
Jasmin Fedunik-Mayer	j.fedunikmayer@gmail.com	
Ulrich Lingner	ulrich.lingner@t-online.de	
Denise Schindler	denise.schindler88@gmail.com	0170 3261777
Edith Barth Bajon	ebb-schmuck@live.de	0173 546 6006
Patrick Ruschek	ruschek1993@web.de	15142103297
Horst Nelles	horst-nelles@t-online.de	
Familie Pickrahn	simone.pickrahn@googlemail.com	0177/6167572
Fam. Geselle	petra.geselle@t-online.de	
Malte Weber	weber@presse-partner-koeln.de	
Henrike Wunder	Wunder.henrike@gmail.com	0176 629 66676
Lothar Klick	lrwklick@web.de	1752290555
Antje Wisotzky	wisotky@hsppartner.de	
Jana Schrickel	schrickel-jana@hotmail.de	
Bernd Bosch	bbosch@engbers.de	
M.L- Knappe Pointdecker	mlkp@poindecker.at	
Caroline Burkhart	caroline.burkhart@gmail.com`;

async function importCustomers() {
  console.log('Parsing customer data...');
  
  const lines = rawCustomers.split('\n').filter(line => line.trim());
  const customers = [];
  
  for (const line of lines) {
    const parts = line.split('\t');
    const name = parts[0]?.trim() || '';
    const email = parts[1]?.trim() || '';
    const phone = parts[2]?.trim() || '';
    
    if (name) {
      customers.push({ name, email, phone });
    }
  }
  
  console.log(`Found ${customers.length} customers to import`);
  
  // Insert in batches of 50
  const batchSize = 50;
  let imported = 0;
  
  for (let i = 0; i < customers.length; i += batchSize) {
    const batch = customers.slice(i, i + batchSize);
    
    for (const customer of batch) {
      try {
        await sql`
          INSERT INTO customers (name, email, phone, source)
          VALUES (${customer.name}, ${customer.email || null}, ${customer.phone || null}, 'import')
          ON CONFLICT DO NOTHING
        `;
        imported++;
      } catch (err) {
        console.error(`Error importing ${customer.name}:`, err.message);
      }
    }
    
    console.log(`Imported ${Math.min(i + batchSize, customers.length)} / ${customers.length} customers...`);
  }
  
  console.log(`✅ Successfully imported ${imported} customers!`);
}

importCustomers().catch(console.error);
