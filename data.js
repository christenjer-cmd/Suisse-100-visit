/* Suisse 100 — données (lieux, saisons, mots-clés). Chargé avant app.js. */
"use strict";

/* ================= données ================= */
const CATS = {
  vil:["🏘️","Villages & vieilles villes"],
  tra:["🚂","Trains & cars postaux"],
  som:["⛰️","Sommets & panoramas"],
  eau:["💧","Lacs, gorges & bains"],
  ran:["🥾","Randonnées"],
  fet:["🎭","Fêtes & traditions"],
  gas:["🧀","Gastronomie"],
  cul:["🏛️","Culture & musées"],
  ins:["🎢","Insolite"]
};
const REGS = { al:"Alémanique", gr:"Grisons", ti:"Tessin", ro:"Romandie", ch:"Partout" };
const GA = { inc:["AG ✓","ga-inc"], red:["AG ½","ga-red"], pay:["hors AG","ga-pay"] };

const ITEMS = [
/* --- Villages & vieilles villes --- */
{i:1,c:"vil",r:"al",k:"AI",t:"Appenzell",p:"Appenzell",g:"inc",x:[47.331,9.409],d:"Façades peintes et place de la Landsgemeinde, où l’on vote encore à main levée."},
{i:2,c:"vil",r:"al",k:"SH",t:"Stein am Rhein",p:"Stein am Rhein",g:"inc",x:[47.659,8.860],d:"La petite ville médiévale la mieux conservée du pays, façades à fresques."},
{i:3,c:"vil",r:"al",k:"SG",t:"Werdenberg",p:"Buchs SG",g:"inc",x:[47.170,9.459],d:"La plus petite ville de Suisse : une ruelle de maisons en bois du XIIIe et un château."},
{i:4,c:"vil",r:"gr",k:"GR",t:"Guarda",p:"Basse-Engadine",g:"inc",x:[46.772,10.147],d:"Sgraffites engadinois et décor du conte Schellen-Ursli."},
{i:5,c:"vil",r:"gr",k:"GR",t:"Soglio",p:"Val Bregaglia",g:"inc",x:[46.341,9.538],d:"Balcon du Bregaglia, « seuil du paradis » selon le peintre Segantini. Car postal."},
{i:6,c:"vil",r:"gr",k:"GR",t:"Poschiavo",p:"Val Poschiavo",g:"inc",x:[46.323,10.058],d:"Palazzi à l’italienne au bout de la ligne de la Bernina."},
{i:7,c:"vil",r:"ti",k:"TI",t:"Bosco Gurin",p:"Vallemaggia",g:"inc",x:[46.317,8.494],d:"Le village walser germanophone perché du Tessin (1506 m)."},
{i:8,c:"vil",r:"ti",k:"TI",t:"Corippo",p:"Val Verzasca",g:"inc",x:[46.226,8.842],d:"Hameau de pierre, longtemps la plus petite commune de Suisse."},
{i:9,c:"vil",r:"al",k:"VS",t:"Ernen",p:"Vallée de Conches",g:"inc",x:[46.399,8.145],d:"« Village de la musique » du Haut-Valais, place aux maisons brunies par le soleil."},
{i:10,c:"vil",r:"gr",k:"GR",t:"Coire",p:"Chur",g:"inc",x:[46.849,9.533],d:"La plus vieille ville de Suisse — 5000 ans d’histoire au pied des vignes."},
{i:11,c:"vil",r:"al",k:"SO",t:"Soleure",p:"Solothurn",g:"inc",x:[47.208,7.537],d:"La plus belle ville baroque du pays, obsédée par le chiffre 11."},
{i:12,c:"vil",r:"al",k:"ZG",t:"Zoug",p:"Zug",g:"inc",x:[47.166,8.516],d:"Vieille ville au bord de l’eau et couchers de soleil réputés les plus beaux de Suisse."},
{i:13,c:"vil",r:"ro",k:"FR",t:"Morat / Murten",p:"Morat",g:"inc",x:[46.928,7.117],d:"Remparts couverts praticables, ville bilingue posée sur le Röstigraben."},
{i:14,c:"vil",r:"ro",k:"JU",t:"St-Ursanne",p:"Clos du Doubs",g:"inc",x:[47.365,7.155],d:"Cité médiévale endormie au bord du Doubs, entre trois portes et un pont de pierre."},
{i:134,c:"vil",r:"al",k:"GL",t:"Braunwald",p:"Glarnerland",g:"red",x:[46.939,8.999],d:"Terrasse sans voitures au-dessus du Linthal, funiculaire rouge et silence."},
{i:135,c:"vil",r:"ro",k:"FR",t:"Gruyères",p:"Gruyères",g:"inc",x:[46.583,7.083],d:"La cité comtale, son château, la double crème — et le musée Giger pour le contraste."},
{i:136,c:"vil",r:"ro",k:"VS",t:"Grimentz",p:"Val d’Anniviers",g:"inc",x:[46.179,7.574],d:"Chalets noircis croulant sous les géraniums, au fond de l’Anniviers."},
{i:137,c:"vil",r:"gr",k:"GR",t:"Splügen",p:"Rheinwald",g:"inc",x:[46.550,9.322],d:"Village-étape historique des cols, maisons walser et palais de muletiers."},
{i:138,c:"vil",r:"ro",k:"VD",t:"Romainmôtier",p:"Vallon du Nozon",g:"inc",x:[46.693,6.460],d:"La plus ancienne abbatiale romane de Suisse, dans un vallon hors du temps."},

/* --- Trains & cars postaux --- */
{i:15,c:"tra",r:"gr",k:"GR",t:"Ligne de la Bernina",p:"St. Moritz → Tirano",g:"inc",x:[46.410,10.022],d:"UNESCO : 2253 m franchis sans crémaillère. Pause obligatoire à Alp Grüm. Le train régional suffit."},
{i:16,c:"tra",r:"gr",k:"GR",t:"Ligne de l’Albula",p:"Coire → St. Moritz",g:"inc",x:[46.681,9.676],d:"UNESCO : viaduc de Landwasser et tunnels hélicoïdaux au-dessus de Bergün."},
{i:17,c:"tra",r:"gr",k:"VS",t:"Glacier Express",p:"Zermatt → St. Moritz",g:"inc",x:[46.660,8.671],d:"« L’express le plus lent du monde » : 8 h, 291 ponts. AG valable mais réservation payante — ou le même trajet en trains régionaux, sans supplément."},
{i:18,c:"tra",r:"ch",k:"VD",t:"GoldenPass Express",p:"Montreux → Interlaken",g:"inc",x:[46.555,7.373],d:"Léman, Pays-d’Enhaut, Gstaad, Simmental — changement d’écartement en marche à Zweisimmen."},
{i:19,c:"tra",r:"ti",k:"TI",t:"Centovalli",p:"Locarno → Domodossola",g:"inc",x:[46.177,8.700],d:"« Cent vallées » : viaducs au-dessus du vide et villages suspendus. AG valable côté suisse."},
{i:20,c:"tra",r:"al",k:"UR",t:"Ancienne ligne du Gothard",p:"Erstfeld → Bellinzone",g:"inc",x:[46.706,8.599],d:"Les boucles mythiques : on voit l’église de Wassen trois fois. Prendre le régional, pas le tunnel de base."},
{i:21,c:"tra",r:"al",k:"VS",t:"Lötschberger, rampe sud",p:"Berne → Brigue via Goppenstein",g:"inc",x:[46.322,7.790],d:"La ligne en balcon au-dessus de la vallée du Rhône."},
{i:22,c:"tra",r:"al",k:"UR",t:"Vapeur de la Furka (DFB)",p:"Realp → Oberwald",g:"pay",x:[46.598,8.503],d:"La ligne de légende ressuscitée par des bénévoles : crémaillère, charbon et fumée (été)."},
{i:23,c:"tra",r:"al",k:"LU",t:"Rigi en crémaillère",p:"Vitznau / Arth-Goldau",g:"inc",x:[47.056,8.485],d:"La « reine des montagnes », plus ancien train de montagne d’Europe (1871) — inclus dans l’AG !"},
{i:24,c:"tra",r:"al",k:"LU",t:"Pilatus",p:"Alpnachstad",g:"red",x:[46.979,8.255],d:"La crémaillère la plus raide du monde : 48 % de pente."},
{i:25,c:"tra",r:"al",k:"BE",t:"Brienz Rothorn à vapeur",p:"Brienz",g:"red",x:[46.787,8.047],d:"Vapeur, suie et vue plongeante sur le turquoise du lac de Brienz."},
{i:26,c:"tra",r:"al",k:"SZ",t:"Funiculaire de Stoos",p:"Schwyz",g:"red",x:[46.977,8.665],d:"Le funiculaire le plus raide du monde (110 %), cabines-tonneaux qui pivotent."},
{i:27,c:"tra",r:"al",k:"NW",t:"Stanserhorn CabriO",p:"Stans",g:"red",x:[46.928,8.339],d:"Téléphérique décapotable : pont supérieur à ciel ouvert."},
{i:28,c:"tra",r:"al",k:"BE",t:"Cols en car postal",p:"Grimsel · Furka · Susten",g:"inc",x:[46.561,8.337],d:"Trois cols mythiques en car jaune, klaxon à trois tons dans les épingles (été)."},
{i:139,c:"tra",r:"al",k:"SH",t:"Croisière du Haut-Rhin",p:"Schaffhouse → Stein am Rhein",g:"inc",x:[47.689,8.749],d:"La plus belle croisière fluviale du pays, entre rives boisées et bourgs médiévaux."},

/* --- Sommets & panoramas --- */
{i:29,c:"som",r:"al",k:"AI",t:"Ebenalp & Äscher",p:"Wasserauen",g:"red",x:[47.284,9.414],d:"L’auberge collée à la falaise et la grotte-ermitage de Wildkirchli."},
{i:30,c:"som",r:"al",k:"AR",t:"Säntis",p:"Schwägalp",g:"red",x:[47.249,9.343],d:"Le toit de la Suisse orientale : six pays visibles par temps clair."},
{i:31,c:"som",r:"al",k:"BE",t:"Schilthorn – Piz Gloria",p:"Mürren",g:"red",x:[46.557,7.835],d:"Le sommet de James Bond (1969), restaurant tournant à 2970 m."},
{i:32,c:"som",r:"al",k:"BE",t:"Jungfraujoch",p:"Grindelwald / Wengen",g:"red",x:[46.547,7.981],d:"La plus haute gare d’Europe (3454 m). Cher même avec l’AG — par grand beau uniquement !"},
{i:33,c:"som",r:"al",k:"VS",t:"Gornergrat",p:"Zermatt",g:"red",x:[45.983,7.784],d:"Face au Cervin et à 29 sommets de plus de 4000 m."},
{i:34,c:"som",r:"al",k:"VS",t:"Glacier d’Aletsch",p:"Bettmeralp / Riederalp",g:"red",x:[46.398,8.068],d:"20 km de glace (UNESCO) depuis Moosfluh, et des villages sans voitures."},
{i:35,c:"som",r:"al",k:"BE",t:"Niesen",p:"Mülenen",g:"red",x:[46.645,7.652],d:"La « pyramide suisse » et son funiculaire de 1910."},
{i:36,c:"som",r:"gr",k:"GR",t:"Muottas Muragl",p:"Samedan / Pontresina",g:"red",x:[46.508,9.913],d:"Le balcon classique sur les lacs de Haute-Engadine."},
{i:37,c:"som",r:"ti",k:"TI",t:"Monte Generoso",p:"Capolago",g:"red",x:[45.929,9.019],d:"La « Fleur de pierre » de Mario Botta au-dessus du lac de Lugano."},
{i:38,c:"som",r:"al",k:"AI",t:"Hoher Kasten",p:"Brülisau",g:"red",x:[47.285,9.463],d:"Restaurant tournant et jardin alpin au-dessus de la vallée du Rhin."},
{i:39,c:"som",r:"ro",k:"NE",t:"Creux du Van",p:"Noiraigue",g:"inc",x:[46.932,6.727],d:"Cirque rocheux de 160 m de haut ; bouquetins au lever du jour."},
{i:120,c:"som",r:"al",k:"BE",t:"Schynige Platte",p:"Wilderswil",g:"red",x:[46.636,7.909],d:"Train de 1893, jardin botanique alpin et LA vue carte postale sur Eiger-Mönch-Jungfrau."},
{i:121,c:"som",r:"ro",k:"BE",t:"Chasseral",p:"Jura bernois",g:"inc",x:[47.133,7.059],d:"Le balcon du Jura : toute la chaîne des Alpes, du Säntis au Mont-Blanc (car postal l’été)."},
{i:122,c:"som",r:"ro",k:"VD",t:"Peak Walk, Glacier 3000",p:"Les Diablerets",g:"red",x:[46.331,7.211],d:"Le seul pont suspendu du monde reliant deux sommets."},

/* --- Lacs, gorges & bains --- */
{i:40,c:"eau",r:"al",k:"SH",t:"Chutes du Rhin",p:"Neuhausen",g:"inc",x:[47.678,8.615],d:"La chute la plus puissante d’Europe ; bateau jusqu’au rocher central."},
{i:41,c:"eau",r:"al",k:"BE",t:"Oeschinensee",p:"Kandersteg",g:"red",x:[46.498,7.727],d:"Amphithéâtre turquoise sous la Blüemlisalp ; luge d’été en prime."},
{i:42,c:"eau",r:"al",k:"BE",t:"Blausee",p:"Kandergrund",g:"inc",x:[46.532,7.665],d:"Minuscule lac d’un bleu irréel (entrée payante), passerelles et barques dans la forêt."},
{i:43,c:"eau",r:"gr",k:"GR",t:"Caumasee",p:"Flims",g:"inc",x:[46.827,9.297],d:"La « Caraïbe grisonne » cachée dans la forêt de Flims."},
{i:44,c:"eau",r:"al",k:"AI",t:"Seealpsee",p:"Wasserauen",g:"inc",x:[47.268,9.401],d:"Le miroir de l’Alpstein, à une heure de marche de Wasserauen."},
{i:45,c:"eau",r:"gr",k:"GR",t:"Lac de Sils",p:"Sils / Segl",g:"inc",x:[46.421,9.740],d:"La presqu’île Chastè chère à Nietzsche ; service de bateau le plus haut d’Europe (été)."},
{i:46,c:"eau",r:"al",k:"BE",t:"Lauterbrunnen",p:"Lauterbrunnen",g:"inc",x:[46.593,7.909],d:"72 cascades dont le Staubbach et les Trümmelbach souterraines (entrée payante) — la vallée qui a inspiré Tolkien."},
{i:47,c:"eau",r:"al",k:"BE",t:"Giessbach",p:"Lac de Brienz",g:"inc",x:[46.734,8.024],d:"Cascades, palace Belle Époque et plus vieux funiculaire touristique d’Europe (1879)."},
{i:48,c:"eau",r:"ti",k:"TI",t:"Cascade de Foroglio",p:"Val Bavona",g:"inc",x:[46.348,8.582],d:"110 m de chute au-dessus d’un hameau de pierre. Car postal au bout du monde."},
{i:49,c:"eau",r:"ti",k:"TI",t:"Val Verzasca",p:"Lavertezzo",g:"inc",x:[46.259,8.837],d:"Eau émeraude, dalles polies et le pont « romain » à deux arches."},
{i:50,c:"eau",r:"al",k:"BE",t:"Gorges de l’Aar",p:"Meiringen",g:"inc",x:[46.720,8.223],d:"Passerelles accrochées dans une fente de 1,4 km (entrée payante)."},
{i:51,c:"eau",r:"gr",k:"GR",t:"Viamala",p:"Thusis",g:"inc",x:[46.660,9.446],d:"Le « mauvais chemin » qui terrorisait les voyageurs vers les cols ; 359 marches (entrée payante)."},
{i:52,c:"eau",r:"al",k:"UR",t:"Gorges de Schöllenen",p:"Andermatt",g:"inc",x:[46.647,8.590],d:"Le pont du Diable et la légende fondatrice du Gothard."},
{i:53,c:"eau",r:"gr",k:"GR",t:"Thermes de Vals",p:"Vals",g:"inc",x:[46.616,9.180],d:"Les bains en quartzite de Peter Zumthor, chef-d’œuvre d’architecture (réserver)."},
{i:54,c:"eau",r:"al",k:"BE",t:"Île St-Pierre",p:"Lac de Bienne",g:"inc",x:[47.063,7.135],d:"La presqu’île de Rousseau — « les plus heureux jours de ma vie » — à pied depuis Erlach ou en bateau."},
{i:101,c:"eau",r:"al",k:"GL",t:"Klöntalersee",p:"Klöntal",g:"inc",x:[47.023,8.966],d:"Le « fjord » glaronnais : lac encaissé entre parois verticales, baignade et grillades."},
{i:102,c:"eau",r:"al",k:"UR",t:"Arnisee",p:"Amsteg / Intschi",g:"red",x:[46.837,8.653],d:"Petit lac au-dessus de la Reuss, deux téléphériques rustiques, place de feu."},
{i:103,c:"eau",r:"al",k:"UR",t:"Golzernsee",p:"Maderanertal",g:"red",x:[46.809,8.760],d:"Le joyau caché du Maderanertal : téléphérique puis 30 min à pied, baignade sauvage."},
{i:104,c:"eau",r:"al",k:"OW",t:"Melchsee-Frutt",p:"Kerns",g:"red",x:[46.773,8.265],d:"Plateau sans voitures à 1920 m, deux lacs, tour quasi plat — fondue en télécabine possible."},
{i:105,c:"eau",r:"al",k:"OW",t:"Trübsee",p:"Engelberg",g:"red",x:[46.794,8.399],d:"Lac sous le Titlis : tour du lac plat, barques gratuites l’été."},
{i:106,c:"eau",r:"al",k:"BE",t:"Engstlensee",p:"Gental",g:"inc",x:[46.775,8.352],d:"Car postal jusqu’à l’un des plus beaux alpages de Suisse, lac poissonneux."},
{i:107,c:"eau",r:"gr",k:"GR",t:"Lai da Palpuogna",p:"Col de l’Albula",g:"inc",x:[46.584,9.755],d:"Élu plus bel endroit de Suisse en 2007 — mélèzes, eau noire, car postal."},
{i:108,c:"eau",r:"ro",k:"VS",t:"Lac de Taney",p:"Vouvry",g:"inc",x:[46.348,6.836],d:"Vallon suspendu au-dessus du Léman, hameau sans route (1 h 15 de montée)."},
{i:109,c:"eau",r:"al",k:"BE",t:"Lauenensee",p:"Saanenland",g:"inc",x:[46.399,7.321],d:"Marais et miroirs d’eau au fond du Saanenland — une chanson culte lui est dédiée."},
{i:110,c:"eau",r:"gr",k:"GR",t:"Bains de Scuol",p:"Basse-Engadine",g:"inc",x:[46.797,10.305],d:"Bains romano-irlandais, puis balade dans les villages à sgraffites de Sent et Ftan."},
{i:111,c:"eau",r:"ro",k:"VD",t:"Grottes de Vallorbe",p:"Vallorbe",g:"inc",x:[46.727,6.367],d:"Les plus belles grottes de Suisse, sur le cours souterrain de l’Orbe (entrée payante)."},

/* --- Randonnées --- */
{i:55,c:"ran",r:"al",k:"SZ",t:"Crête de Stoos",p:"Klingenstock → Fronalpstock",g:"red",x:[46.967,8.660],d:"Arête panoramique au-dessus du lac d’Uri (2–3 h)."},
{i:56,c:"ran",r:"al",k:"SG",t:"Pizol, tour des 5 lacs",p:"Bad Ragaz / Wangs",g:"red",x:[46.958,9.396],d:"La plus belle randonnée de lacs alpins de Suisse (4–5 h, juillet–octobre)."},
{i:57,c:"ran",r:"al",k:"BE",t:"First : Cliff Walk & Bachalpsee",p:"Grindelwald",g:"red",x:[46.659,8.053],d:"Passerelle au-dessus du vide puis lac-miroir face aux Schreckhörner (2 h)."},
{i:58,c:"ran",r:"al",k:"VS",t:"Passage de la Gemmi",p:"Leukerbad → Kandersteg",g:"red",x:[46.399,7.615],d:"Le chemin historique dans la paroi ; thermes de Loèche-les-Bains à la clé."},
{i:59,c:"ran",r:"gr",k:"GR",t:"Ruinaulta",p:"Flims / Versam",g:"inc",x:[46.826,9.300],d:"Le « Grand Canyon suisse » : à pied, en train régional ou en rafting."},
{i:60,c:"ran",r:"al",k:"BE",t:"Napf",p:"Emmental",g:"inc",x:[47.005,7.940],d:"Le cœur inaccessible de l’Emmental : aucune route, panorama des Alpes au Jura (3–4 h)."},
{i:112,c:"ran",r:"gr",k:"GR",t:"Val Fex",p:"Sils / Segl",g:"inc",x:[46.396,9.753],d:"La vallée sans voitures derrière Sils : fond plat, calèches, hameaux romanches."},
{i:113,c:"ran",r:"gr",k:"GR",t:"Val Roseg",p:"Pontresina",g:"inc",x:[46.446,9.864],d:"Fond de vallée plat jusqu’au cirque glaciaire — à pied, en calèche, ou à ski de fond l’hiver."},
{i:114,c:"ran",r:"ro",k:"VD",t:"Terrasses de Lavaux",p:"Lutry → St-Saphorin",g:"inc",x:[46.493,6.750],d:"Entre vignes UNESCO et Léman, quasi plat, de village vigneron en village vigneron."},
{i:115,c:"ran",r:"ro",k:"NE",t:"Gorges de l’Areuse",p:"Noiraigue → Boudry",g:"inc",x:[46.945,6.746],d:"Passerelles romantiques le long de la rivière, en pente douce — le pont de carte postale."},
{i:116,c:"ran",r:"al",k:"ZH",t:"Uetliberg → Felsenegg",p:"Zurich",g:"inc",x:[47.351,8.490],d:"Le « chemin des planètes » en crête plate au-dessus de Zurich, funiculaire au retour."},
{i:117,c:"ran",r:"al",k:"BE",t:"Grütschalp → Mürren",p:"Lauterbrunnen",g:"inc",x:[46.578,7.892],d:"Sentier-balcon plat face à Eiger, Mönch et Jungfrau, entre deux trains."},
{i:118,c:"ran",r:"ro",k:"VS",t:"Un bisse valaisan",p:"Nendaz ou Savièse",g:"inc",x:[46.188,7.305],d:"Suivre l’eau à flanc de coteau le long des canaux historiques — les sentiers les plus plats des Alpes."},
{i:119,c:"ran",r:"al",k:"NW",t:"Felsenweg du Bürgenstock",p:"Bürgenstock",g:"red",x:[46.997,8.380],d:"Sentier taillé dans la falaise au-dessus du lac + le plus haut ascenseur extérieur d’Europe."},

/* --- Fêtes & traditions --- */
{i:61,c:"fet",r:"al",k:"BS",t:"Morgestraich – Fasnacht de Bâle",p:"Bâle",x:[47.558,7.588],d:"Lundi 4 h du matin : la ville s’éteint, les lanternes s’allument, piccolos et tambours (UNESCO). Février–mars."},
{i:62,c:"fet",r:"al",k:"ZH",t:"Sechseläuten",p:"Zurich",x:[47.366,8.545],d:"On brûle le Böögg : plus sa tête explose vite, plus l’été sera beau (3e lundi d’avril)."},
{i:63,c:"fet",r:"al",k:"SZ",t:"Klausjagen",p:"Küssnacht am Rigi",x:[47.085,8.442],d:"5 décembre : 200 mitres-vitraux illuminées de 2 m, cors et fouets."},
{i:64,c:"fet",r:"al",k:"AR",t:"Silvesterchlausen",p:"Urnäsch",x:[47.317,9.279],d:"Nouvel an julien (13 janvier) : Chläuse masqués qui yodlent de ferme en ferme dans la neige."},
{i:65,c:"fet",r:"al",k:"VS",t:"Tschäggättä",p:"Lötschental",x:[46.403,7.784],d:"Masques effrayants sculptés et fourrures — le carnaval païen du Lötschental (février)."},
{i:66,c:"fet",r:"al",k:"AR",t:"Désalpe / Alpabzug",p:"Urnäsch, Charmey ou Entlebuch",x:[47.320,9.283],d:"Fin septembre : troupeaux couronnés de fleurs, sonnailles et cortèges."},
{i:67,c:"fet",r:"ch",k:"CH",t:"Fête de lutte suisse",p:"Schwingfest, selon calendrier",x:[46.800,8.230],d:"Sciure, culottes de jute et taureau en prix — la Suisse profonde à l’état pur (été)."},
{i:68,c:"fet",r:"al",k:"BE",t:"Match de Hornussen",p:"Emmental",x:[47.030,7.740],d:"Le sport paysan : projeter un palet à 300 m, l’arrêter avec des panneaux de bois."},
{i:69,c:"fet",r:"ro",k:"VS",t:"Combat de reines",p:"Aproz",x:[46.213,7.305],d:"Les vaches d’Hérens s’affrontent comme à l’alpage ; finale nationale en mai."},
{i:70,c:"fet",r:"al",k:"BE",t:"Zibelemärit",p:"Berne",x:[46.950,7.440],d:"4e lundi de novembre, dès 5 h : 50 tonnes d’oignons tressés et batailles de confettis."},
{i:71,c:"fet",r:"al",k:"SG",t:"OLMA",p:"St-Gall",x:[47.428,9.377],d:"La grande foire agricole d’octobre : courses de porcelets, halles à bétail, ambiance."},
{i:72,c:"fet",r:"ch",k:"CH",t:"1er Août à la ferme",p:"partout",x:[46.770,8.190],d:"Brunch fermier au petit matin, feux d’artifice sur les hauteurs le soir."},
{i:140,c:"fet",r:"al",k:"BS",t:"Marché de Noël de Bâle",p:"Barfüsserplatz",x:[47.556,7.590],d:"Le plus grand marché de Noël de Suisse, ruelles illuminées (fin nov.–déc.)."},
{i:141,c:"fet",r:"al",k:"GL",t:"Landsgemeinde de Glaris",p:"Glaris",x:[47.040,9.068],d:"La démocratie à l’état brut : tout un canton vote à main levée sur la place (1er dimanche de mai)."},
{i:142,c:"fet",r:"ti",k:"TI",t:"Hockey à Ambrì",p:"Gottardo Arena, Ambrì-Piotta",x:[46.512,8.689],d:"Le club de village mythique de la Leventina — ambiance unique en Suisse (sept.–mars)."},

/* --- Gastronomie --- */
{i:73,c:"gas",r:"al",k:"BE",t:"Meringues du Kemmeriboden-Bad",p:"Schangnau",g:"inc",x:[46.777,7.909],d:"Meringues géantes à la double crème, au fond de l’Emmental — car postal compris."},
{i:74,c:"gas",r:"al",k:"AR",t:"Fromagerie d’Appenzell",p:"Stein AR",x:[47.373,9.345],d:"Percer (ou pas) le secret de la saumure aux herbes à la fromagerie de démonstration."},
{i:75,c:"gas",r:"ro",k:"FR",t:"Maison Cailler",p:"Broc",x:[46.604,7.101],d:"La plus ancienne marque de chocolat du pays, dégustation à volonté en fin de visite."},
{i:76,c:"gas",r:"al",k:"BE",t:"Kambly",p:"Trubschachen",x:[46.923,7.845],d:"Biscuits à volonté et fours de démonstration — le pèlerinage emmentalois."},
{i:77,c:"gas",r:"al",k:"BE",t:"Gelateria di Berna",p:"Berne",x:[46.938,7.442],d:"La glace artisanale culte du quartier du Marzili — la file d’attente fait partie de l’expérience (été)."},
{i:78,c:"gas",r:"al",k:"ZH",t:"Luxemburgerli de Sprüngli",p:"Paradeplatz, Zurich",x:[47.370,8.539],d:"Les macarons aériens de la Paradeplatz, institution zurichoise depuis 1836."},
{i:79,c:"gas",r:"gr",k:"GR",t:"Bündner Nusstorte",p:"Engadine",x:[46.602,9.959],d:"La tourte aux noix caramélisées, achetée sur place — pas au supermarché."},
{i:80,c:"gas",r:"ti",k:"TI",t:"Grotto tessinois",p:"vallées du Tessin",x:[46.200,8.780],d:"Polenta au feu de bois, formaggini et gazosa bien fraîche sous la pergola — souvent cash only."},
{i:81,c:"gas",r:"ro",k:"VS",t:"Raclette au feu de bois",p:"Valais",x:[46.200,7.550],d:"Fromage d’alpage AOP raclé à la braise dans un mayen."},
{i:82,c:"gas",r:"al",k:"AG",t:"Rüeblitorte d’Argovie",p:"Aarau",x:[47.392,8.045],d:"Le gâteau aux carottes national dans son canton d’origine — et les pignons peints de la vieille ville."},
{i:143,c:"gas",r:"ro",k:"FR",t:"Cuchaule & moutarde de Bénichon",p:"pays de Fribourg",x:[46.806,7.162],d:"Le pain safrané AOP, sa confiture de moutarde douce-épicée et les poires à botzi (sept.–oct.)."},
{i:144,c:"gas",r:"ti",k:"TI",t:"Castagnata d’Ascona",p:"Lac Majeur",x:[46.154,8.770],d:"Châtaignes grillées, marrons chauds et douceurs au bord du lac (octobre)."},
{i:145,c:"gas",r:"al",k:"TG",t:"Hüppen de Gottlieben",p:"Gottlieben",g:"inc",x:[47.664,9.126],d:"Rouleaux croustillants fourrés au chocolat, dans un village de conte au bord de l’Untersee."},

/* --- Culture & musées --- */
{i:83,c:"cul",r:"al",k:"SG",t:"Bibliothèque de l’abbaye de St-Gall",p:"St-Gall",x:[47.423,9.377],d:"La plus belle salle rococo du monde, manuscrits millénaires, pantoufles obligatoires (UNESCO)."},
{i:84,c:"cul",r:"gr",k:"GR",t:"Couvent de Müstair",p:"Val Müstair",g:"inc",x:[46.630,10.448],d:"Fresques carolingiennes de l’an 800 au fond du Val Müstair (UNESCO)."},
{i:85,c:"cul",r:"al",k:"SZ",t:"Abbaye d’Einsiedeln",p:"Einsiedeln",g:"inc",x:[47.126,8.752],d:"La Vierge noire et la grande place de pèlerinage baroque."},
{i:86,c:"cul",r:"al",k:"BE",t:"Ballenberg",p:"Brienz",x:[46.751,8.083],d:"Une centaine de bâtiments ruraux remontés pièce par pièce, artisans à l’œuvre."},
{i:87,c:"cul",r:"al",k:"LU",t:"Musée suisse des transports",p:"Lucerne",x:[47.053,8.336],d:"Le musée le plus visité du pays : locos, avions, planétarium."},
{i:88,c:"cul",r:"al",k:"UR",t:"Grütli en bateau à vapeur",p:"Lac des Quatre-Cantons",g:"inc",x:[46.969,8.594],d:"Traversée du lac d’Uri en vapeur 1900 jusqu’à la prairie du serment de 1291."},
{i:89,c:"cul",r:"ro",k:"VD",t:"Château de Chillon",p:"Veytaux",g:"inc",x:[46.414,6.927],d:"Le monument le plus visité de Suisse, les pieds dans le Léman ; cachot chanté par Byron."},
{i:90,c:"cul",r:"al",k:"BE",t:"Berne : Zytglogge & arcades",p:"Berne",g:"inc",x:[46.948,7.448],d:"6 km d’arcades (UNESCO), l’horloge astronomique et la maison d’Einstein."},
{i:91,c:"cul",r:"ti",k:"TI",t:"Sasso San Gottardo",p:"Col du Gothard",x:[46.556,8.567],d:"La forteresse secrète du Réduit national, creusée dans le granit du col."},
{i:123,c:"cul",r:"al",k:"BS",t:"Fondation Beyeler",p:"Riehen",x:[47.589,7.651],d:"Monet, Rothko et Giacometti dans l’écrin de Renzo Piano, parc compris."},
{i:124,c:"cul",r:"al",k:"ZH",t:"Kunsthaus de Zurich",p:"Zurich",x:[47.370,8.548],d:"La plus grande collection d’art de Suisse, extension de Chipperfield."},
{i:125,c:"cul",r:"al",k:"BE",t:"Zentrum Paul Klee",p:"Berne",x:[46.949,7.474],d:"Les trois vagues de Renzo Piano et 4000 œuvres de Klee."},
{i:126,c:"cul",r:"al",k:"ZH",t:"Technorama",p:"Winterthour",x:[47.502,8.748],d:"500 expériences à toucher — le musée où l’on a le droit de tout essayer."},
{i:127,c:"cul",r:"ro",k:"GE",t:"CERN",p:"Meyrin",x:[46.233,6.056],d:"Le berceau du web et le plus grand accélérateur du monde — Portail de la science, gratuit."},
{i:128,c:"cul",r:"ro",k:"NE",t:"La Chaux-de-Fonds",p:"Montagnes neuchâteloises",g:"inc",x:[47.099,6.825],d:"Urbanisme horloger UNESCO et Musée international d’horlogerie."},
{i:129,c:"cul",r:"ti",k:"TI",t:"Châteaux de Bellinzone",p:"Bellinzone",g:"inc",x:[46.192,9.022],d:"Trois châteaux médiévaux UNESCO qui verrouillaient la route du Gothard."},
{i:130,c:"cul",r:"al",k:"BL",t:"Augusta Raurica",p:"Augst",x:[47.534,7.720],d:"Le plus grand théâtre romain au nord des Alpes, ville antique à ciel ouvert."},
{i:131,c:"cul",r:"ro",k:"VD",t:"Musée Olympique & Ouchy",p:"Lausanne",x:[46.509,6.634],d:"Lausanne capitale olympique : musée, quais et flamme."},
{i:132,c:"cul",r:"ro",k:"VD",t:"Chaplin’s World",p:"Corsier-sur-Vevey",x:[46.478,6.842],d:"Le manoir de Charlot au-dessus de Vevey, hollywoodien et émouvant."},
{i:133,c:"cul",r:"al",k:"ZH",t:"Musée national suisse",p:"Zurich",x:[47.379,8.540],d:"Le château-musée face à la gare : toute l’histoire suisse sous un toit."},

/* --- Insolite --- */
{i:92,c:"ins",r:"al",k:"VS",t:"Pont suspendu Charles Kuonen",p:"Randa",g:"inc",x:[46.106,7.771],d:"494 m suspendus au-dessus de la vallée — le plus long pont piéton des Alpes."},
{i:93,c:"ins",r:"al",k:"BE",t:"Gelmerbahn",p:"Handegg (Grimsel)",g:"pay",x:[46.608,8.322],d:"Funiculaire ouvert à 106 % : des montagnes russes lentes vers un lac de barrage."},
{i:94,c:"ins",r:"ro",k:"VS",t:"Grande Dixence",p:"Val d’Hérémence",x:[46.081,7.404],d:"Le plus haut barrage-poids du monde : 285 m de béton au fond du val des Dix."},
{i:95,c:"ins",r:"ti",k:"TI",t:"Barrage de la Verzasca",p:"Contra",x:[46.183,8.852],d:"Le saut d’ouverture de GoldenEye : à contempler — ou à sauter à l’élastique (220 m)."},
{i:96,c:"ins",r:"al",k:"ZH",t:"Blindekuh",p:"Zurich",x:[47.363,8.552],d:"Le premier restaurant dans le noir absolu du monde, servi par des non-voyants."},
{i:97,c:"ins",r:"al",k:"BE",t:"Baignade urbaine",p:"Berne / Bâle",x:[46.942,7.446],d:"Descendre l’Aar au Marzili, ou le Rhin à Bâle avec son Wickelfisch (été)."},
{i:98,c:"ins",r:"gr",k:"GR",t:"Luge nocturne Preda–Bergün",p:"Bergün",g:"inc",x:[46.632,9.746],d:"6 km de route enneigée éclairée, remontée en train RhB (hiver). Location sur place."},
{i:99,c:"ins",r:"gr",k:"GR",t:"Juf en car postal",p:"Vallée d’Avers",g:"inc",x:[46.446,9.578],d:"Le plus haut village habité à l’année d’Europe (2126 m), au bout de la ligne."},
{i:100,c:"ins",r:"ch",k:"CH",t:"Nuit en cabane CAS",p:"à choisir",x:[46.550,8.400],d:"Dortoir, Älplermagronen et lever du soleil sur les glaciers — réserver tôt."},
{i:146,c:"ins",r:"gr",k:"GR",t:"Heididorf",p:"Maienfeld",g:"inc",x:[47.005,9.531],d:"Kitsch assumé : le village de Heidi et les vignes de la Bündner Herrschaft."},
{i:147,c:"ins",r:"ch",k:"CH",t:"Nuit dans la paille",p:"une ferme, quelque part",x:[46.950,7.650],d:"Dormir sur la paille dans une ferme (mai–oct.), réveil au chant du coq."},
{i:148,c:"ins",r:"al",k:"LU",t:"Trottinette de la Marbachegg",p:"Marbach, Entlebuch",g:"red",x:[46.847,7.985],d:"Descente en trottinette tout-terrain dans la biosphère UNESCO de l’Entlebuch."},

/* --- Franches-Montagnes & grandes villes (v3) --- */
{i:149,c:"eau",r:"ro",k:"JU",t:"Étang de la Gruère",p:"Franches-Montagnes",g:"inc",x:[47.239,7.049],d:"Tourbière mystique aux eaux noires, tour plat sur caillebotis — le joyau des Franches-Montagnes."},
{i:150,c:"fet",r:"ro",k:"JU",t:"Marché-Concours de Saignelégier",p:"Saignelégier",g:"inc",x:[47.256,6.996],d:"La grande fête du cheval des Franches-Montagnes : courses sans selle et cortège (2e week-end d’août)."},
{i:151,c:"ran",r:"ro",k:"JU",t:"Le Doubs, de Goumois au Theusseret",p:"Goumois",g:"inc",x:[47.271,6.946],d:"Rive sauvage et plate le long de la rivière, martins-pêcheurs en prime."},
{i:152,c:"tra",r:"ro",k:"JU",t:"Chemins de fer du Jura",p:"La Chaux-de-Fonds → Glovelier",g:"inc",x:[47.245,7.030],d:"Le petit train rouge qui se faufile entre pâturages boisés et chevaux en liberté."},
{i:153,c:"vil",r:"ti",k:"TI",t:"Gandria",p:"Lac de Lugano",g:"inc",x:[46.004,8.999],d:"Ruelles à fleur d’eau et sentier de l’olivier — on y va à pied ou en bateau depuis Lugano."},
{i:154,c:"vil",r:"al",k:"LU",t:"Lucerne : Kapellbrücke & Lion",p:"Lucerne",g:"inc",x:[47.052,8.308],d:"Le pont de bois de 1333 et le Lion mourant, « la pierre la plus émouvante du monde » selon Mark Twain."},
{i:155,c:"vil",r:"al",k:"ZH",t:"Zurich : Lindenhof & Fraumünster",p:"Zurich",g:"inc",x:[47.371,8.541],d:"La terrasse romaine au-dessus de la Limmat et les vitraux de Chagall."},
{i:156,c:"vil",r:"al",k:"BS",t:"Bâle : vieille ville & Fähri",p:"Bâle",g:"inc",x:[47.559,7.592],d:"Le Münster rouge, les ruelles médiévales, et la traversée du Rhin en bac à câble silencieux."},
{i:157,c:"vil",r:"ro",k:"FR",t:"Fribourg : basse-ville & funiculaire",p:"Fribourg",g:"inc",x:[46.803,7.161],d:"Ponts, remparts, et le dernier funiculaire d’Europe à eaux usées (1899) — il sent un peu, oui."},
{i:158,c:"cul",r:"ro",k:"GE",t:"Genève : jet d’eau & Palais des Nations",p:"Genève",g:"inc",x:[46.207,6.156],d:"140 m d’eau, la vieille ville de Calvin et le siège européen de l’ONU."},
{i:159,c:"cul",r:"ro",k:"VD",t:"Le guet de Lausanne",p:"Cathédrale de Lausanne",g:"inc",x:[46.522,6.635],d:"Chaque nuit depuis 1405, il crie l’heure du haut du beffroi (22 h–2 h) — montez l’écouter."},
{i:160,c:"cul",r:"ro",k:"NE",t:"Automates Jaquet-Droz",p:"Neuchâtel",x:[46.991,6.929],d:"Trois androïdes de 1774 qui écrivent, dessinent et respirent — démonstration le 1er dimanche du mois."},
{i:161,c:"gas",r:"al",k:"ZH",t:"Lindt Home of Chocolate",p:"Kilchberg",g:"inc",x:[47.321,8.544],d:"La plus grande fontaine de chocolat du monde (9 m) et dégustation à volonté."},
{i:162,c:"gas",r:"ro",k:"BE",t:"Tête de Moine à Bellelay",p:"Abbatiale de Bellelay",g:"inc",x:[47.264,7.165],d:"Le fromage en rosettes dégusté là où les moines l’ont inventé, girolle en main."},
{i:163,c:"gas",r:"al",k:"ZH",t:"Hiltl",p:"Zurich",x:[47.374,8.534],d:"Le plus ancien restaurant végétarien du monde (1898, au Guinness) — buffet légendaire."},

/* --- Gorges, lacs & nature (v6) --- */
{i:164,c:"eau",r:"ro",k:"NE",t:"Saut du Doubs",p:"Les Brenets",g:"inc",x:[47.070,6.703],d:"La chute de 27 m du Doubs, en bateau ou à pied depuis Les Brenets — la star du Jura."},
{i:165,c:"eau",r:"al",k:"SG",t:"Gorges de la Tamina",p:"Bad Ragaz",x:[46.986,9.507],d:"La faille où l’on descendait les curistes au bout d’une corde ; vieux bains de Pfäfers (entrée payante)."},
{i:166,c:"eau",r:"al",k:"BE",t:"Gorges glaciaires de Rosenlaui",p:"Vallée de Rosenlaui",g:"inc",x:[46.724,8.155],d:"La roche polie par le glacier, marmites et cascades (entrée payante) — car postal d’époque depuis Meiringen."},
{i:167,c:"eau",r:"ro",k:"BE",t:"Gorges du Pichoux",p:"Sornetan",g:"inc",x:[47.263,7.218],d:"La Sorne taille le Jura en falaises — à combiner avec la Tête de Moine de Bellelay."},
{i:168,c:"eau",r:"ti",k:"TI",t:"Gole della Breggia",p:"Morbio Inferiore",g:"inc",x:[45.848,9.017],d:"200 millions d’années de géologie à ciel ouvert dans le premier géoparc de Suisse."},
{i:169,c:"eau",r:"ti",k:"TI",t:"Lago Ritom & Val Piora",p:"Piotta",x:[46.547,8.687],d:"L’un des funiculaires les plus raides du monde (87,8 %), puis trois lacs alpins — sous Ambrì."},
{i:170,c:"eau",r:"gr",k:"GR",t:"Lago di Saoseo",p:"Val di Campo (Poschiavo)",g:"inc",x:[46.271,10.086],d:"Le lac le plus photogénique des Grisons, bleu-vert irréel — car postal jusqu’à Sfazù puis 1 h à pied."},
{i:171,c:"eau",r:"ro",k:"VS",t:"Derborence",p:"Val de Derborence",g:"inc",x:[46.281,7.213],d:"Lac né d’un éboulement en 1749, forêt vierge, et la route de car postal la plus vertigineuse du pays."},
{i:172,c:"eau",r:"ro",k:"VS",t:"Lac de Moiry",p:"Grimentz",g:"inc",x:[46.141,7.565],d:"Le barrage turquoise au-dessus de Grimentz, car postal jusqu’au pied du glacier (été)."},
{i:173,c:"eau",r:"al",k:"FR",t:"Schwarzsee / Lac Noir",p:"Singine",g:"inc",x:[46.671,7.283],d:"Le lac des familles fribourgeoises, tour plat en 1 h et sentiers des préalpes."},
{i:174,c:"eau",r:"ro",k:"VD",t:"Lac de Joux",p:"Vallée de Joux",g:"inc",x:[46.667,6.332],d:"Le grand lac du Haut-Jura : bateau l’été, plus grande patinoire naturelle d’Europe l’hiver."},
{i:175,c:"eau",r:"al",k:"AI",t:"Fälensee & Bollenwees",p:"Alpstein",g:"inc",x:[47.247,9.444],d:"Le fjord secret de l’Alpstein, via le Sämtisersee depuis Brülisau (2 h 30) — baignade glacée."},
{i:176,c:"eau",r:"al",k:"SZ",t:"Grottes du Hölloch",p:"Muotathal",g:"inc",x:[46.969,8.804],d:"Près de 200 km de galeries — l’un des plus longs réseaux souterrains d’Europe (visite guidée)."},
{i:177,c:"eau",r:"al",k:"BE",t:"Chutes du Reichenbach",p:"Meiringen",g:"pay",x:[46.714,8.184],d:"Sherlock Holmes y « mourut » face à Moriarty ; funiculaire de 1899 (mai–octobre)."},
{i:178,c:"eau",r:"al",k:"SG",t:"Quinten & Seerenbachfälle",p:"Walensee",x:[47.130,9.200],d:"Village sans voitures au microclimat méditerranéen, accessible en bateau — et des cascades de 585 m."},
{i:179,c:"ran",r:"gr",k:"GR",t:"Parc National Suisse",p:"Zernez / Val Trupchun",g:"inc",x:[46.617,10.083],d:"Le seul parc national du pays : bouquetins, cerfs et marmottes garantis (juin–oct., sentiers stricts)."},
{i:180,c:"ran",r:"al",k:"BE",t:"Pont suspendu du Trift",p:"Gadmertal",g:"pay",x:[46.701,8.363],d:"170 m de passerelle à 100 m au-dessus d’un lac glaciaire, après un petit téléphérique (été)."},
{i:181,c:"som",r:"al",k:"VS",t:"Grotte de glace du glacier du Rhône",p:"Belvédère, col de la Furka",g:"inc",x:[46.579,8.387],d:"Un tunnel bleu retaillé chaque été dans le glacier, arrêt du car postal de la Furka."},
{i:182,c:"ins",r:"ro",k:"VS",t:"Pyramides d’Euseigne",p:"Val d’Hérens",g:"inc",x:[46.169,7.424],d:"Des cheminées de fées coiffées de blocs — le car postal passe dessous !"},
{i:183,c:"eau",r:"ro",k:"NE",t:"Gorges de la Poëta-Raisse",p:"Môtiers, Val-de-Travers",g:"inc",x:[46.900,6.598],d:"Le canyon secret du Val-de-Travers, escaliers taillés dans la roche (été) — sous le Chasseron."},

/* --- Grande extension v7 : villages --- */
{i:184,c:"vil",r:"al",k:"BE",t:"Iseltwald",p:"Lac de Brienz",g:"inc",x:[46.708,7.966],d:"Presqu’île de conte sur le lac de Brienz — le ponton rendu célèbre par une série coréenne."},
{i:185,c:"vil",r:"al",k:"BE",t:"Brienz & la Brunngasse",p:"Brienz",g:"inc",x:[46.756,8.032],d:"Le village des sculpteurs sur bois et la ruelle élue « plus belle rue d’Europe »."},
{i:186,c:"vil",r:"al",k:"BE",t:"Trub",p:"Emmental",g:"inc",x:[46.939,7.881],d:"L’Emmental des cartes postales : fermes cossues, collines et géraniums."},
{i:187,c:"vil",r:"al",k:"ZH",t:"Rheinau",p:"Bord du Rhin",g:"inc",x:[47.642,8.608],d:"L’abbaye baroque posée sur une île du Rhin, en amont des chutes."},
{i:188,c:"vil",r:"al",k:"ZH",t:"Regensberg",p:"Unterland zurichois",g:"inc",x:[47.484,8.439],d:"Bourg médiéval intact au-dessus des vignes, à 20 minutes de Zurich."},
{i:189,c:"vil",r:"al",k:"AG",t:"Kaiserstuhl",p:"Bord du Rhin",g:"inc",x:[47.568,8.417],d:"Ville miniature en triangle sur le Rhin — trois ruelles, huit siècles."},
{i:190,c:"vil",r:"al",k:"AG",t:"Bremgarten",p:"Boucle de la Reuss",g:"inc",x:[47.351,8.343],d:"Vieille ville serrée dans un méandre de la Reuss, pont de bois couvert."},
{i:191,c:"vil",r:"al",k:"AG",t:"Laufenburg",p:"Fricktal",g:"inc",x:[47.560,8.061],d:"Une ville, deux pays : le Rhin la coupe entre Suisse et Allemagne."},
{i:192,c:"vil",r:"ro",k:"FR",t:"Estavayer-le-Lac",p:"Lac de Neuchâtel",g:"inc",x:[46.849,6.845],d:"La cité à la rose et son musée de grenouilles naturalisées (1860) — oui, vraiment."},
{i:193,c:"vil",r:"ro",k:"VS",t:"Saillon",p:"Plaine du Rhône",g:"inc",x:[46.171,7.186],d:"Bourg médiéval sur son rocher et passerelle à Farinet, faux-monnayeur bien-aimé."},
{i:194,c:"vil",r:"ro",k:"VS",t:"Sion : Valère & Tourbillon",p:"Sion",g:"inc",x:[46.234,7.361],d:"Deux collines, une basilique fortifiée et le plus vieil orgue jouable du monde (1435)."},
{i:195,c:"vil",r:"gr",k:"GR",t:"Zuoz",p:"Haute-Engadine",g:"inc",x:[46.600,9.957],d:"La plus belle place de Haute-Engadine, maisons patriciennes et sgraffites."},
{i:196,c:"vil",r:"gr",k:"GR",t:"Vrin",p:"Val Lumnezia",g:"inc",x:[46.655,9.100],d:"Le village romanche sauvé et sublimé par l’architecte Gion A. Caminada."},
{i:197,c:"vil",r:"al",k:"GL",t:"Elm",p:"Sernftal",g:"inc",x:[46.919,9.174],d:"Village classé sous les plis tectoniques UNESCO — deux fois l’an, le soleil traverse le Martinsloch."},
{i:198,c:"vil",r:"al",k:"SH",t:"Schaffhouse & le Munot",p:"Schaffhouse",g:"inc",x:[47.697,8.636],d:"Oriels peints et forteresse circulaire — un gardien y vit et sonne la cloche chaque soir."},

/* --- v7 : trains & transports --- */
{i:199,c:"tra",r:"al",k:"SG",t:"Voralpen-Express",p:"Lucerne → St-Gall",g:"inc",x:[47.409,9.335],d:"La traversée des Préalpes par le plus haut pont ferroviaire du pays (viaduc de la Sitter, 99 m)."},
{i:200,c:"tra",r:"ro",k:"VD",t:"Vapeur Belle Époque de la CGN",p:"Lac Léman",g:"inc",x:[46.506,6.626],d:"Les vapeurs centenaires à roues à aubes — salons en acajou et machines apparentes."},
{i:201,c:"tra",r:"ro",k:"VD",t:"Train des vignes",p:"Vevey → Chexbres",g:"inc",x:[46.483,6.778],d:"Cinq minutes de montée dans les terrasses de Lavaux, le Léman dans le dos."},
{i:202,c:"tra",r:"ro",k:"VD",t:"Rochers-de-Naye",p:"Montreux",g:"red",x:[46.431,6.976],d:"Crémaillère depuis les quais de Montreux jusqu’aux marmottes, 1600 m plus haut."},
{i:203,c:"tra",r:"al",k:"UR",t:"Car postal du Klausen",p:"Flüelen → Linthal",g:"inc",x:[46.868,8.855],d:"Le col entre Uri et Glaris par Urnerboden, plus grand alpage du pays (1200 vaches, été)."},
{i:204,c:"tra",r:"gr",k:"GR",t:"Palm Express",p:"St. Moritz → Lugano",g:"pay",x:[46.401,9.696],d:"Des glaciers aux palmiers en car postal, par Maloja et la Valteline (réservation, été)."},

/* --- v7 : sommets --- */
{i:205,c:"som",r:"al",k:"BE",t:"Gurten",p:"Berne",g:"red",x:[46.918,7.440],d:"La montagne des Bernois : funiculaire, grand parc et vue sur la vieille ville."},
{i:206,c:"som",r:"ti",k:"TI",t:"Monte San Salvatore",p:"Lugano",g:"red",x:[45.977,8.945],d:"Le « Pain de Sucre » de Lugano, funiculaire de 1890 et terrasse à 360°."},
{i:207,c:"som",r:"al",k:"SO",t:"Weissenstein",p:"Soleure",g:"red",x:[47.255,7.506],d:"Le balcon du Jura soleurois : mer de brouillard en contrebas, Alpes en face."},
{i:208,c:"som",r:"al",k:"SZ",t:"Grosser Mythen",p:"Schwyz",g:"red",x:[47.030,8.680],d:"47 virages taillés dans la paroi jusqu’au sommet-pyramide (juin–oct., pied sûr)."},
{i:209,c:"som",r:"al",k:"BE",t:"Männlichen",p:"Wengen / Grindelwald",g:"red",x:[46.612,7.941],d:"Royal Walk jusqu’à la « couronne », puis sentier plat vers la Kleine Scheidegg face à l’Eiger."},
{i:210,c:"som",r:"al",k:"AI",t:"Kronberg",p:"Jakobsbad",g:"red",x:[47.295,9.339],d:"Téléphérique appenzellois, luge sur rails et vue sur tout l’Alpstein."},
{i:211,c:"som",r:"ro",k:"FR",t:"Moléson",p:"Gruyères",g:"red",x:[46.546,7.018],d:"Le sommet des Fribourgeois : funiculaire puis téléphérique, Préalpes à perte de vue."},
{i:212,c:"som",r:"gr",k:"GR",t:"Diavolezza",p:"Pontresina",g:"red",x:[46.393,9.973],d:"La loge d’honneur face aux glaciers du massif de la Bernina (2978 m)."},
{i:213,c:"som",r:"ti",k:"TI",t:"Cardada–Cimetta",p:"Locarno",g:"red",x:[46.194,8.780],d:"Du point le plus bas de Suisse (lac Majeur, 193 m) au balcon panoramique en 20 minutes."},
{i:214,c:"som",r:"al",k:"OW",t:"Titlis",p:"Engelberg",g:"red",x:[46.772,8.438],d:"Téléphérique tournant, grotte de glace et le pont suspendu le plus haut d’Europe (3041 m)."},

/* --- v7 : lacs, gorges & bains --- */
{i:215,c:"eau",r:"gr",k:"GR",t:"Lej da Staz",p:"St. Moritz / Celerina",g:"inc",x:[46.489,9.855],d:"Le bain sauvage de l’Engadine, caché dans les mélèzes (20° l’été, si si)."},
{i:216,c:"eau",r:"ro",k:"VS",t:"Lac de Champex",p:"Val d’Entremont",g:"inc",x:[46.029,7.116],d:"Le « petit Canada » valaisan : barques, mélèzes et Grand Combin."},
{i:217,c:"eau",r:"ro",k:"VS",t:"Lac Bleu d’Arolla",p:"La Gouille, val d’Arolla",g:"inc",x:[46.054,7.479],d:"Un bleu qu’on croirait retouché — 20 minutes depuis l’arrêt du car postal."},
{i:218,c:"eau",r:"al",k:"UR",t:"Göscheneralpsee",p:"Göschenen",g:"inc",x:[46.647,8.481],d:"Le bout du monde uranais : barrage, glacier de la Damma et grand silence."},
{i:219,c:"eau",r:"al",k:"GL",t:"Berglistüber",p:"Col du Klausen",g:"inc",x:[46.880,8.940],d:"La cascade derrière laquelle on peut passer — arrêt du car postal du Klausen."},
{i:220,c:"eau",r:"ro",k:"VS",t:"Cascade de la Pissevache",p:"Vernayaz",g:"inc",x:[46.119,7.033],d:"114 mètres chantés par Goethe, à deux pas de la gare."},
{i:221,c:"eau",r:"al",k:"BE",t:"Chutes de l’Engstligen",p:"Adelboden",g:"red",x:[46.465,7.553],d:"Les plus hautes chutes doubles de Suisse, et l’alpage suspendu au-dessus."},
{i:222,c:"eau",r:"al",k:"BE",t:"Gorges de Douanne",p:"Douanne, lac de Bienne",g:"inc",x:[47.096,7.157],d:"Descente ombragée dans la gorge jusqu’au village vigneron, face à l’île St-Pierre."},
{i:223,c:"eau",r:"ro",k:"VD",t:"Gorges du Chauderon",p:"Montreux",g:"inc",x:[46.440,6.910],d:"Un canyon romantique caché à 10 minutes des palaces de la Riviera."},
{i:224,c:"eau",r:"ro",k:"VD",t:"Gorges de Covatannaz",p:"Vuiteboeuf → Ste-Croix",g:"inc",x:[46.809,6.544],d:"La faille préférée du Nord vaudois, sous la ligne Yverdon–Ste-Croix."},
{i:225,c:"eau",r:"al",k:"VS",t:"Bains de Brigerbad",p:"Brigue",g:"inc",x:[46.303,7.939],d:"Thermes en plein air, grotte chaude et toboggan de 182 m (entrée payante)."},
{i:226,c:"eau",r:"ro",k:"VD",t:"Bains de Lavey",p:"Lavey-les-Bains",g:"inc",x:[46.203,7.022],d:"La source la plus chaude de Suisse (62°) dans un méandre du Rhône."},
{i:227,c:"eau",r:"ro",k:"GE",t:"Bains des Pâquis",p:"Genève",g:"inc",x:[46.213,6.152],d:"La jetée populaire de 1932 : baignade face au jet d’eau, entrée à deux francs."},
{i:228,c:"eau",r:"ti",k:"TI",t:"Îles de Brissago",p:"Lac Majeur",g:"pay",x:[46.132,8.736],d:"L’île-jardin subtropicale : eucalyptus, lotus et baignade (bateau, mars–oct.)."},
{i:229,c:"eau",r:"ro",k:"FR",t:"Île d’Ogoz",p:"Lac de la Gruyère",g:"inc",x:[46.695,7.103],d:"Deux tours et une chapelle sur un îlot — à pied à l’étiage, en paddle sinon."},

/* --- v7 : randonnées --- */
{i:230,c:"ran",r:"al",k:"UR",t:"Voie Suisse",p:"Rütli → Bauen",g:"inc",x:[46.936,8.578],d:"Le tronçon fondateur du sentier du 700e, à fleur du lac d’Uri — retour en bateau."},
{i:231,c:"ran",r:"al",k:"VS",t:"Pont suspendu d’Aletsch",p:"Riederalp / Belalp",g:"red",x:[46.378,8.007],d:"La boucle de la Massa : 124 m de passerelle sous le plus grand glacier des Alpes."},
{i:232,c:"ran",r:"ro",k:"BE",t:"Combe Grède",p:"Villeret",g:"inc",x:[47.142,7.067],d:"La gorge sauvage qui grimpe vers le Chasseral — échelles, chamois et cirque rocheux."},
{i:233,c:"ran",r:"al",k:"VS",t:"Binntal",p:"Binn",g:"inc",x:[46.364,8.185],d:"La vallée des cristaux : un tunnel étroit, un village de pierre, des minéraux plein les yeux."},
{i:234,c:"ran",r:"al",k:"VS",t:"Höhenweg du Lötschental",p:"Lauchernalp → Fafleralp",g:"red",x:[46.419,7.811],d:"Le balcon de la « vallée magique », face au Bietschhorn (3–4 h)."},
{i:235,c:"ran",r:"gr",k:"GR",t:"Plateau de la Greina",p:"entre Vrin et le val Blenio",g:"pay",x:[46.628,9.000],d:"La « toundra suisse » à 2200 m : deux jours, une cabane, aucun bruit (bus alpin, été)."},
{i:236,c:"ran",r:"gr",k:"GR",t:"Sentier du glacier de Morteratsch",p:"Pontresina",g:"inc",x:[46.434,9.932],d:"Plat depuis la gare jusqu’au front du glacier — les panneaux racontent son recul, saisissant."},

/* --- v7 : fêtes & traditions --- */
{i:237,c:"fet",r:"ro",k:"GE",t:"Fête de l’Escalade",p:"Genève",x:[46.201,6.146],d:"Course déguisée, cortège en armures et marmites en chocolat qu’on fracasse (décembre)."},
{i:238,c:"fet",r:"al",k:"LU",t:"Fasnacht de Lucerne",p:"Lucerne",x:[47.050,8.303],d:"Le carnaval le plus déjanté de Suisse centrale : Guggenmusik dès 5 h du matin (février)."},
{i:239,c:"fet",r:"gr",k:"GR",t:"Chalandamarz",p:"Engadine",x:[46.773,10.148],d:"Le 1er mars, les enfants chassent l’hiver à coups de cloches — la fête de Schellen-Ursli."},
{i:240,c:"fet",r:"ti",k:"TI",t:"Processions de Mendrisio",p:"Mendrisio",x:[45.871,8.982],d:"Jeudi et Vendredi saints : la ville s’éclaire de toiles translucides (UNESCO)."},
{i:241,c:"fet",r:"ch",k:"CH",t:"Fête fédérale de yodel",p:"lieu itinérant, tous les 3 ans",x:[46.810,8.270],d:"Yodel, cor des Alpes et lancer de drapeau — la Suisse profonde en chœur."},
{i:242,c:"fet",r:"ro",k:"VS",t:"Festival de cor des Alpes",p:"Nendaz",x:[46.178,7.298],d:"Le concours international sur l’alpage de Tracouet (juillet)."},
{i:243,c:"fet",r:"ro",k:"BE",t:"Foire de Chaindon",p:"Reconvilier",x:[47.233,7.220],d:"L’une des plus grandes foires agricoles d’Europe : 400 chevaux, le Jura bernois endimanché (sept.)."},
{i:244,c:"fet",r:"al",k:"ZH",t:"Räbeliechtli",p:"Richterswil",x:[47.207,8.707],d:"26 tonnes de raves sculptées et illuminées défilent au bord du lac (novembre)."},
{i:245,c:"fet",r:"al",k:"BS",t:"Herbstmesse de Bâle",p:"Bâle",x:[47.562,7.594],d:"La plus vieille fête foraine de Suisse (1471) : grande roue devant la cathédrale (oct.–nov.)."},

/* --- v7 : gastronomie --- */
{i:246,c:"gas",r:"ro",k:"BE",t:"Camille Bloch",p:"Courtelary",g:"inc",x:[47.178,7.072],d:"Ragusa et Torino : le chocolat du Jura bernois, visite et atelier."},
{i:247,c:"gas",r:"al",k:"LU",t:"Willisauer Ringli",p:"Willisau",x:[47.120,7.994],d:"Le biscuit le plus dur du pays — on le casse sur le coin de la table, c’est la règle."},
{i:248,c:"gas",r:"ro",k:"VD",t:"L’Etivaz AOP",p:"Pays-d’Enhaut",g:"inc",x:[46.428,7.139],d:"Le fromage cuit au feu de bois dans 130 chalets d’alpage — caves visitables."},
{i:249,c:"gas",r:"ro",k:"VD",t:"Vacherin Mont-d’Or",p:"Vallée de Joux",x:[46.635,6.300],d:"Le fromage à la boîte d’épicéa, à la cuillère (sept.–avril)."},
{i:250,c:"gas",r:"al",k:"GL",t:"Schabziger",p:"Glaris",x:[47.036,9.063],d:"Le fromage vert aux herbes, plus ancienne marque de Suisse (1463)."},
{i:251,c:"gas",r:"ro",k:"FR",t:"La Maison du Gruyère",p:"Pringy-Gruyères",g:"inc",x:[46.581,7.079],d:"On regarde naître les meules dès 9 h — et mûrir les 7000 autres en cave."},
{i:252,c:"gas",r:"al",k:"AI",t:"Biber appenzellois",p:"Appenzell",x:[47.328,9.405],d:"Pain d’épices au miel fourré de massepain, décoré comme une façade peinte."},

/* --- v7 : culture & musées --- */
{i:253,c:"cul",r:"ro",k:"VD",t:"Avenches",p:"Broye",g:"inc",x:[46.881,7.043],d:"L’amphithéâtre de la capitale romaine de l’Helvétie — opéra sous les étoiles en été."},
{i:254,c:"cul",r:"ro",k:"VD",t:"Abbatiale de Payerne",p:"Payerne",g:"inc",x:[46.822,6.938],d:"La plus grande église romane de Suisse, mille ans d’échos."},
{i:255,c:"cul",r:"al",k:"AG",t:"Château de Lenzbourg",p:"Lenzburg",g:"inc",x:[47.385,8.177],d:"Forteresse millénaire des Habsbourg, entre donjon et vergers."},
{i:256,c:"cul",r:"al",k:"AG",t:"Château de Habsbourg",p:"Habsburg",g:"inc",x:[47.463,8.185],d:"La modeste tour d’où partit la dynastie qui régna sur un empire."},
{i:257,c:"cul",r:"ro",k:"VS",t:"Fondation Gianadda",p:"Martigny",g:"inc",x:[46.095,7.072],d:"Expositions de calibre mondial entre vestiges romains et voitures anciennes."},
{i:258,c:"cul",r:"ro",k:"NE",t:"Laténium",p:"Hauterive",g:"inc",x:[47.008,6.980],d:"50 000 ans d’archéologie au bord du lac, villages lacustres UNESCO."},
{i:259,c:"cul",r:"al",k:"TG",t:"Chartreuse d’Ittingen",p:"Warth",g:"inc",x:[47.559,8.867],d:"Cloître, jardins et silence d’une chartreuse préservée, à l’écart de tout."},
{i:260,c:"cul",r:"gr",k:"GR",t:"Château de Tarasp",p:"Basse-Engadine",g:"inc",x:[46.779,10.264],d:"Le château de conte perché, visible de toute la vallée."},
{i:261,c:"cul",r:"al",k:"BS",t:"Musée Tinguely",p:"Bâle",g:"inc",x:[47.559,7.613],d:"Les machines folles, bruyantes et poétiques de Jean Tinguely au bord du Rhin."},
{i:262,c:"cul",r:"ro",k:"JU",t:"Grottes de Réclère",p:"Ajoie",g:"inc",x:[47.467,7.056],d:"Stalagmites géantes puis sentier de dinosaures grandeur nature, au fond de l’Ajoie."},
{i:263,c:"cul",r:"al",k:"LU",t:"Jardin des Glaciers",p:"Lucerne",x:[47.058,8.312],d:"Marmites glaciaires, labyrinthe de miroirs de 1896 — et le Lion juste à côté."},
{i:264,c:"cul",r:"al",k:"UR",t:"Altdorf & la Tellskapelle",p:"Uri",g:"inc",x:[46.881,8.644],d:"La statue de Guillaume Tell, puis la chapelle peinte au bord de l’Urnersee."},

/* --- v7 : insolite --- */
{i:265,c:"ins",r:"ti",k:"TI",t:"Pont tibétain Carasc",p:"Monte Carasso",g:"red",x:[46.182,8.993],d:"270 m de passerelle vertigineuse et le hameau restauré de Curzútt."},
{i:266,c:"ins",r:"ti",k:"TI",t:"Swissminiatur",p:"Melide",g:"inc",x:[45.955,8.948],d:"Toute la Suisse au 1:25 — repérez ce qui manque encore à votre liste."},
{i:267,c:"ins",r:"ro",k:"VS",t:"Barryland",p:"Martigny",g:"inc",x:[46.099,7.061],d:"Les St-Bernard du Grand-St-Bernard : chiots, musée et câlins."},
{i:268,c:"ins",r:"al",k:"SZ",t:"Sattel-Hochstuckli",p:"Sattel",g:"red",x:[47.097,8.661],d:"Télécabine tournante, pont suspendu de 374 m et luge d’été."},
{i:269,c:"ins",r:"al",k:"LU",t:"Fräkigaudi",p:"Pilatus / Fräkmüntegg",g:"red",x:[46.991,8.259],d:"La plus longue luge d’été de Suisse : 1350 m de virages sous le Pilatus."},
{i:270,c:"ins",r:"al",k:"BE",t:"Grottes de St-Béat",p:"Lac de Thoune",g:"inc",x:[46.687,7.789],d:"Les grottes du dragon au-dessus du lac — légende, passerelles et cascades."},
{i:271,c:"ins",r:"al",k:"OW",t:"Nuit en igloo",p:"Engelberg (ou Zermatt…)",g:"pay",x:[46.820,8.401],d:"Dormir sous une voûte de neige sculptée, peaux de mouton comprises (hiver)."},
{i:272,c:"ins",r:"ro",k:"VD",t:"Montgolfières de Château-d’Oex",p:"Château-d’Oex",g:"pay",x:[46.475,7.131],d:"La capitale mondiale du ballon : festival en janvier, vols toute l’année."},
{i:273,c:"ins",r:"al",k:"BE",t:"Canyoning",p:"région d’Interlaken",g:"pay",x:[46.635,7.839],d:"Sauter, glisser et nager dans les gorges, combinaison et guide compris (été)."},
{i:274,c:"ins",r:"al",k:"BE",t:"Parapente biplace",p:"Interlaken",g:"pay",x:[46.686,7.863],d:"Décoller du Beatenberg et planer face à Eiger, Mönch et Jungfrau."},

/* --- v10 : lacs de montagne & panoramas accessibles en transports --- */
{i:275,c:"eau",r:"ro",k:"NE",t:"Lac des Taillères",p:"La Brévine",g:"inc",x:[46.982,6.590],d:"Le lac du val de La Brévine, la « Sibérie de la Suisse » : miroir à mélèzes l’été, patinoire naturelle quand il gèle. Car postal depuis Fleurier ou Le Locle — le plus proche de La Chaux-de-Fonds."},
{i:276,c:"som",r:"ro",k:"NE",t:"Tête de Ran & Mont Racine",p:"Montagnes neuchâteloises",g:"inc",x:[47.058,6.808],d:"La crête-balcon à deux pas de La Chaux-de-Fonds : tout l’arc alpin d’un côté, les lacs de l’autre. Car postal ou petite montée à pied ; raquettes l’hiver."},
{i:277,c:"eau",r:"al",k:"VS",t:"Stellisee",p:"Zermatt",g:"red",x:[46.017,7.795],m:[6,7,8,9,10],d:"Le Cervin qui se mire dans l’eau — LA carte postale du Valais. Funiculaire de Sunnegga puis 25 min de marche."},
{i:278,c:"eau",r:"al",k:"SZ",t:"Wägitalersee",p:"Innerthal",g:"inc",x:[47.075,8.880],m:[4,5,6,7,8,9,10,11],d:"Un fjord turquoise presque secret à une heure de Zurich. Car postal jusqu’à Innerthal, tour du lac tranquille."},
{i:279,c:"eau",r:"al",k:"NW",t:"Bannalpsee",p:"Oberrickenbach",g:"red",x:[46.867,8.437],m:[6,7,8,9,10],d:"Petit téléphérique rustique puis un lac de barrage posé sous les parois, buvette d’alpage au bord de l’eau."},
{i:280,c:"eau",r:"al",k:"GL",t:"Oberblegisee",p:"Luchsingen",g:"red",x:[46.983,9.018],m:[6,7,8,9,10],d:"Le lac suspendu du Glarnerland, d’un bleu profond : funiculaire de Luchsingen puis 1 h de marche."},
{i:281,c:"eau",r:"ro",k:"VS",t:"Lac de Salanfe",p:"Van d’en Haut",g:"inc",x:[46.150,6.987],m:[6,7,8,9,10],d:"Grand lac d’altitude cerné de sommets, au bout d’un car postal depuis Salvan puis 1 h de montée."},
{i:282,c:"eau",r:"ro",k:"VD",t:"Lac Retaud",p:"Les Diablerets",g:"inc",x:[46.353,7.208],m:[6,7,8,9,10],d:"Miroir des Diablerets à deux pas de l’arrêt du car postal, buvette et barque en bois."},
{i:283,c:"eau",r:"ro",k:"VD",t:"Lac Lioson",p:"Les Mosses",g:"red",x:[46.400,7.147],m:[6,7,8,9,10],d:"Cirque parfait au-dessus des Mosses : télésiège puis 20 min, ou 1 h à pied. Auberge au bord de l’eau."},
{i:284,c:"eau",r:"al",k:"BE",t:"Grimselsee & Totensee",p:"Col du Grimsel",g:"inc",x:[46.567,8.335],m:[6,7,8,9,10],d:"Deux lacs de barrage d’un vert minéral au sommet du col, où passe le car postal Meiringen–Gletsch."},
{i:285,c:"eau",r:"gr",k:"GR",t:"Lai da Marmorera",p:"Route du Julier",g:"inc",x:[46.502,9.632],m:[4,5,6,7,8,9,10,11],d:"Le lac turquoise de la route du Julier, mélèzes et sommets — car postal Coire–St-Moritz."},
{i:286,c:"eau",r:"gr",k:"GR",t:"Zervreilasee",p:"Vals",g:"inc",x:[46.615,9.048],m:[6,7,8,9,10],d:"Au bout de la vallée de Vals, sous la pyramide du Zervreilahorn — car postal depuis les thermes."},
{i:287,c:"eau",r:"ti",k:"TI",t:"Lago dei Cavagnöö",p:"Robiei, Val Bavona",g:"red",x:[46.446,8.513],m:[6,7,8,9,10],d:"Le funiculaire de Robiei grimpe vers un plateau de lacs de barrage — le bout sauvage du Tessin."},
{i:288,c:"eau",r:"gr",k:"GR",t:"Partnunsee",p:"St. Antönien",g:"inc",x:[46.983,9.822],m:[6,7,8,9,10],d:"Le lac de baignade le plus haut du Prättigau, sous les Sulzfluh — car postal jusqu’à Partnun."},
{i:289,c:"eau",r:"al",k:"BE",t:"Seebergsee",p:"Diemtigtal",g:"inc",x:[46.545,7.497],m:[6,7,8,9,10],d:"Petit lac d’alpage dans la vallée protégée du Diemtigtal — car postal puis balade tranquille."},
{i:290,c:"eau",r:"ro",k:"VS",t:"Lac d’Emosson",p:"Finhaut",g:"red",x:[46.070,6.928],m:[6,7,8,9,10],d:"Immense barrage face au Mont-Blanc, empreintes de dinosaures à la clé — petit train à crémaillère VerticAlp depuis Le Châtelard."},
{i:291,c:"som",r:"al",k:"BE",t:"Harder Kulm",p:"Interlaken",g:"red",x:[46.699,7.879],m:[4,5,6,7,8,9,10,11],d:"Le funiculaire raide jusqu’au balcon d’Interlaken : les deux lacs turquoise et la Jungfrau en face."},
{i:292,c:"som",r:"al",k:"BE",t:"Niederhorn",p:"Beatenberg",g:"red",x:[46.717,7.750],m:[4,5,6,7,8,9,10,11],d:"Bouquetins au bord du sentier et vue plongeante sur le lac de Thoune — funiculaire puis télécabine."},

/* --- v13 : Jura & Neuchâtel, à deux pas de La Chaux-de-Fonds --- */
{i:293,c:"cul",r:"ro",k:"NE",t:"Moulins souterrains du Col-des-Roches",p:"Le Locle",g:"inc",x:[47.051,6.717],d:"Des moulins creusés dans la roche, actionnés par une rivière souterraine — unique en Europe, à dix minutes de La Chaux-de-Fonds (entrée payante)."},
{i:294,c:"cul",r:"ro",k:"NE",t:"Château des Monts",p:"Le Locle",g:"inc",x:[47.060,6.750],d:"Le musée d’horlogerie du Locle dans une maison de maître : automates, montres de légende et vue sur la ville UNESCO."},
{i:295,c:"cul",r:"ro",k:"NE",t:"Mines d’asphalte de La Presta",p:"Travers, Val-de-Travers",g:"inc",x:[46.930,6.658],d:"Des galeries exploitées pendant 250 ans — puis le jambon cuit dans l’asphalte, servi au restaurant de la mine."},
{i:296,c:"gas",r:"ro",k:"NE",t:"Maison de l’Absinthe",p:"Môtiers",g:"inc",x:[46.911,6.611],d:"La fée verte est née ici : musée dans l’ancienne préfecture qui jugeait les distillateurs clandestins, et dégustation."},
{i:297,c:"som",r:"ro",k:"BE",t:"Mont-Soleil",p:"Saint-Imier",g:"red",x:[47.155,6.990],d:"Le funiculaire depuis Saint-Imier jusqu’aux éoliennes et aux pâturages boisés, avec les Alpes au fond quand c’est dégagé."},
{i:298,c:"som",r:"ro",k:"VD",t:"Le Chasseron",p:"Sainte-Croix",g:"inc",x:[46.852,6.538],m:[5,6,7,8,9,10],d:"Le balcon du Jura vaudois : 360° des Alpes au lac de Neuchâtel, à une heure de marche des Rasses (bus depuis Sainte-Croix)."},
{i:299,c:"som",r:"ro",k:"VD",t:"Dent de Vaulion",p:"Vallée de Joux",g:"inc",x:[46.682,6.348],m:[5,6,7,8,9,10],d:"La falaise en forme de dent qui plonge sur la vallée de Joux — l’un des plus beaux panoramas du Jura."},
{i:300,c:"eau",r:"ro",k:"BE",t:"Gorges du Taubenloch",p:"Bienne / Frinvillier",g:"inc",x:[47.150,7.270],m:[4,5,6,7,8,9,10,11],d:"Le « trou des colombes » : un sentier taillé dans la gorge de la Suze, à deux pas de la gare de Bienne."},
{i:301,c:"ins",r:"ro",k:"JU",t:"Balade en roulotte",p:"Franches-Montagnes",g:"pay",x:[47.262,7.015],m:[5,6,7,8,9,10],d:"Une journée (ou une nuit) au pas d’un cheval des Franches-Montagnes, de pâturage en pâturage — à réserver."},
{i:302,c:"ins",r:"ro",k:"JU",t:"Canoë sur le Doubs",p:"Soubey / Goumois",g:"pay",x:[47.313,7.048],m:[6,7,8,9],d:"Descendre en canoë la rivière la plus sauvage de Suisse, entre falaises et forêts (location sur place, l’été)."},
{i:303,c:"cul",r:"ro",k:"NE",t:"Maison Blanche de Le Corbusier",p:"La Chaux-de-Fonds",g:"inc",x:[47.109,6.818],d:"La première maison du jeune Charles-Édouard Jeanneret, avant qu’il ne devienne Le Corbusier — visite le week-end."},
{i:304,c:"fet",r:"ro",k:"NE",t:"Fête des Vendanges",p:"Neuchâtel",g:"inc",x:[46.992,6.931],m:[9],d:"Le dernier week-end de septembre, toute la ville en fête : grand cortège, guinguettes et vin nouveau."},
{i:305,c:"gas",r:"ro",k:"JU",t:"Saint-Martin en Ajoie",p:"Porrentruy",g:"inc",x:[47.415,7.076],m:[11],d:"Le repas pantagruélique de novembre : tout le cochon en une dizaine de plats, du bouillon au totché. À réserver !"},
{i:306,c:"cul",r:"ro",k:"VD",t:"Fort de Pré-Giroud",p:"Vallorbe",g:"inc",x:[46.709,6.410],m:[4,5,6,7,8,9,10],d:"Une forteresse secrète déguisée en ferme, creusée dans la montagne en 1937 — dortoirs, canons et galeries."},
{i:307,c:"ins",r:"ro",k:"VD",t:"Juraparc",p:"Mont-d’Orzeires, Vallorbe",g:"inc",x:[46.696,6.320],d:"Ours, loups et bisons en semi-liberté sur les hauts du Jura, et une auberge au coin du feu (accès en bus limité, à vérifier)."},

/* --- v13 : Romandie --- */
{i:308,c:"vil",r:"ro",k:"VD",t:"Grandson",p:"Lac de Neuchâtel",g:"inc",x:[46.809,6.646],d:"Le château où Charles le Téméraire perdit son trésor en 1476, posé au bord du lac (entrée payante)."},
{i:309,c:"cul",r:"ro",k:"VS",t:"Abbaye de Saint-Maurice",p:"Saint-Maurice",g:"inc",x:[46.218,7.003],d:"Le plus ancien monastère d’Occident encore habité (515) et un trésor d’orfèvrerie à couper le souffle."},
{i:310,c:"ins",r:"ro",k:"VD",t:"Mines de sel de Bex",p:"Bex",g:"inc",x:[46.268,7.042],d:"En petit train au cœur de la montagne, dans les galeries où l’on extrait le sel depuis 1684 (entrée payante)."},
{i:311,c:"cul",r:"ro",k:"VD",t:"Villa « Le Lac » de Le Corbusier",p:"Corseaux",g:"inc",x:[46.463,6.826],m:[3,4,5,6,7,8,9,10,11],d:"La petite maison blanche au bord du Léman que Le Corbusier dessina pour ses parents (UNESCO)."},
{i:312,c:"gas",r:"ro",k:"VD",t:"Filets de perche au bord du Léman",p:"Riviera vaudoise",g:"inc",x:[46.461,6.843],d:"Le classique des terrasses lémaniques, avec un verre de chasselas face aux Dents-du-Midi."},
{i:313,c:"gas",r:"ro",k:"VD",t:"Malakoffs de Vinzel",p:"La Côte",g:"inc",x:[46.448,6.278],d:"Les beignets de gruyère rapportés, dit-on, de la guerre de Crimée — à manger à Vinzel, au milieu des vignes."},
{i:314,c:"fet",r:"ro",k:"VD",t:"Montreux Noël",p:"Montreux",g:"inc",x:[46.433,6.912],m:[11,12],d:"Marché de Noël sur les quais, maison du Père Noël aux Rochers-de-Naye et chalets illuminés au bord du lac."},
{i:315,c:"fet",r:"ro",k:"VD",t:"Paléo Festival",p:"Nyon",g:"inc",x:[46.395,6.235],m:[7],d:"Six jours de concerts géants au bord du Léman, l’un des plus grands festivals d’Europe — billets vendus très tôt."},
{i:316,c:"fet",r:"ti",k:"TI",t:"Festival du film de Locarno",p:"Piazza Grande, Locarno",g:"inc",x:[46.169,8.795],m:[8],d:"Le cinéma en plein air sur la Piazza Grande : 8000 spectateurs sous les étoiles, en août."},
{i:317,c:"fet",r:"ro",k:"VD",t:"Montreux Jazz Festival",p:"Montreux",g:"inc",x:[46.433,6.909],m:[7],d:"Deux semaines de musique au bord du lac, et des scènes gratuites tout le long des quais en juillet."},

/* --- v13 : Suisse alémanique --- */
{i:318,c:"ins",r:"al",k:"FR",t:"Papiliorama",p:"Kerzers / Chiètres",g:"inc",x:[46.975,7.204],d:"Une forêt tropicale sous bulle : papillons, colibris et paresseux — parfait quand il pleut (entrée payante)."},
{i:319,c:"fet",r:"al",k:"BL",t:"Chienbäse",p:"Liestal",g:"inc",x:[47.484,7.734],m:[2,3],d:"Le dimanche soir du carnaval, des chariots en flammes traversent la vieille ville sous la porte — saisissant."},
{i:320,c:"vil",r:"al",k:"SG",t:"Rapperswil",p:"Lac de Zurich",g:"inc",x:[47.226,8.818],d:"La ville des roses : château, roseraies et la plus longue passerelle en bois de Suisse, vers Hurden."},
{i:321,c:"vil",r:"al",k:"AG",t:"Baden",p:"Argovie",g:"inc",x:[47.477,8.308],d:"Vieille ville sur la Limmat et thermes FORTYSEVEN signés Mario Botta, avec bassins dehors face à la rivière."},
{i:322,c:"vil",r:"al",k:"ZH",t:"Eglisau",p:"Bord du Rhin",g:"inc",x:[47.577,8.522],d:"Le village vigneron sur le Rhin, sa promenade au bord de l’eau et son grand viaduc ferroviaire."},
{i:323,c:"vil",r:"al",k:"BE",t:"Thoune & son château",p:"Thoune",g:"inc",x:[46.759,7.628],d:"Le château aux quatre tourelles, la rue marchande à deux étages et les quais de l’Aar à la sortie du lac."},
{i:324,c:"vil",r:"al",k:"BE",t:"Château d’Oberhofen",p:"Lac de Thoune",g:"inc",x:[46.731,7.668],m:[5,6,7,8,9,10],d:"Le château de conte de fées les pieds dans le lac, ses jardins — et le bateau à vapeur Blümlisalp pour y aller."},
{i:325,c:"vil",r:"al",k:"BE",t:"Spiez",p:"Lac de Thoune",g:"inc",x:[46.689,7.684],d:"La baie de Spiez, son château et ses vignes : la carte postale du lac de Thoune."},
{i:326,c:"cul",r:"al",k:"AG",t:"Château de Hallwyl",p:"Seengen, lac de Hallwil",g:"inc",x:[47.311,8.193],m:[4,5,6,7,8,9,10],d:"Un château d’eau posé sur deux îles et entouré de douves — l’un des plus beaux de Suisse."},
{i:327,c:"cul",r:"al",k:"BS",t:"Kunstmuseum Basel",p:"Bâle",g:"inc",x:[47.554,7.594],d:"La plus ancienne collection d’art publique au monde, de Holbein à Picasso."},
{i:328,c:"cul",r:"al",k:"BE",t:"Palais fédéral",p:"Berne",g:"inc",x:[46.946,7.444],d:"Visite guidée gratuite du Parlement et de sa coupole (sur réservation), puis la terrasse face aux Alpes."},
{i:329,c:"ins",r:"al",k:"BE",t:"BärenPark",p:"Berne",g:"inc",x:[46.948,7.459],d:"Les ours de Berne dans leur parc au bord de l’Aar, juste en face de la vieille ville."},
{i:330,c:"cul",r:"al",k:"SZ",t:"Musée des chartes fédérales",p:"Schwytz",g:"inc",x:[47.022,8.653],d:"Le pacte de 1291, le vrai : le parchemin fondateur de la Suisse, à quelques centimètres de vous."},
{i:331,c:"gas",r:"al",k:"BE",t:"Fromagerie de démonstration de l’Emmental",p:"Affoltern i. E.",g:"inc",x:[47.065,7.735],d:"Voir naître l’emmental et ses trous, puis le goûter à l’auberge de la fromagerie."},
{i:332,c:"gas",r:"al",k:"ZG",t:"Zuger Kirschtorte",p:"Zoug",g:"inc",x:[47.169,8.516],d:"La tourte au kirsch inventée à Zoug en 1915, à déguster face au lac."},
{i:333,c:"tra",r:"al",k:"BE",t:"Lucerne–Interlaken Express",p:"Col du Brünig",g:"inc",x:[46.757,8.138],d:"Lacs turquoise, cascades et crémaillère par le Brünig — l’une des plus belles lignes du pays, en deux heures."},
{i:336,c:"som",r:"al",k:"BE",t:"Stockhorn",p:"Erlenbach i. S.",g:"red",x:[46.694,7.540],m:[5,6,7,8,9,10],d:"Téléphérique au-dessus d’un lac de montagne, puis une pyramide rocheuse face aux 4000 de l’Oberland."},
{i:339,c:"som",r:"al",k:"SG",t:"Chäserrugg",p:"Toggenburg",g:"red",x:[47.154,9.313],d:"Le restaurant en bois d’Herzog & de Meuron au bord de la falaise des Churfirsten, au-dessus du Walensee."},
{i:340,c:"som",r:"al",k:"VS",t:"Eggishorn",p:"Fiesch",g:"red",x:[46.427,8.093],m:[6,7,8,9,10],d:"La vue la plus spectaculaire sur le glacier d’Aletsch, de bout en bout, à 2869 m."},
{i:347,c:"vil",r:"al",k:"VS",t:"Saas-Fee",p:"Vallée de Saas",g:"inc",x:[46.109,7.927],d:"La « perle des Alpes », sans voitures, au milieu d’un cirque de sommets de plus de 4000 m."},
{i:349,c:"ran",r:"al",k:"BE",t:"Eiger Trail",p:"Grindelwald",g:"red",x:[46.588,7.990],m:[7,8,9,10],d:"Au pied de la face nord de l’Eiger, de la gare d’Eigergletscher à Alpiglen (2 à 3 h, surtout en descente)."},
{i:351,c:"ins",r:"al",k:"BE",t:"Via ferrata Mürren–Gimmelwald",p:"Mürren",g:"pay",x:[46.560,7.892],m:[6,7,8,9,10],d:"Câbles, échelles et pont népalais à 600 m au-dessus de la vallée de Lauterbrunnen (équipement ou guide requis)."},
{i:352,c:"ins",r:"al",k:"BE",t:"Luge du Faulhorn",p:"Grindelwald",g:"red",x:[46.676,8.015],m:[12,1,2,3],d:"La « Big Pintenfritz » : 15 km de luge du Faulhorn à Grindelwald, l’une des plus longues pistes d’Europe."},
{i:357,c:"eau",r:"al",k:"SG",t:"Chutes de la Thur",p:"Unterwasser, Toggenburg",g:"inc",x:[47.199,9.320],m:[5,6,7,8,9,10],d:"La rivière tombe en trois paliers, à vingt minutes de marche du village d’Unterwasser."},
{i:358,c:"eau",r:"al",k:"BE",t:"Chutes de la Simme",p:"Lenk",g:"inc",x:[46.428,7.462],m:[5,6,7,8,9,10],d:"Les cascades au fond du Simmental et l’auberge au pied des chutes, en bus ou à pied depuis la Lenk."},
{i:365,c:"eau",r:"al",k:"VS",t:"Thermes de Loèche-les-Bains",p:"Leukerbad",g:"inc",x:[46.379,7.627],d:"Les plus grands bains alpins : près de 4 millions de litres d’eau chaude par jour, face aux parois de la Gemmi."},
{i:371,c:"vil",r:"al",k:"AR",t:"Trogen",p:"Appenzell Rhodes-Extérieures",g:"inc",x:[47.408,9.464],d:"La place aux palais des marchands de toile, et le petit train rouge qui monte de St-Gall à travers les collines."},

/* --- v13 : Tessin, Grisons, Valais --- */
{i:337,c:"som",r:"ti",k:"TI",t:"Monte Tamaro",p:"Rivera",g:"red",x:[46.105,8.866],m:[4,5,6,7,8,9,10,11],d:"L’église de pierre de Mario Botta suspendue sur le vide, et une luge d’été d’un kilomètre."},
{i:338,c:"som",r:"ti",k:"TI",t:"Monte Brè",p:"Lugano",g:"red",x:[46.015,8.989],d:"Le funiculaire vers « la montagne la plus ensoleillée de Suisse » et le village de Brè, aux murs peints."},
{i:341,c:"vil",r:"ti",k:"TI",t:"Morcote",p:"Lac de Lugano",g:"inc",x:[45.923,8.917],d:"Élu plus beau village de Suisse : ruelles à arcades, escalier de 400 marches et jardin Scherrer."},
{i:342,c:"cul",r:"ti",k:"TI",t:"Madonna del Sasso",p:"Locarno",g:"inc",x:[46.175,8.794],d:"Le sanctuaire perché sur un rocher au-dessus de Locarno, par le funiculaire ou à pied dans la gorge."},
{i:343,c:"cul",r:"ti",k:"TI",t:"Monte Verità",p:"Ascona",g:"inc",x:[46.158,8.763],d:"La colline des utopistes du début du XXᵉ siècle : maison de thé, jardins et vue sur le lac Majeur."},
{i:344,c:"cul",r:"ti",k:"TI",t:"Musée Hermann Hesse",p:"Montagnola",g:"inc",x:[45.983,8.917],d:"Le village où l’écrivain vécut plus de quarante ans — musée intime, puis promenade sur ses pas."},
{i:345,c:"ran",r:"ti",k:"TI",t:"Sentier du châtaignier",p:"Malcantone",g:"inc",x:[46.043,8.860],m:[9,10,11],d:"Les châtaigneraies du Malcantone, dorées en octobre — grottos et marrons chauds en chemin."},
{i:346,c:"vil",r:"ti",k:"TI",t:"Sonogno",p:"Val Verzasca",g:"inc",x:[46.350,8.787],d:"Le dernier village de la Verzasca : maisons de pierre, musée de la vallée et la cascade de la Froda."},
{i:348,c:"vil",r:"gr",k:"GR",t:"St-Moritz",p:"Haute-Engadine",g:"inc",x:[46.498,9.838],d:"Le lac, la lumière d’Engadine et le chic d’antan — le tour du lac à pied en 1 h 30."},
{i:355,c:"ran",r:"gr",k:"GR",t:"Ski de fond en Engadine",p:"Pontresina / Sils",g:"inc",x:[46.475,9.870],m:[12,1,2,3],d:"Plus de 200 km de pistes sur les lacs gelés et dans les mélèzes — location et initiation sur place."},
{i:363,c:"cul",r:"gr",k:"GR",t:"Musée Segantini",p:"St-Moritz",g:"inc",x:[46.497,9.836],d:"Le triptyque « Devenir, Être, Disparaître » sous une coupole de pierre : la lumière de l’Engadine, peinte."},
{i:364,c:"ins",r:"gr",k:"GR",t:"Bob-taxi sur la piste olympique",p:"St-Moritz → Celerina",g:"pay",x:[46.495,9.845],m:[12,1,2],d:"La seule piste de bob naturelle du monde, retaillée chaque hiver dans la glace — en bob-taxi avec un pilote (cher, inoubliable)."},
{i:372,c:"ran",r:"gr",k:"GR",t:"Les mélèzes dorés d’Engadine",p:"Sils / Val Fex / Maloja",g:"inc",x:[46.420,9.740],m:[10,11],d:"Fin octobre, les mélèzes virent à l’or autour des lacs d’Engadine : la plus belle lumière de l’année."},

/* --- v13 : encore en Romandie --- */
{i:334,c:"tra",r:"ro",k:"VD",t:"Chemin de fer-musée Blonay–Chamby",p:"Blonay",g:"pay",x:[46.470,6.900],m:[5,6,7,8,9,10],d:"Des locomotives à vapeur centenaires dans les vignes au-dessus de Vevey (week-ends de mai à octobre)."},
{i:335,c:"tra",r:"ro",k:"VS",t:"Mont-Blanc Express",p:"Martigny → Le Châtelard",g:"inc",x:[46.083,6.977],d:"Le petit train rouge accroché aux falaises des gorges du Trient, entre la vallée du Rhône et Chamonix."},
{i:350,c:"ran",r:"ro",k:"VD",t:"Sentier des Toblerones",p:"Gland → Bassins",g:"inc",x:[46.440,6.250],m:[3,4,5,6,7,8,9,10,11],d:"Le long des « toblerones » antichars de 1940, devenus refuges à lézards, du bord du lac au pied du Jura."},
{i:353,c:"ins",r:"ro",k:"JU",t:"Chiens de traîneau",p:"Franches-Montagnes",g:"pay",x:[47.211,7.007],m:[12,1,2,3],d:"Une balade en traîneau tiré par des huskies dans les pâturages enneigés — magique à deux (sur réservation)."},
{i:354,c:"ran",r:"ro",k:"JU",t:"Raquettes aux Franches-Montagnes",p:"Saignelégier / Les Breuleux",g:"inc",x:[47.235,7.035],m:[12,1,2,3],d:"Pâturages boisés sous la neige, fermes isolées et fondue au retour : l’hiver jurassien dans toute sa douceur."},
{i:356,c:"fet",r:"ro",k:"FR",t:"Festival des lumières de Morat",p:"Morat / Murten",g:"inc",x:[46.929,7.118],m:[1],d:"En janvier, la vieille ville et les remparts deviennent un parcours d’installations lumineuses, à faire à la nuit tombée."},
{i:359,c:"eau",r:"ro",k:"FR",t:"Gorges de la Jogne",p:"Charmey → Broc",g:"inc",x:[46.612,7.130],m:[4,5,6,7,8,9,10,11],d:"Passerelles et tunnels le long d’une rivière turquoise — et la Maison Cailler au bout du chemin."},
{i:360,c:"eau",r:"ro",k:"VS",t:"Gorges du Trient",p:"Vernayaz",g:"inc",x:[46.136,7.037],m:[5,6,7,8,9,10],d:"Une passerelle accrochée dans une fente de 200 m de haut, juste à côté de la Pissevache (entrée payante)."},
{i:361,c:"gas",r:"ro",k:"VS",t:"Brisolée en Valais",p:"Fully / Valais central",g:"inc",x:[46.138,7.115],m:[9,10,11],d:"Châtaignes grillées, fromage d’alpage, fruits et moût : le repas d’automne valaisan, en terrasse dans les vignes."},
{i:362,c:"tra",r:"ro",k:"FR",t:"Train du chocolat",p:"Montreux → Gruyères → Broc",g:"pay",x:[46.488,7.044],m:[5,6,7,8,9,10],d:"Voiture Belle Époque, croissant au chocolat, Gruyères puis la chocolaterie Cailler — tout le programme en un train (réservation)."},
{i:366,c:"eau",r:"ro",k:"VD",t:"Bains d’Yverdon",p:"Yverdon-les-Bains",g:"inc",x:[46.771,6.649],d:"Les thermes les plus proches de chez vous : bassins extérieurs à 34°, même sous la neige."},
{i:367,c:"eau",r:"ro",k:"VS",t:"Bains de Saillon",p:"Saillon",g:"inc",x:[46.176,7.183],d:"Bassins thermaux en plein air au pied du bourg médiéval de Saillon et des vignes."},
{i:368,c:"vil",r:"ro",k:"BE",t:"La Neuveville",p:"Lac de Bienne",g:"inc",x:[47.065,7.096],d:"Un petit bourg médiéval à tours de défense, entre le lac de Bienne et les vignes."},
{i:369,c:"vil",r:"ro",k:"NE",t:"Neuchâtel : château & collégiale",p:"Neuchâtel",g:"inc",x:[46.993,6.928],d:"La ville de pierre jaune : collégiale, château et terrasse sur le lac et les Alpes."},
{i:370,c:"vil",r:"ro",k:"FR",t:"Romont",p:"Glâne",g:"inc",x:[46.696,6.918],d:"Le bourg médiéval sur sa colline et le Vitromusée, consacré à l’art du vitrail."},
{i:373,c:"gas",r:"ro",k:"NE",t:"Caves d’Auvernier",p:"Auvernier",g:"inc",x:[46.975,6.877],d:"Le village vigneron au bord du lac : caves ouvertes, œil-de-perdrix — et le non-filtré en janvier."}
];

/* Saisons : mois (1–12) où l'idée est réellement faisable — dates de fêtes,
   cols et remontées ouverts, saison de navigation ou de baignade.
   Pas d'entrée = faisable toute l'année. Indicatif, à vérifier avant de partir. */
const SEASONS = {
  /* fêtes & traditions */
  61:[2,3], 62:[4], 63:[12], 64:[1,12], 65:[2,3], 66:[9,10], 67:[5,6,7,8,9],
  68:[4,5,6,7,8,9,10], 69:[3,4,5,9,10], 70:[11], 71:[10], 72:[8],
  140:[11,12], 141:[5], 142:[1,2,3,9,10,11,12], 150:[8], 237:[12], 238:[2,3],
  239:[3], 240:[3,4], 241:[6,7], 242:[7], 243:[9], 244:[11], 245:[10,11],
  /* gastronomie */
  77:[4,5,6,7,8,9], 80:[4,5,6,7,8,9,10], 143:[9,10], 144:[10], 249:[1,2,3,4,9,10,11,12],
  /* trains, cars postaux & bateaux */
  22:[6,7,8,9,10], 24:[5,6,7,8,9,10,11], 25:[6,7,8,9,10], 27:[4,5,6,7,8,9,10,11],
  28:[6,7,8,9,10], 139:[4,5,6,7,8,9,10], 200:[5,6,7,8,9], 203:[6,7,8,9,10], 204:[6,7,8,9,10],
  /* sommets & cols */
  35:[4,5,6,7,8,9,10,11], 37:[4,5,6,7,8,9,10], 120:[6,7,8,9,10], 121:[5,6,7,8,9,10],
  181:[6,7,8,9,10], 208:[6,7,8,9,10],
  /* lacs, gorges & bains */
  47:[5,6,7,8,9,10], 48:[6,7,8,9,10], 50:[4,5,6,7,8,9,10], 51:[4,5,6,7,8,9,10],
  106:[6,7,8,9,10], 107:[6,7,8,9,10], 111:[4,5,6,7,8,9,10], 165:[5,6,7,8,9,10],
  166:[5,6,7,8,9,10], 169:[6,7,8,9,10], 170:[6,7,8,9,10], 171:[6,7,8,9,10],
  172:[6,7,8,9], 175:[6,7,8,9,10], 177:[5,6,7,8,9,10], 183:[6,7,8,9,10],
  218:[6,7,8,9,10], 219:[6,7,8,9,10], 222:[4,5,6,7,8,9,10], 225:[5,6,7,8,9,10],
  228:[3,4,5,6,7,8,9,10],
  /* randonnées */
  55:[6,7,8,9,10], 56:[7,8,9,10], 57:[6,7,8,9,10], 58:[6,7,8,9,10],
  118:[5,6,7,8,9,10], 119:[4,5,6,7,8,9,10,11], 179:[6,7,8,9,10], 180:[6,7,8,9,10],
  231:[6,7,8,9,10], 232:[7,8,9,10], 234:[7,8,9,10], 235:[7,8,9],
  /* culture */
  86:[4,5,6,7,8,9,10], 88:[5,6,7,8,9,10], 91:[6,7,8,9,10], 262:[4,5,6,7,8,9,10,11],
  /* insolite */
  92:[5,6,7,8,9,10], 93:[6,7,8,9,10], 94:[6,7,8,9], 97:[6,7,8,9], 98:[1,2,3,12],
  100:[6,7,8,9], 146:[3,4,5,6,7,8,9,10,11], 147:[5,6,7,8,9,10], 148:[5,6,7,8,9,10],
  266:[3,4,5,6,7,8,9,10,11], 269:[5,6,7,8,9,10], 270:[4,5,6,7,8,9,10], 271:[1,2,3,12], 273:[5,6,7,8,9]
};
for (const it of ITEMS) if (SEASONS[it.i]) it.m = SEASONS[it.i];

/* Mots-clés de recherche : « lac de montagne / altitude / baignade » ne figure pas
   toujours dans le texte — on tague les lacs alpins (anciens et nouveaux) pour qu'ils
   remontent quand on cherche « lac montagne », « baignade », etc. */
const LACS_MONTAGNE = [41,43,44,45,101,102,103,104,105,106,107,108,109,169,170,172,175,
  215,216,217,218,275,277,278,279,280,281,282,283,284,285,286,287,288,289,290];
for (const it of ITEMS) if (LACS_MONTAGNE.includes(it.i)) it.kw = "lac montagne altitude baignade " + (it.kw || "");

/* ================= tags pour les suggestions ================= */
/* Bien par temps de pluie : intérieur, thermes, grottes, dégustations */
const RAIN_OK = new Set([
  83,84,85,87,91,123,124,125,126,127,128,131,132,133,160,255,257,258,261,262,      // culture
  73,74,75,76,78,79,82,145,161,162,163,246,247,248,249,250,251,252,                 // gastronomie
  53,110,111,176,225,226,                                                           // thermes & grottes
  96,267,270,                                                                       // insolite couvert
  293,294,295,296,303,306,308,309,310,311,318,321,326,327,328,330,331,332,342,344,363,365,366,367,370   // v13
]);
/* Demande de l'effort : marche soutenue, montée, aventure */
const ACTIVE = new Set([39,44,103,108,175,208,280,281,22,92,95,100,148,232,235,271,273,274,
  298,302,349,351,352,354,355,364]);
/* Particulièrement romantique à deux */
const ROMANTIC = new Set([2,5,12,13,31,36,42,45,53,54,89,96,100,105,110,114,135,139,147,153,159,
  184,200,216,226,228,229,271,272,275,277,
  301,312,316,320,324,326,337,341,343,353,361,362,365,366,372,373]);
/* Gourmand en route (en plus de la catégorie gastronomie) */
const GOURMAND = new Set([29,73,81,104,135,145,153,162,295,362]);
/* Pour la liste « à emporter » */
const CAVES = new Set([111,176,262,270,293,295,310]);
const BATHS = new Set([53,110,225,226,227,321,365,366,367]);
const NIGHT = new Set([63,64,98,159,316,319,356]);

/* ================= gares de départ ================= */
const STATIONS = [
  ["Aarau",47.391,8.051],["Bâle",47.547,7.590],["Bellinzone",46.195,9.030],["Berne",46.949,7.439],
  ["Bienne",47.133,7.243],["Brigue",46.319,7.988],["Coire",46.853,9.529],["Delémont",47.362,7.344],
  ["Fribourg",46.803,7.151],["Genève",46.210,6.142],["Interlaken",46.690,7.869],["La Chaux-de-Fonds",47.100,6.826],
  ["Lausanne",46.517,6.629],["Le Locle",47.057,6.749],["Locarno",46.172,8.801],["Lucerne",47.050,8.310],
  ["Lugano",46.005,8.947],["Martigny",46.106,7.073],["Montreux",46.435,6.910],["Neuchâtel",46.997,6.936],
  ["Olten",47.352,7.908],["Porrentruy",47.416,7.075],["Saignelégier",47.255,6.995],["Schaffhouse",47.698,8.633],
  ["Sion",46.227,7.359],["St-Gall",47.423,9.370],["Thoune",46.755,7.630],["Winterthour",47.500,8.724],
  ["Yverdon-les-Bains",46.782,6.641],["Zoug",47.174,8.515],["Zurich",47.378,8.540]
];
/* Ancien ordre (v1–v12) : sert à migrer le point de départ déjà choisi dans « Demain ? » */
const STATIONS_V1 = [
  ["Bâle",47.547,7.590],["Berne",46.949,7.439],["Bienne",47.133,7.243],["Coire",46.853,9.529],
  ["Delémont",47.362,7.344],["Fribourg",46.803,7.151],["Genève",46.210,6.142],["Interlaken",46.690,7.869],
  ["La Chaux-de-Fonds",47.100,6.826],["Lausanne",46.517,6.629],["Lucerne",47.050,8.310],["Lugano",46.005,8.947],
  ["Neuchâtel",46.997,6.936],["Porrentruy",47.416,7.075],["Saignelégier",47.255,6.995],["Sion",46.227,7.359],
  ["St-Gall",47.423,9.370],["Zurich",47.378,8.540]
];

/* ================= fêtes à date ================= */
/* Chaque règle renvoie, pour une année, la liste des fenêtres [début, fin].
   approx = date usuelle, à confirmer sur le programme officiel. */
const d0 = (y, m, d) => new Date(y, m - 1, d, 12);
const plusJ = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
function easter(y){                                       // Pâques (calendrier grégorien)
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return d0(y, mo, da);
}
function nthWeekday(y, m, wd, n){                         // m : 1–12 · wd : 0 = dimanche · n : 1..5, ou -1 = dernier
  if (n > 0){ const d = d0(y, m, 1); d.setDate(1 + (wd - d.getDay() + 7) % 7 + 7 * (n - 1)); return d; }
  const d = new Date(y, m, 0, 12); d.setDate(d.getDate() - (d.getDay() - wd + 7) % 7); return d;
}
const notSunday = d => d.getDay() === 0 ? plusJ(d, -1) : d;
const EVENT_RULES = {
  61:  { when: y => { const e = easter(y); return [[plusJ(e, -41), plusJ(e, -39)]]; }, note: "Morgestraich le lundi à 4 h du matin" },
  238: { when: y => { const e = easter(y); return [[plusJ(e, -52), plusJ(e, -47)]]; }, note: "dès le jeudi gras, 5 h du matin" },
  65:  { approx: true, when: y => { const e = easter(y); return [[d0(y, 2, 3), plusJ(e, -47)]]; } },
  240: { when: y => { const e = easter(y); return [[plusJ(e, -3), plusJ(e, -2)]]; }, note: "processions le soir" },
  239: { when: y => [[d0(y, 3, 1), d0(y, 3, 1)]] },
  62:  { approx: true, when: y => { let d = nthWeekday(y, 4, 1, 3); if (+d === +plusJ(easter(y), 1)) d = plusJ(d, 7); return [[d, d]]; }, note: "Böögg à 18 h" },
  141: { when: y => { const d = nthWeekday(y, 5, 0, 1); return [[d, d]]; } },
  69:  { approx: true, when: y => { const s = nthWeekday(y, 5, 6, 1); return [[s, plusJ(s, 1)]]; }, note: "finale nationale à Aproz" },
  242: { approx: true, when: y => { const s = nthWeekday(y, 7, 6, -1); return [[s, plusJ(s, 1)]]; } },
  72:  { when: y => [[d0(y, 8, 1), d0(y, 8, 1)]] },
  150: { approx: true, when: y => { const s = nthWeekday(y, 8, 6, 2); return [[plusJ(s, -1), plusJ(s, 1)]]; } },
  243: { approx: true, when: y => { const m = nthWeekday(y, 9, 1, 1); return [[plusJ(m, -2), m]]; } },
  66:  { approx: true, when: y => [[d0(y, 9, 20), d0(y, 10, 10)]], note: "date selon le village" },
  71:  { approx: true, when: y => { const s = nthWeekday(y, 10, 4, 2); return [[s, plusJ(s, 10)]]; } },
  144: { approx: true, when: y => { const s = nthWeekday(y, 10, 6, 2); return [[s, s]]; } },
  245: { approx: true, when: y => { const o = d0(y, 10, 31); const s = plusJ(o, -((o.getDay() + 1) % 7 || 7)); return [[s, plusJ(s, 15)]]; } },
  244: { approx: true, when: y => { const s = nthWeekday(y, 11, 6, 2); return [[s, s]]; }, note: "cortège le soir" },
  70:  { when: y => { const d = nthWeekday(y, 11, 1, 4); return [[d, d]]; }, note: "dès 5 h du matin" },
  140: { approx: true, when: y => [[nthWeekday(y, 11, 4, -1), d0(y, 12, 23)]] },
  63:  { when: y => [[d0(y, 12, 5), d0(y, 12, 5)]], note: "cortège le soir" },
  237: { approx: true, when: y => { const t = d0(y, 12, 12), g = t.getDay(); const sun = plusJ(t, g <= 3 ? -g : 7 - g); return [[plusJ(sun, -2), sun]]; } },
  64:  { when: y => { const a = notSunday(d0(y, 1, 13)), b = notSunday(d0(y, 12, 31)); return [[a, a], [b, b]]; } },
  272: { approx: true, when: y => { const j = d0(y, 1, 21); const s = plusJ(j, (6 - j.getDay() + 7) % 7); return [[s, plusJ(s, 8)]]; }, note: "festival international de ballons" },
  /* v13 */
  304: { when: y => { const s = nthWeekday(y, 9, 0, -1); return [[plusJ(s, -2), s]]; }, note: "grand cortège le dimanche" },
  305: { approx: true, when: y => [[d0(y, 11, 1), d0(y, 11, 22)]], note: "le menu se sert plusieurs week-ends de novembre — réservez" },
  314: { approx: true, when: y => [[nthWeekday(y, 11, 4, 3), d0(y, 12, 24)]] },
  316: { approx: true, when: y => { const s = nthWeekday(y, 8, 3, 1); return [[s, plusJ(s, 10)]]; }, note: "projections sur la Piazza Grande à la tombée de la nuit" },
  317: { approx: true, when: y => { const s = nthWeekday(y, 7, 5, 1); return [[s, plusJ(s, 15)]]; } },
  319: { when: y => { const d = plusJ(easter(y), -42); return [[d, d]]; }, note: "le dimanche soir, vers 19 h" },
  356: { approx: true, when: y => { const s = nthWeekday(y, 1, 3, 3); return [[s, plusJ(s, 11)]]; }, note: "à la nuit tombée" }
};
