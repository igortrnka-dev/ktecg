import { randomUUID } from "node:crypto";
import { AI_ERROR } from "../ai/errors";
import { marketLog, runLog } from "../ai/runlog";
import type { MarketReportData } from "../ai/schemas";
import { NEXT_ACTION } from "../inquiries";
import { COMPANY_MAILBOX } from "../mail/config";
import { snippetOf } from "../mail/parse";
import { CHECK_ADDRESS, mailLog } from "../mail/text";
import { seedProjects } from "../../content/projects";
import { toRow } from "../project-rows";

/*
 * Sample data for the local admin preview. Every company is fictional and uses the
 * reserved .example domain, so nothing here can be mistaken for (or e-mail) a real firm.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const HOUR = 36e5;
const ago = (days: number, hours = 0) => new Date(Date.now() - (days * 24 + hours) * HOUR).toISOString();
const day = (offset: number) => new Date(Date.now() + offset * 24 * HOUR).toISOString().slice(0, 10);

const signal = (type: string, detail: string, url = "") => ({ type, detail, url });
const contact = (name: string, role: string, email = "", phone = "", linkedin = "") => ({ name, role, email, phone, linkedin });

const COMPANY_PROFILE = `KTechnology s.r.o. (based in Slovakia) provides industrial staff leasing for projects across Europe and worldwide. We deploy to Germany, Austria, the Nordics (Sweden, Norway, Finland, Denmark), Benelux, France, Poland, Czechia, Slovakia and the UAE.

Trades: welders (MIG/MAG, TIG, MMA; steel and stainless), pipe fitters, steel fitters, industrial electricians, automation technicians (PLC), mechanics and millwrights, CNC and machine operators, assembly operators and logistics operators. Every worker passes a practical skills test before deployment.

We handle recruiting, employment contracts, A1 forms and work permits, insurance, travel and accommodation, plus a project coordinator and fast replacement. The workers are employed by KTechnology and leased to the customer, who gets one contact and one invoice. We send a quote within one business day, and a crew is typically on site in about 14 days.

Ideal customers: manufacturers, automotive suppliers, metalworking companies, energy and power plants (outages and shutdowns), shipyards and offshore, electrical and automation contractors, EPC and installation contractors, mid-size and larger, in the countries above, who struggle to hire skilled blue-collar staff.

Strong buying signals: many open job ads for skilled trades, new plant/line/expansion announcements, large project wins or contracts, planned outages/shutdowns, labour-shortage statements, subcontracting tenders.`;

/** An excerpt of the web research notes a real run stores in its log (sample companies and people). */
const RESEARCH_NOTES = `1. Brenner Achsentechnik GmbH (brenner-achsen.example), Zwickau, Germany – axles and chassis modules, ~1,000 employees.
   Signals: 14 open positions for MAG welders and maintenance technicians (https://brenner-achsen.example/karriere); new welding line, series production from Q1 (https://brenner-achsen.example/news/neue-linie).
   Decision makers: Thomas Weidner, Leiter Produktion, t.weidner@brenner-achsen.example, +49 375 555 0140; Sabine Kroll, Personalleiterin, s.kroll@brenner-achsen.example.
2. Alpenstahl Montage GmbH (alpenstahl.example), Linz, Austria – steel structures and installation.
   Decision makers: Stefan Gruber, Geschäftsführer, s.gruber@alpenstahl.example.`;

/** A finished sample market analysis; fictional companies, sources and figures (.example domains). */
const MARKET_REPORT: MarketReportData = {
  summary:
    "Ukážková analýza s vymyslenými firmami, zdrojmi a číslami. Dopyt po zváračoch a montéroch v Nemecku je vysoký najmä v strojárstve, u dodávateľov pre automotive a vo výrobe komponentov pre veterné elektrárne; inzeráty na tieto profesie ostávajú otvorené aj niekoľko mesiacov. Najviac ponúk je v Severnom Porýní-Vestfálsku, Bádensku-Württembersku a Bavorsku. Viaceré firmy rozširujú výrobu alebo chystajú jarné odstávky, čo otvára priestor pre tímy na 3–12 mesiacov. Konkurencia veľkých personálnych agentúr je silná, preto sa oplatí stavať na prakticky preverených ľuďoch a rýchlom nástupe.",
  opportunity: "vysoká",
  opportunity_reason:
    "Dlhodobo neobsadené pozície, nové linky a jarné odstávky u viacerých firiem zo zoznamu. Riziko: cenový tlak veľkých agentúr a povinnosti pri prenájme pracovníkov do Nemecka.",
  demand_signals: [
    {
      title: "Dlhodobo otvorené inzeráty na zváračov",
      detail: "Ukážkový prehľad pracovných portálov uvádza 2 000 – 3 000 aktívnych inzerátov na zváračov MIG/MAG a TIG (09/2026), časť z nich je otvorená dlhšie ako 60 dní.",
      url: "https://jobportal-prehlad.example/schweisser-2026",
    },
    {
      title: "Zvárači medzi nedostatkovými profesiami",
      detail: "Ukážková štatistika úradu práce radí zváračov a montérov kovových konštrukcií medzi profesie s nedostatkom uchádzačov (správa 06/2026).",
      url: "https://statistika-prace.example/engpass-2026",
    },
    {
      title: "Nové linky a haly s nábehom v 1. polroku",
      detail: "Tri firmy zo zoznamu ohlásili nové výrobné linky alebo haly; nábor zváračov a montérov prebieha už teraz.",
      url: "https://priemysel-spravy.example/investitionen-q3",
    },
    {
      title: "Jarné odstávky v chemickom priemysle",
      detail: "Údržbové firmy v Sasku-Anhaltsku hľadajú subdodávateľov na potrubné a montážne práce počas odstávok v marci a apríli.",
      url: "https://saale-anlagenservice.example/revision-2027",
    },
  ],
  regions: [
    { name: "Severné Porýnie-Vestfálsko", detail: "Najviac inzerátov na zváračov; strojárstvo, oceľové konštrukcie, chemický priemysel." },
    { name: "Bádensko-Württembersko", detail: "Strojárstvo a dodávatelia pre automotive; vysoké mzdy, dôraz na kvalitu a nemčinu majstra." },
    { name: "Bavorsko", detail: "Výroba kotlov, tlakových nádob a automotive; dopyt po zváračoch TIG." },
    { name: "Dolné Sasko", detail: "Komponenty pre veterné elektrárne a lodiarstvo; projekty na 6–12 mesiacov." },
  ],
  industries: [
    { name: "Strojárstvo", detail: "Najväčší objem inzerátov na zváračov a montérov, často na zmeny." },
    { name: "Automotive dodávatelia", detail: "Nábehy nových liniek, potreba tímov na obmedzený čas." },
    { name: "Komponenty pre veterné elektrárne", detail: "Rozširovanie výroby veží a rámov, zváranie hrubých plechov." },
    { name: "Údržba chemických závodov", detail: "Krátke, intenzívne odstávky s pevným termínom." },
  ],
  companies: [
    {
      name: "Brenner Achsentechnik GmbH",
      website: "https://brenner-achsen.example",
      city: "Zwickau",
      industry: "Automotive – nápravy",
      signal: "14 otvorených pozícií pre MAG zváračov a údržbárov, nová zváracia linka so sériovou výrobou od 1. štvrťroka.",
      url: "https://brenner-achsen.example/karriere",
    },
    {
      name: "Ruhrtal Metalltechnik GmbH",
      website: "https://ruhrtal-metall.example",
      city: "Dortmund",
      industry: "Oceľové konštrukcie a zariadenia",
      signal: "Hľadajú 8 zváračov MAG a 4 montérov pre novú výrobnú halu; inzeráty sú otvorené od júla.",
      url: "https://ruhrtal-metall.example/jobs",
    },
    {
      name: "Neckar Fördertechnik GmbH",
      website: "https://neckar-foerdertechnik.example",
      city: "Heilbronn",
      industry: "Strojárstvo – dopravníkové systémy",
      signal: "Nová montážna linka s nábehom v 2. štvrťroku, 6 pozícií pre montérov a 2 pre zváračov TIG.",
      url: "https://neckar-foerdertechnik.example/news/neue-montagelinie",
    },
    {
      name: "Isar Kesseltechnik GmbH",
      website: "https://isar-kessel.example",
      city: "Landshut",
      industry: "Kotly a tlakové nádoby",
      signal: "Opakované inzeráty na zváračov TIG pre nerezové tlakové nádoby, posledný z 09/2026.",
      url: "https://isar-kessel.example/karriere",
    },
    {
      name: "Emsland Windtechnik GmbH",
      website: "https://emsland-wind.example",
      city: "Lingen",
      industry: "Komponenty pre veterné elektrárne",
      signal: "Rozšírenie výroby veží, 20 nových pozícií vo zváraní a montáži do konca roka.",
      url: "https://emsland-wind.example/presse/erweiterung",
    },
    {
      name: "Saale Anlagenservice GmbH",
      website: "https://saale-anlagenservice.example",
      city: "Halle (Saale)",
      industry: "Údržba chemických závodov",
      signal: "Jarná odstávka v marci, hľadajú subdodávateľov na potrubné a montážne práce na 5 týždňov.",
      url: "https://saale-anlagenservice.example/revision-2027",
    },
  ],
  competitors: [
    { name: "Nordstern Personal GmbH", website: "https://nordstern-personal.example", detail: "Veľká sieť pobočiek, zváračov ponúka najmä na dlhodobý prenájom." },
    { name: "Praxis Industrieservice GmbH", website: "https://praxis-industrie.example", detail: "Špecializácia na odstávky v chemickom priemysle, vlastní koordinátori." },
    { name: "Montana Workforce Sp. z o.o.", website: "https://montana-workforce.example", detail: "Poľská agentúra, vysiela zváračov a montérov do Nemecka, nízke ceny." },
  ],
  wages: [
    { role: "Zvárač MIG/MAG", range: "17 – 22 € / h hrubá mzda (ukážkový údaj, 09/2026)", detail: "Vyššie pri zmenách a v automotive.", url: "https://mzdy-prehlad.example/schweisser" },
    { role: "Zvárač TIG", range: "19 – 25 € / h hrubá mzda (ukážkový údaj, 09/2026)", detail: "Nerez a tlakové nádoby na hornej hranici.", url: "https://mzdy-prehlad.example/wig-schweisser" },
    { role: "Montér", range: "16 – 20 € / h hrubá mzda (ukážkový údaj, 09/2026)", detail: "", url: "https://mzdy-prehlad.example/monteur" },
    { role: "Sadzba za prenajatého zvárača", range: "32 – 42 € / h (odhad)", detail: "Odhad z ukážkových cenníkov; závisí od zmien, ubytovania a dĺžky projektu.", url: "" },
  ],
  regulations: [
    {
      title: "Povolenie na prenájom pracovníkov (AÜG)",
      detail: "Prenájom pracovníkov do Nemecka vyžaduje povolenie Bundesagentur für Arbeit, aj pre agentúru so sídlom v zahraničí.",
      url: "https://pravidla-prenajmu.example/aueg",
    },
    {
      title: "Formulár A1",
      detail: "Potvrdenie, že vyslaný pracovník ostáva poistený na Slovensku; vydáva Sociálna poisťovňa pred začiatkom práce.",
      url: "https://pravidla-prenajmu.example/a1",
    },
    {
      title: "Nahlásenie vyslania",
      detail: "Prenajatých pracovníkov treba pred nástupom nahlásiť colnej správe (Meldeportal-Mindestlohn).",
      url: "https://pravidla-prenajmu.example/meldung",
    },
    {
      title: "Minimálna mzda a Equal Pay",
      detail: "Platí aspoň nemecká minimálna mzda; po 9 mesiacoch u jedného zákazníka rovnaká odmena ako kmeňoví zamestnanci.",
      url: "https://pravidla-prenajmu.example/equal-pay",
    },
  ],
  seasonality:
    "Najviac dopytu je od februára do mája (nábehy výroby, jarné odstávky v chemickom priemysle) a v septembri a októbri. V auguste a koncom decembra sa projekty spomaľujú pre celozávodné dovolenky.",
  recommendations: [
    "Do konca mesiaca osloviť firmy s najčerstvejšími signálmi: Emsland Windtechnik a Saale Anlagenservice (odstávka v marci).",
    "Pripraviť nemecký profil tímu zváračov MIG/MAG a TIG a montérov s praktickým testom a nástupom približne do 14 dní.",
    "Pred prvou zákazkou overiť povolenie na prenájom pracovníkov (AÜG) a postup nahlásenia vyslania.",
    "Spustiť AI vyhľadávanie pre strojárstvo a komponenty pre veterné elektrárne v Severnom Porýní-Vestfálsku a Dolnom Sasku.",
  ],
  suggested_campaign: {
    name: "Zvárači a montéri – Nemecko, strojárstvo",
    countries: ["Germany"],
    industries: ["mechanical engineering", "steel structures", "wind energy components"],
    roles: ["MIG/MAG welder", "TIG welder", "fitter"],
  },
  sources: [
    { title: "Schweißer-Stellenmarkt 2026 (ukážkový prehľad)", url: "https://jobportal-prehlad.example/schweisser-2026" },
    { title: "Engpassanalyse 2026 (ukážka)", url: "https://statistika-prace.example/engpass-2026" },
    { title: "Investitionen im 3. Quartal (ukážka)", url: "https://priemysel-spravy.example/investitionen-q3" },
    { title: "Löhne für Schweißer (ukážka)", url: "https://mzdy-prehlad.example/schweisser" },
    { title: "Arbeitnehmerüberlassung aus dem Ausland (ukážka)", url: "https://pravidla-prenajmu.example/aueg" },
    { title: "Emsland Windtechnik – Erweiterung der Turmfertigung", url: "https://emsland-wind.example/presse/erweiterung" },
    { title: "Saale Anlagenservice – Revision 2027", url: "https://saale-anlagenservice.example/revision-2027" },
  ],
};

/** An excerpt of the web research notes a real analysis keeps in its log (sample companies and figures). */
const MARKET_NOTES = `Demand: job portals list 2,000–3,000 active ads for MIG/MAG and TIG welders in Germany (09/2026), part open over 60 days (https://jobportal-prehlad.example/schweisser-2026).
Companies: Ruhrtal Metalltechnik GmbH (ruhrtal-metall.example), Dortmund – 8 MAG welders and 4 fitters for a new hall (https://ruhrtal-metall.example/jobs).
Emsland Windtechnik GmbH (emsland-wind.example), Lingen – tower production expansion, 20 positions in welding and assembly (https://emsland-wind.example/presse/erweiterung).`;

/** Prospects the simulated AI run "finds" (see ai.ts), taken in order. */
export const PROSPECT_POOL: Row[] = [
  {
    company_name: "Harzer Gießerei & Mechanik GmbH",
    website: "https://harzer-giesserei.example",
    domain: "harzer-giesserei.example",
    country: "Germany",
    city: "Goslar",
    industry: "Zlievareň a obrábanie",
    company_size: "300–500",
    description: "Odliatky a obrábané diely pre výrobcov poľnohospodárskej a stavebnej techniky.",
    signals: [
      signal("job_ads", "9 otvorených pozícií pre zváračov a CNC operátorov, niektoré inzeráty 2 mesiace staré", "https://harzer-giesserei.example/karriere"),
      signal("expansion", "Investícia do novej obrábacej haly, spustenie v 1. polroku", "https://harzer-giesserei.example/news"),
    ],
    contacts: [contact("Markus Engel", "Leiter Produktion", "m.engel@harzer-giesserei.example")],
    score: 72,
    tier: "B",
    qualification: "Rozširujú obrábanie a dlhodobo nevedia obsadiť zvárača ani CNC operátora. Vhodné na 3–5 ľudí na 6 mesiacov. Menšia firma, rozhodovanie bude pomalšie.",
    recommended_roles: ["MAG zvárač", "CNC operátor"],
    outreach_language: "de",
    outreach_subject: "Schweißer und CNC-Bediener für Ihre neue Halle",
    outreach_body: "Guten Tag Herr Engel,\n\nwir haben gesehen, dass Harzer Gießerei & Mechanik für die neue Bearbeitungshalle Schweißer und CNC-Bediener sucht. KTechnology stellt erfahrene, praktisch geprüfte Fachkräfte bereit, einzeln oder als Team, inklusive Anreise und Unterkunft.\n\nHätten Sie nächste Woche kurz Zeit für ein Telefonat?\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
  },
  {
    company_name: "Sundsvall Massa AB",
    website: "https://sundsvall-massa.example",
    domain: "sundsvall-massa.example",
    country: "Sweden",
    city: "Sundsvall",
    industry: "Celulóza a papier",
    company_size: "500–1 000",
    description: "Celulózka s vlastnou energetikou, každoročná jarná odstávka.",
    signals: [signal("outage", "Jarná odstávka 5 týždňov, hľadajú subdodávateľov na potrubné a elektro práce", "https://sundsvall-massa.example/upphandling")],
    contacts: [contact("Anna Holm", "Underhållschef", "anna.holm@sundsvall-massa.example")],
    score: 80,
    tier: "A",
    qualification: "Pravidelná ročná odstávka s jasným termínom a verejnou výzvou na subdodávky. Potrebujú potrubárov a elektrikárov na 5 týždňov. Treba sa ozvať do konca mesiaca, kým rozdelia práce.",
    recommended_roles: ["Potrubár", "Priemyselný elektrikár"],
    outreach_language: "sv",
    outreach_subject: "Rörmontörer och elektriker till vårens underhållsstopp",
    outreach_body: "Hej Anna,\n\nJag såg att Sundsvall Massa söker underleverantörer inför vårens underhållsstopp. KTechnology hyr ut erfarna rörmontörer och industrielektriker till stopp i hela Norden, med resor, boende och samordning på plats.\n\nHar du tid för ett kort samtal nästa vecka?\n\nVänliga hälsningar\nKTechnology",
  },
  {
    company_name: "Steyr Antriebstechnik GmbH",
    website: "https://steyr-antrieb.example",
    domain: "steyr-antrieb.example",
    country: "Austria",
    city: "Steyr",
    industry: "Automotive – pohony",
    company_size: "1 000–2 000",
    description: "Dodávateľ prevodoviek a pohonných komponentov pre nákladné vozidlá.",
    signals: [
      signal("project_win", "Nová zákazka na elektrické nápravy, nábeh výroby o 4 mesiace", "https://steyr-antrieb.example/presse"),
      signal("job_ads", "Hľadajú 12 operátorov montáže a 4 technikov automatizácie", "https://steyr-antrieb.example/jobs"),
    ],
    contacts: [contact("Claudia Reiter", "HR Business Partner Produktion", "c.reiter@steyr-antrieb.example")],
    score: 85,
    tier: "A",
    qualification: "Nábeh novej výroby s konkrétnym termínom a veľkým počtom otvorených pozícií. Vhodný tím operátorov montáže a technikov automatizácie na 6–9 mesiacov.",
    recommended_roles: ["Operátor montáže", "Technik automatizácie"],
    outreach_language: "de",
    outreach_subject: "Montagepersonal für den Hochlauf der E-Achsen",
    outreach_body: "Sehr geehrte Frau Reiter,\n\nherzlichen Glückwunsch zum neuen E-Achsen-Auftrag. Für den Hochlauf stellen wir Ihnen geprüfte Montagemitarbeiter und Automatisierungstechniker bereit, auf Wunsch als Team mit eigenem Koordinator.\n\nDarf ich Ihnen passende Profile schicken?\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
  },
  {
    company_name: "Śląskie Zakłady Mechaniczne S.A.",
    website: "https://szm-slask.example",
    domain: "szm-slask.example",
    country: "Poland",
    city: "Katowice",
    industry: "Strojárstvo",
    company_size: "400–700",
    description: "Výroba a montáž dopravníkov a zariadení pre baníctvo a energetiku.",
    signals: [signal("job_ads", "Opakované inzeráty na spawacza TIG a montera maszyn", "https://szm-slask.example/kariera")],
    contacts: [contact("Piotr Zieliński", "Kierownik produkcji", "p.zielinski@szm-slask.example")],
    score: 67,
    tier: "B",
    qualification: "Stabilný dopyt po zváračoch TIG a montéroch strojov. Vhodné na menší tím, cenovo citlivý trh.",
    recommended_roles: ["TIG zvárač", "Montér strojov"],
    outreach_language: "pl",
    outreach_subject: "Spawacze TIG i monterzy maszyn na Państwa projekty",
    outreach_body: "Szanowny Panie,\n\nwidzimy, że Państwa firma od dłuższego czasu szuka spawaczy TIG i monterów maszyn. KTechnology zapewnia doświadczonych fachowców, sprawdzonych w praktycznych testach, razem z zakwaterowaniem i koordynacją.\n\nCzy znalazłby Pan 15 minut na krótką rozmowę w przyszłym tygodniu?\n\nZ poważaniem\nZespół KTechnology",
  },
];

export function seed(): Record<string, Row[]> {
  const campaigns: Row[] = [
    {
      id: randomUUID(),
      name: "Zvárači – Nemecko a Rakúsko, automotive",
      active: true,
      countries: ["Germany", "Austria"],
      industries: ["automotive suppliers", "steel structures", "shipbuilding"],
      roles: ["MIG/MAG welder", "TIG welder", "steel fitter"],
      notes: "Firmy 100–2000 zamestnancov, vynechaj personálne agentúry.",
      outreach_language: "de",
      leads_per_run: 10,
      last_run_at: ago(0, 9),
      created_at: ago(14),
    },
    {
      id: randomUUID(),
      name: "Odstávky – Škandinávia, energetika",
      active: true,
      countries: ["Sweden", "Norway", "Finland"],
      industries: ["power plants", "pulp and paper", "process industry"],
      roles: ["pipe fitter", "industrial electrician", "mechanic"],
      notes: "Hľadaj plánované odstávky a revízie v najbližších 6 mesiacoch.",
      outreach_language: "auto",
      leads_per_run: 8,
      last_run_at: ago(2),
      created_at: ago(12),
    },
    {
      id: randomUUID(),
      name: "CNC operátori – Česko a Poľsko",
      active: false,
      countries: ["Czechia", "Poland"],
      industries: ["machining", "aerospace parts"],
      roles: ["CNC operator", "machine setter"],
      notes: "",
      outreach_language: "auto",
      leads_per_run: 5,
      last_run_at: ago(9),
      created_at: ago(10),
    },
  ];
  const [de, nordic, cnc] = campaigns.map((c) => c.id);

  const run = (campaign: string, trigger: string, startedAgo: number, found: number, created: number, extra: Row = {}): Row => ({
    id: randomUUID(),
    campaign_id: campaign,
    trigger,
    status: "done",
    found,
    created,
    log: [runLog.researching(campaigns.find((c) => c.id === campaign)!.name), runLog.researched(found * 3 + 4), runLog.saved(created, found)].join("\n"),
    error: null,
    usage: { web_searches: found * 3 + 4 },
    started_at: ago(0, startedAgo),
    finished_at: ago(0, startedAgo - 0.1),
    ...extra,
  });
  const lead_runs: Row[] = [
    run(cnc, "manual", 9 * 24, 2, 1),
    run(de, "cron", 3 * 24, 7, 5),
    run(nordic, "cron", 2 * 24, 4, 3),
    run(de, "manual", 26, 0, 0, {
      status: "failed",
      found: 0,
      log: [runLog.researching("Zvárači – Nemecko a Rakúsko, automotive"), runLog.failed(AI_ERROR.overloaded)].join("\n"),
      error: AI_ERROR.overloaded,
      usage: { web_searches: 6 },
    }),
    // Like a real run, the log keeps the research notes with the people found (deleteLead redacts them).
    run(de, "cron", 9, 5, 4, {
      log: [
        runLog.researching("Zvárači – Nemecko a Rakúsko, automotive"),
        `${runLog.researched(19)}\n\n${RESEARCH_NOTES}\n`,
        runLog.saved(4, 5),
      ].join("\n"),
    }),
  ];

  /** A sample e-mail with the lead's first contact; "outreach" as the body stands for the lead's outreach e-mail. */
  type MailSeed = { dir: "in" | "out"; kind?: "normal" | "auto_reply" | "bounce"; hours: number; subject: string; body: string };
  type LeadSeed = Row & { events?: [type: string, body: string, hoursAgo: number][]; mails?: MailSeed[] };
  const leadSeeds: LeadSeed[] = [
    {
      company_name: "Brenner Achsentechnik GmbH",
      domain: "brenner-achsen.example",
      country: "Germany",
      city: "Zwickau",
      industry: "Automotive – nápravy",
      company_size: "800–1 200",
      description: "Dodávateľ náprav a podvozkových modulov pre osobné a úžitkové vozidlá.",
      signals: [
        signal("job_ads", "14 otvorených pozícií pre MAG zváračov a údržbárov, inzeráty staršie ako 6 týždňov", "https://brenner-achsen.example/karriere"),
        signal("expansion", "Nová zváracia linka, sériová výroba od 1. štvrťroka", "https://brenner-achsen.example/news/neue-linie"),
      ],
      contacts: [
        contact("Thomas Weidner", "Leiter Produktion", "t.weidner@brenner-achsen.example", "+49 375 555 0140"),
        contact("Sabine Kroll", "Personalleiterin", "s.kroll@brenner-achsen.example"),
      ],
      score: 91,
      tier: "A",
      qualification: "Silný kandidát: už 6 týždňov nevedia obsadiť MAG zváračov a pred spustením novej linky potrebujú posilniť zmeny. Typicky 6–10 ľudí na 6–12 mesiacov. Riziko: chcú aspoň jedného nemecky hovoriaceho majstra.",
      recommended_roles: ["MAG zvárač", "Údržbár / mechanik"],
      outreach_language: "de",
      outreach_subject: "MAG-Schweißer für den Serienanlauf in Zwickau",
      outreach_body: "Guten Tag Herr Weidner,\n\nwir haben gesehen, dass Brenner Achsentechnik für die neue Schweißlinie seit Wochen MAG-Schweißer sucht. KTechnology stellt erfahrene, praktisch geprüfte Schweißer und Instandhalter für Hochläufe und Projektspitzen bereit, einzeln oder als komplettes Team, inklusive Anreise, Unterkunft und Koordination vor Ort.\n\nHätten Sie nächste Woche 15 Minuten für ein kurzes Telefonat?\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
      status: "qualified",
      source: "ai_prospecting",
      campaign_id: de,
      next_action: "Zavolať T. Weidnerovi",
      next_action_at: day(0),
      created_at: ago(0, 9),
      events: [["created", "Nájdené AI vyhľadávaním. Skóre 91, tier A.", 9]],
    },
    {
      company_name: "Nordkap Kraft AB",
      domain: "nordkap-kraft.example",
      country: "Sweden",
      city: "Luleå",
      industry: "Energetika – teplárne",
      company_size: "250–500",
      description: "Prevádzkovateľ kogeneračných jednotiek a tepelných sietí na severe Švédska.",
      signals: [
        signal("outage", "Plánovaná revízia kotla v apríli, 6 týždňov", "https://nordkap-kraft.example/nyheter/revision"),
        signal("tender", "Výberové konanie na subdodávku potrubárskych prác počas revízie", "https://nordkap-kraft.example/upphandling"),
      ],
      contacts: [contact("Erik Lindqvist", "Underhållschef", "erik.lindqvist@nordkap-kraft.example")],
      score: 88,
      tier: "A",
      qualification: "Konkrétna odstávka s termínom a otvorenou súťažou na potrubné práce. Potrebujú 6–8 potrubárov a 2 elektrikárov na 6 týždňov. Treba stihnúť termín súťaže.",
      recommended_roles: ["Potrubár", "Zvárač TIG", "Priemyselný elektrikár"],
      outreach_language: "sv",
      outreach_subject: "Rörmontörer och elektriker till revisionen i april",
      outreach_body: "Hej Erik,\n\nJag såg att Nordkap Kraft planerar en sex veckor lång revision av pannan i april. KTechnology hyr ut erfarna rörmontörer, svetsare och industrielektriker till underhållsstopp i hela Norden. Vi sköter rekrytering, kompetensprov, resor, boende och samordning på plats.\n\nHar du tid för ett kort samtal nästa vecka om bemanningen inför stoppet?\n\nVänliga hälsningar\nKTechnology",
      status: "qualified",
      source: "ai_prospecting",
      campaign_id: nordic,
      next_action: "Poslať referencie z odstávok",
      next_action_at: day(1),
      created_at: ago(2),
      events: [["created", "Nájdené AI vyhľadávaním. Skóre 88, tier A.", 48]],
    },
    {
      company_name: "Weserwerft Schiffbau GmbH",
      domain: "weserwerft.example",
      country: "Germany",
      city: "Bremerhaven",
      industry: "Lodiarstvo",
      company_size: "300–600",
      description: "Stavba a prestavba servisných a pracovných lodí.",
      signals: [signal("project_win", "Zákazka na 2 servisné lode pre veterné parky na mori", "https://weserwerft.example/presse")],
      contacts: [contact("Jana Hansen", "Leiterin Fertigung", "j.hansen@weserwerft.example")],
      score: 74,
      tier: "B",
      qualification: "Nová zákazka znamená špičku v oceľových a potrubných prácach na 9–12 mesiacov. Majú stálych subdodávateľov, preto skôr doplnkové kapacity.",
      recommended_roles: ["Zvárač (lodné konštrukcie)", "Potrubár"],
      outreach_language: "de",
      outreach_subject: "Schweißer und Rohrschlosser für Ihre Serviceschiffe",
      outreach_body: "Guten Tag Frau Hansen,\n\nherzlichen Glückwunsch zum Auftrag über zwei Serviceschiffe für Offshore-Windparks. Für Fertigungsspitzen im Stahl- und Rohrleitungsbau stellen wir Ihnen erfahrene Schweißer und Rohrschlosser bereit, die vor dem Einsatz praktisch geprüft werden. Anreise und Unterkunft organisieren wir.\n\nDarf ich Ihnen ein kurzes Profil passender Fachkräfte schicken?\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
      status: "contacted",
      source: "ai_prospecting",
      campaign_id: de,
      next_action: "Pripomenúť sa e-mailom",
      next_action_at: day(-1),
      created_at: ago(12),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 74, tier B.", 288],
        ["status", "qualified → contacted", 240],
      ],
      mails: [
        { dir: "out", hours: 240, subject: "Schweißer und Rohrschlosser für Ihre Serviceschiffe", body: "outreach" },
        {
          dir: "in",
          kind: "auto_reply",
          hours: 239.9,
          subject: "Automatische Antwort: Schweißer und Rohrschlosser für Ihre Serviceschiffe",
          body: "Vielen Dank für Ihre Nachricht. Ich bin derzeit nicht im Büro und habe keinen Zugriff auf meine E-Mails. In dringenden Fällen wenden Sie sich bitte an fertigung@weserwerft.example.\n\nJana Hansen",
        },
      ],
    },
    {
      company_name: "Alpenstahl Montage GmbH",
      domain: "alpenstahl.example",
      country: "Austria",
      city: "Linz",
      industry: "Oceľové konštrukcie",
      company_size: "120–200",
      description: "Výroba a montáž oceľových hál a priemyselných konštrukcií.",
      signals: [signal("labour_shortage", "Konateľ v rozhovore pre regionálne médiá: chýba im asi 20 montážnikov", "https://alpenstahl.example/presse/interview")],
      contacts: [contact("Stefan Gruber", "Geschäftsführer", "s.gruber@alpenstahl.example", "+43 732 555 0177")],
      score: 69,
      tier: "B",
      qualification: "Verejne priznaný nedostatok montážnikov. Odpísali, že zvažujú 8 montérov oceľových konštrukcií od jari. Riziko: tlak na cenu.",
      recommended_roles: ["Montér oceľových konštrukcií", "Zvárač MAG"],
      outreach_language: "de",
      outreach_subject: "Stahlbaumonteure für Ihre Projekte in Oberösterreich",
      outreach_body: "Sehr geehrter Herr Gruber,\n\nin Ihrem Interview haben Sie erwähnt, dass Ihnen derzeit rund 20 Monteure fehlen. KTechnology stellt erfahrene Stahlbaumonteure und Schweißer bereit, kurzfristig und auf Wunsch als eingespieltes Team mit eigenem Vorarbeiter.\n\nGerne schicke ich Ihnen ein unverbindliches Angebot für 8 Monteure.\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
      status: "replied",
      source: "ai_prospecting",
      campaign_id: de,
      next_action: "Pripraviť cenovú ponuku na 8 montérov",
      next_action_at: day(0),
      created_at: ago(6),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 69, tier B.", 144],
        ["status", "qualified → contacted", 120],
        ["status", "contacted → replied", 20],
      ],
      mails: [
        { dir: "out", hours: 120, subject: "Stahlbaumonteure für Ihre Projekte in Oberösterreich", body: "outreach" },
        {
          dir: "in",
          hours: 20,
          subject: "AW: Stahlbaumonteure für Ihre Projekte in Oberösterreich",
          body: "Guten Tag,\n\ndanke für Ihre Nachricht. Wir überlegen, ab dem Frühjahr 8 Stahlbaumonteure für etwa sechs Monate einzusetzen. Bitte schicken Sie uns ein unverbindliches Angebot mit Stundensätzen inklusive Unterkunft.\n\nMit freundlichen Grüßen\nStefan Gruber\nGeschäftsführer",
        },
      ],
    },
    {
      company_name: "Vestfjord Prosess AS",
      domain: "vestfjord.example",
      country: "Norway",
      city: "Mo i Rana",
      industry: "Procesný priemysel",
      company_size: "500–1 000",
      description: "Výroba ferozliatin, dve veľké odstávky ročne.",
      signals: [signal("outage", "Jesenná odstávka pece, hľadajú externé kapacity na mechaniku a potrubia", "https://vestfjord.example/nyheter")],
      contacts: [contact("Ingrid Solberg", "Vedlikeholdsleder", "ingrid.solberg@vestfjord.example")],
      score: 84,
      tier: "A",
      qualification: "Opakované odstávky dvakrát ročne, potenciál dlhodobej spolupráce. Dohodnuté stretnutie k technickým požiadavkám.",
      recommended_roles: ["Mechanik / montér strojov", "Potrubár", "Zvárač"],
      outreach_language: "no",
      outreach_subject: "Fagarbeidere til vedlikeholdsstansen i Mo i Rana",
      outreach_body: "Hei Ingrid,\n\nTakk for en god prat om den planlagte stansen. Som avtalt: KTechnology kan stille med erfarne industrirørleggere, sveisere og industrimekanikere, inkludert reise, innkvartering og en koordinator på stedet.\n\nVi ser frem til møtet på torsdag.\n\nMed vennlig hilsen\nKTechnology",
      status: "meeting",
      source: "ai_prospecting",
      campaign_id: nordic,
      next_action: "Stretnutie cez Teams: technické požiadavky",
      next_action_at: day(3),
      created_at: ago(8),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 84, tier A.", 192],
        ["status", "qualified → contacted", 170],
        ["status", "contacted → replied", 52],
        ["status", "replied → meeting", 30],
      ],
      mails: [
        {
          dir: "out",
          hours: 170,
          subject: "Fagarbeidere til vedlikeholdsstansen i Mo i Rana",
          body: "Hei Ingrid,\n\nVi så at Vestfjord Prosess forbereder høststansen av ovnen. KTechnology leier ut erfarne industrirørleggere, sveisere og industrimekanikere, med reise, innkvartering og en koordinator på stedet.\n\nHar du tid til en kort prat neste uke?\n\nMed vennlig hilsen\nKTechnology",
        },
        {
          dir: "in",
          hours: 52,
          subject: "SV: Fagarbeidere til vedlikeholdsstansen i Mo i Rana",
          body: "Hei,\n\ntakk for henvendelsen. Vi trenger trolig 6–8 personer til stansen. Kan vi ta et Teams-møte torsdag kl. 10?\n\nHilsen\nIngrid Solberg\nVedlikeholdsleder",
        },
      ],
    },
    {
      company_name: "Rheinland Anlagenbau GmbH",
      domain: "rheinland-anlagenbau.example",
      country: "Germany",
      city: "Duisburg",
      industry: "Výstavba priemyselných zariadení (EPC)",
      company_size: "1 000+",
      description: "Projektovanie a montáž potrubných systémov pre chemický a energetický priemysel.",
      signals: [signal("project_win", "Montáž potrubí pre nový chemický závod, 14 mesiacov", "https://rheinland-anlagenbau.example/projekte")],
      contacts: [contact("Michael Brandt", "Projektleiter", "m.brandt@rheinland-anlagenbau.example")],
      score: 86,
      tier: "A",
      qualification: "Veľký projekt s dlhým trvaním. Rámcová dohoda na potrubárov a zváračov TIG.",
      recommended_roles: ["Potrubár", "Zvárač TIG"],
      outreach_language: "de",
      outreach_subject: "Rohrschlosser und WIG-Schweißer für Ihr Chemieprojekt",
      outreach_body: "Guten Tag Herr Brandt,\n\nfür die Rohrleitungsmontage in Ihrem neuen Chemieprojekt stellen wir Ihnen erfahrene Rohrschlosser und WIG-Schweißer bereit, inklusive Koordination vor Ort.\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
      status: "won",
      source: "ai_prospecting",
      campaign_id: de,
      notes: "Rámcová zmluva, prvých 6 potrubárov nastupuje začiatkom mesiaca.",
      created_at: ago(13),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 86, tier A.", 312],
        ["status", "qualified → contacted", 300],
        ["status", "contacted → replied", 290],
        ["status", "replied → meeting", 220],
        ["status", "meeting → won", 40],
      ],
      mails: [
        { dir: "out", hours: 300, subject: "Rohrschlosser und WIG-Schweißer für Ihr Chemieprojekt", body: "outreach" },
        {
          dir: "in",
          hours: 290,
          subject: "AW: Rohrschlosser und WIG-Schweißer für Ihr Chemieprojekt",
          body: "Guten Tag,\n\ndas passt gut: Für die Rohrleitungsmontage suchen wir ab nächstem Monat Verstärkung. Rufen Sie mich bitte morgen Vormittag an.\n\nGruß\nMichael Brandt",
        },
      ],
    },
    {
      company_name: "Moravia Precision s.r.o.",
      domain: "moravia-precision.example",
      country: "Czechia",
      city: "Zlín",
      industry: "CNC obrábanie – letecké diely",
      company_size: "150–250",
      description: "Presné obrábanie hliníkových a titánových dielov pre letecký priemysel.",
      signals: [signal("job_ads", "Dlhodobo hľadajú CNC operátorov na trojzmennú prevádzku", "https://moravia-precision.example/kariera")],
      contacts: [contact("Pavel Novák", "Vedoucí výroby", "p.novak@moravia-precision.example")],
      score: 63,
      tier: "B",
      qualification: "Stály dopyt po CNC operátoroch, ale vysoké nároky na certifikácie v letectve. Vhodné na 2–4 operátorov so skúsenosťou s 5-osovým obrábaním.",
      recommended_roles: ["CNC operátor", "Nastavovač CNC strojov"],
      outreach_language: "cs",
      outreach_subject: "CNC operátoři pro vaši výrobu ve Zlíně",
      outreach_body: "Dobrý den, pane Nováku,\n\nvšimli jsme si, že dlouhodobě hledáte CNC operátory na třísměnný provoz. KTechnology zajišťuje zkušené operátory a seřizovače CNC strojů, vybrané a otestované v praxi.\n\nMěl byste příští týden čas na krátký hovor?\n\nS pozdravem\ntým KTechnology",
      status: "new",
      source: "ai_prospecting",
      campaign_id: cnc,
      created_at: ago(9),
      events: [["created", "Nájdené AI vyhľadávaním. Skóre 63, tier B.", 216]],
    },
    {
      company_name: "Wisła Konstrukcje Sp. z o.o.",
      domain: "wisla-konstrukcje.example",
      country: "Poland",
      city: "Gdańsk",
      industry: "Oceľové konštrukcie a offshore",
      company_size: "200–400",
      description: "Prefabrikácia oceľových konštrukcií pre offshore a prístavy.",
      signals: [signal("expansion", "Rozširujú halu na prefabrikáciu offshore konštrukcií", "https://wisla-konstrukcje.example/aktualnosci")],
      contacts: [contact("Marek Wiśniewski", "Dyrektor produkcji", "m.wisniewski@wisla-konstrukcje.example")],
      score: 58,
      tier: "B",
      qualification: "Rast kapacít v offshore, no v Poľsku je silná domáca konkurencia agentúr. Skôr na neskôr.",
      recommended_roles: ["Zvárač MAG", "Montér oceľových konštrukcií"],
      outreach_language: "pl",
      outreach_subject: "Spawacze i monterzy konstrukcji stalowych do projektów offshore",
      outreach_body: "Szanowny Panie,\n\nw związku z rozbudową Państwa hali prefabrykacji chcielibyśmy zaproponować wsparcie: KTechnology zapewnia doświadczonych spawaczy i monterów konstrukcji stalowych, sprawdzonych w praktycznych testach, wraz z zakwaterowaniem i koordynacją.\n\nCzy znalazłby Pan 15 minut na krótką rozmowę w przyszłym tygodniu?\n\nZ poważaniem\nZespół KTechnology",
      status: "contacted",
      source: "ai_prospecting",
      campaign_id: cnc,
      next_action: CHECK_ADDRESS,
      next_action_at: day(-3),
      created_at: ago(9),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 58, tier B.", 216],
        ["status", "new → contacted", 72],
      ],
      mails: [
        { dir: "out", hours: 72, subject: "Spawacze i monterzy konstrukcji stalowych do projektów offshore", body: "outreach" },
        {
          dir: "in",
          kind: "bounce",
          hours: 71.9,
          subject: "Spawacze i monterzy konstrukcji stalowych do projektów offshore",
          body: "This is the mail system at host mail.example.\n\nI'm sorry to have to inform you that your message could not be delivered to one or more recipients.\n\n<m.wisniewski@wisla-konstrukcje.example>: host mx.wisla-konstrukcje.example said: 550 5.1.1 User unknown",
        },
      ],
    },
    {
      company_name: "Hamar Treforedling AS",
      domain: "hamar-tre.example",
      country: "Norway",
      city: "Hamar",
      industry: "Celulóza a papier",
      company_size: "100–200",
      description: "Menší papierenský závod.",
      signals: [signal("job_ads", "Jeden inzerát na elektrikára", "https://hamar-tre.example/jobb")],
      contacts: [],
      score: 41,
      tier: "C",
      qualification: "Majú vlastnú údržbu a hľadajú len jedného elektrikára na trvalý pomer. Slabá zhoda.",
      recommended_roles: ["Priemyselný elektrikár"],
      status: "disqualified",
      source: "ai_prospecting",
      campaign_id: nordic,
      created_at: ago(2, 1),
      events: [
        ["created", "Nájdené AI vyhľadávaním. Skóre 41, tier C.", 49],
        ["status", "new → disqualified", 30],
      ],
    },
    {
      company_name: "Lyon Mécanique Industrielle SAS",
      domain: "lyon-meca.example",
      website: "https://lyon-meca.example",
      country: "France",
      city: "Lyon",
      industry: "Výroba strojov",
      company_size: "200–300",
      description: "Špeciálne stroje a linky pre potravinársky priemysel.",
      signals: [signal("project_win", "Dodávka 3 baliacich liniek, montáž u zákazníka", "https://lyon-meca.example/actualites")],
      contacts: [contact("Claire Martin", "Responsable montage", "c.martin@lyon-meca.example")],
      score: 61,
      tier: "B",
      qualification: "Montážne špičky pri dodávkach liniek. Vybrali si lokálnu agentúru, skúsiť znova pri ďalšom projekte.",
      recommended_roles: ["Montér strojov", "Zvárač TIG (nerez)"],
      outreach_language: "fr",
      outreach_subject: "Monteurs et soudeurs pour vos mises en service",
      outreach_body: "Bonjour Madame Martin,\n\nNous accompagnons les fabricants de machines lors des pics de montage et des mises en service avec des monteurs et des soudeurs qualifiés, testés avant leur départ.\n\nSeriez-vous disponible pour un court échange la semaine prochaine ?\n\nCordialement,\nL’équipe KTechnology",
      status: "lost",
      source: "manual",
      created_at: ago(11),
      events: [
        ["created", "Pridané ručne.", 264],
        ["status", "new → contacted", 250],
        ["status", "contacted → lost", 100],
      ],
    },
    {
      company_name: "Donau Kühltechnik GmbH",
      domain: "donau-kuehltechnik.example",
      country: "Austria",
      city: "Wels",
      industry: "Chladiaca technika",
      company_size: "200–350",
      description: "Výroba chladiacich modulov a tepelných čerpadiel z nerezu.",
      signals: [],
      contacts: [contact("Andrea Berger", "Leiterin Fertigung", "a.berger@donau-kuehltechnik.example", "+43 7242 555 0102")],
      score: 82,
      tier: "A",
      qualification: "Konkrétny dopyt z webu: 4 zvárači TIG na nerez na 3 mesiace, dvojzmenná prevádzka. Jasný termín nástupu, rozhodovateľka sa ozvala sama.",
      recommended_roles: ["Zvárač TIG (nerez)"],
      outreach_language: "de",
      outreach_subject: "Ihre Anfrage: 4 WIG-Schweißer für Edelstahl",
      outreach_body: "Sehr geehrte Frau Berger,\n\nvielen Dank für Ihre Anfrage. Für drei Monate ab Anfang Dezember können wir Ihnen vier erfahrene WIG-Schweißer für Edelstahl anbieten und senden Ihnen gerne kurzfristig passende Profile. Anreise, Unterkunft und Koordination vor Ort übernehmen wir.\n\nPasst Ihnen ein kurzes Telefonat morgen Vormittag?\n\nMit freundlichen Grüßen\nIhr KTechnology-Team",
      status: "new",
      source: "inbound",
      next_action: NEXT_ACTION,
      next_action_at: day(0),
      created_at: ago(0, 5),
      events: [["created", "Dopyt z webu. Skóre 82, tier A.", 5]],
    },
    {
      company_name: "Kalmar Hamnservice AB",
      domain: "kalmar-hamn.example",
      country: "Sweden",
      city: "Kalmar",
      industry: "Prístavné služby",
      company_size: "50–100",
      description: "Údržba prístavných žeriavov a zariadení.",
      signals: [],
      contacts: [contact("Johan Ek", "Driftchef", "johan.ek@kalmar-hamn.example")],
      score: 66,
      tier: "B",
      qualification: "Dopyt z webu na 2 elektrikárov a 1 mechanika na 2 mesiace. Menší objem, ale rýchly štart.",
      recommended_roles: ["Priemyselný elektrikár", "Mechanik"],
      outreach_language: "sv",
      outreach_subject: "Er förfrågan: två elektriker och en mekaniker",
      outreach_body: "Hej Johan,\n\nTack för din förfrågan. Vi kan erbjuda två industrielektriker och en mekaniker för uppdraget i Kalmar och skickar gärna profiler under veckan.\n\nPassar det med ett kort samtal på torsdag?\n\nVänliga hälsningar\nKTechnology",
      status: "qualified",
      source: "inbound",
      next_action: "Poslať profily pracovníkov",
      next_action_at: day(2),
      created_at: ago(4),
      events: [["created", "Dopyt z webu. Skóre 66, tier B.", 96]],
    },
    {
      company_name: "Brabant Food Machines B.V.",
      domain: "brabant-fm.example",
      country: "Netherlands",
      city: "Eindhoven",
      industry: "Potravinárske stroje",
      company_size: "300–500",
      description: "Montáž strojov na spracovanie potravín, export do celého sveta.",
      signals: [signal("job_ads", "Hľadajú montérov a nerezových zváračov na montáž u zákazníkov", "https://brabant-fm.example/vacatures")],
      contacts: [contact("Sanne de Vries", "Operations Manager", "s.devries@brabant-fm.example")],
      score: 71,
      tier: "B",
      qualification: "Montáže u zákazníkov po celom svete, potrebujú flexibilné tímy. Dobrá zhoda s mobilnými tímami.",
      recommended_roles: ["Montér strojov", "Zvárač TIG (nerez)"],
      outreach_language: "en",
      outreach_subject: "Fitters and stainless welders for your on-site installations",
      outreach_body: "Dear Ms de Vries,\n\nWe noticed you are hiring fitters and stainless welders for installations at customer sites. KTechnology provides tested tradespeople who travel where your projects are, with travel, housing and coordination handled by us.\n\nWould a short call next week be useful?\n\nBest regards,\nThe KTechnology team",
      status: "qualified",
      source: "manual",
      next_action: "Nájsť kontakt na nákup",
      next_action_at: day(5),
      created_at: ago(5),
      events: [["created", "Pridané ručne.", 120], ["ai", "Preskúmané s Claude. Skóre 71, tier B.", 118]],
    },
    {
      company_name: "Ostrava Energoservis a.s.",
      domain: "ostrava-energo.example",
      website: "https://ostrava-energo.example",
      country: "Czechia",
      status: "new",
      source: "manual",
      created_at: ago(1),
      events: [["created", "Pridané ručne.", 24]],
    },
  ];

  const leads: Row[] = [];
  const lead_events: Row[] = [];
  const lead_emails: Row[] = [];
  for (const { events = [], mails = [], ...lead } of leadSeeds) {
    const row: Row = {
      id: randomUUID(),
      website: lead.website ?? `https://${lead.domain}`,
      city: null, industry: null, company_size: null, description: null, signals: [], contacts: [],
      score: null, tier: null, qualification: null, recommended_roles: [], outreach_language: null,
      outreach_subject: null, outreach_body: null, campaign_id: null, run_id: null,
      next_action: null, next_action_at: null, notes: "",
      ...lead,
      updated_at: lead.created_at,
    };
    leads.push(row);
    for (const [type, body, hoursAgo] of events) {
      lead_events.push({ id: randomUUID(), lead_id: row.id, type, body, created_at: ago(0, hoursAgo) });
    }
    for (const m of mails) {
      const person = row.contacts[0];
      const bounce = m.kind === "bounce";
      const body = m.body === "outreach" ? row.outreach_body : m.body;
      const email = {
        id: randomUUID(),
        lead_id: row.id,
        message_id: `<seed-${randomUUID()}@ktechnology.example>`,
        folder: m.dir === "out" ? "Sent" : "INBOX",
        direction: m.dir,
        kind: m.kind ?? "normal",
        from_email: bounce ? "mailer-daemon@mail.example" : m.dir === "in" ? person.email : COMPANY_MAILBOX,
        from_name: bounce ? "Mail Delivery System" : m.dir === "in" ? person.name : "KTechnology",
        to_emails: m.dir === "in" && !bounce ? [COMPANY_MAILBOX] : [person.email],
        cc_emails: [],
        subject: m.subject,
        snippet: snippetOf(body),
        body,
        sent_at: ago(0, m.hours),
        in_reply_to: null,
        created_at: ago(0, m.hours),
      };
      lead_emails.push(email);
      lead_events.push({ id: randomUUID(), lead_id: row.id, type: "email", body: mailLog.event(email), created_at: email.sent_at });
    }
  }

  const leadId = (name: string) => leads.find((l) => l.company_name === name)!.id;
  const inquiries: Row[] = [
    {
      id: randomUUID(),
      company: "Donau Kühltechnik GmbH",
      name: "Andrea Berger",
      email: "a.berger@donau-kuehltechnik.example",
      phone: "+43 7242 555 0102",
      country: "Austria",
      positions: "4× WIG-Schweißer Edelstahl",
      headcount: 4,
      duration: "ca. 3 Monate",
      shift_pattern: "double",
      start_date: day(33),
      message: "Fertigung von Kältemodulen, ca. 3 Monate, Zweischichtbetrieb.",
      locale: "de",
      lead_id: leadId("Donau Kühltechnik GmbH"),
      created_at: ago(0, 5),
    },
    {
      id: randomUUID(),
      company: "Kalmar Hamnservice AB",
      name: "Johan Ek",
      email: "johan.ek@kalmar-hamn.example",
      phone: null,
      country: "Sweden",
      positions: "2× industrielektriker, 1× mekaniker",
      headcount: 3,
      duration: "cirka 2 månader",
      shift_pattern: "single",
      start_date: day(10),
      message: "Underhåll av kranar, cirka 2 månader.",
      locale: "sv",
      lead_id: leadId("Kalmar Hamnservice AB"),
      created_at: ago(4),
    },
  ];

  const market_reports: Row[] = [
    {
      id: randomUUID(),
      country: "Nemecko",
      roles: ["zvárači", "montéri"],
      industries: ["strojárstvo", "automotive"],
      question: "Kde je najväčší dopyt po zváračoch na projekty na 3–12 mesiacov?",
      status: "done",
      report: MARKET_REPORT,
      log: [
        marketLog.researching("Nemecko · zvárači, montéri"),
        `${marketLog.researched(18)}\n\n${MARKET_NOTES}\n`,
        marketLog.saved(MARKET_REPORT.companies.length, MARKET_REPORT.sources.length),
      ].join("\n"),
      error: null,
      usage: { web_searches: 18 },
      created_at: ago(3, 2),
      finished_at: ago(3, 1.9),
    },
  ];

  return {
    campaigns,
    lead_runs,
    leads,
    lead_events,
    inquiries,
    settings: [
      { key: "company_profile", value: COMPANY_PROFILE, updated_at: ago(14) },
      {
        key: "mail_sync",
        value: {
          folders: {},
          last_run_at: ago(0, 0.3),
          last_ok_at: ago(0, 0.3),
          last_error: null,
          running_since: null,
          stats: { scanned: 14, matched: 0, saved: 0, remaining: 0 },
        },
        updated_at: ago(0, 0.3),
      },
    ],
    market_reports,
    lead_emails,
    projects: seedProjects.map((p) => ({ id: randomUUID(), ...toRow(p), created_at: ago(1), updated_at: ago(1) })),
  };
}
