import type { Locale } from "@/i18n/config";
import type { DivisionSlug, SectorSlug } from "./site";

/** The text of a project in one language. A language without a title is not published in that language. */
export type ProjectText = {
  title: string;
  /** "Krajina" as the owner writes it: country and town, e.g. "Nemecko – Papenburg". */
  location: string;
  /** "Odvetvie" in the owner's words, e.g. "Lodný priemysel". */
  industry: string;
  /** "Miesto realizácie": plant, shipyard or site. */
  site?: string;
  /** "Projekt": the name of the client's project, when there is one. */
  name?: string;
  /** One or two sentences on the card. */
  summary: string;
  /** "Popis projektu": the professional description on the project page. */
  description: string;
  /** "Rozsah vykonaných prác": one item per line. */
  scope: string[];
};

export const partyRoles = ["client", "endClient", "partner", "mainContractor"] as const;
export type PartyRole = (typeof partyRoles)[number];
export type Party = { role: PartyRole; name: string };

export type ProjectStatus = "ongoing" | "completed";

/**
 * A project as stored (table `projects`, see supabase/migrations/0005_projects.sql) and edited in the admin.
 * Customer names, the headcount and the project's own photos are shown on the site only once the owner has
 * approved each of them (`approved`); until then the card uses the illustrative `stockPhoto` from public/img.
 */
export type ProjectRecord = {
  id?: string;
  /** URL slug: /<locale>/projects/<slug>. Lowercase letters, digits and dashes. */
  slug: string;
  /** Order on the site, 1 first; also the number on the card. */
  position: number;
  published: boolean;
  sector: SectorSlug;
  divisions: DivisionSlug[];
  periodFrom: number;
  /** Last year of the work; null or the same year shows one year. */
  periodTo: number | null;
  /** Shown only when set; a project without status shows no badge. */
  status: ProjectStatus | null;
  /** Number of our people on the project. */
  team: number | null;
  /** "≈ 250": the headcount is approximate. */
  teamApprox: boolean;
  parties: Party[];
  /** The project's own main photo (URL), shown once photos are approved. */
  photo: string | null;
  /** The project's own photos for the gallery (URLs), shown once photos are approved. */
  gallery: string[];
  /** Illustrative photo slug in public/img, used until the project's own photos are approved. */
  stockPhoto: string | null;
  approved: { parties: boolean; team: boolean; photos: boolean };
  text: Partial<Record<Locale, ProjectText>>;
};

/**
 * What the public site may show of a project: unapproved customer names, headcount and photos are already removed,
 * and the text is the one of the page's language.
 */
export type PublicProject = Omit<ProjectRecord, "text" | "approved" | "id"> & { number: number; text: ProjectText };

/**
 * The owner's projects as handed over on 2026-11-07, in the order of the owner's visualisation. The migration
 * 0005_projects.sql loads the same data into the database; after that the admin is the place to edit them, and this
 * list is used only while the table does not exist yet (and by the local preview). Customer names, headcounts and
 * photos start unapproved.
 */
export const seedProjects: ProjectRecord[] = [
  {
    slug: "meyer-werft-cruise-ship-724",
    position: 1,
    published: true,
    sector: "shipbuilding",
    divisions: ["welding-piping", "mechanical-maintenance"],
    periodFrom: 2026,
    periodTo: null,
    status: null,
    team: null,
    teamApprox: false,
    parties: [{ role: "client", name: "LTH-Baas GmbH" }],
    photo: null,
    gallery: [],
    stockPhoto: "sector-shipbuilding",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Montáž potrubných a technologických systémov na výletnej lodi",
        location: "Nemecko – Papenburg",
        industry: "Lodný priemysel",
        site: "Meyer Werft, Papenburg",
        name: "Výstavba výletnej lode č. 724",
        summary:
          "Montáž a inštalácia potrubných rozvodov, vysokotlakových protipožiarnych systémov HI-FOG a vzduchotechnických zariadení HVAC v rámci výstavby novej výletnej lode č. 724.",
        description:
          "Montáž a inštalácia potrubných rozvodov, vysokotlakových protipožiarnych systémov HI-FOG a vzduchotechnických zariadení HVAC v rámci výstavby novej výletnej lode. Práce zahŕňajú odbornú montáž, kompletizáciu a technickú integráciu potrubných a technologických systémov podľa projektovej dokumentácie a požiadaviek lodenice.",
        scope: [
          "Montáž a inštalácia potrubných rozvodov",
          "Vysokotlakové protipožiarne systémy HI-FOG",
          "Vzduchotechnické zariadenia HVAC",
          "Kompletizácia a technická integrácia technologických systémov",
          "Práce podľa projektovej dokumentácie a požiadaviek lodenice",
        ],
      },
      en: {
        title: "Installation of piping and technical systems on a cruise ship",
        location: "Germany – Papenburg",
        industry: "Shipbuilding",
        site: "Meyer Werft, Papenburg",
        name: "Construction of cruise ship no. 724",
        summary:
          "Installation of piping, HI-FOG high-pressure fire protection systems and HVAC equipment during the construction of the new cruise ship no. 724.",
        description:
          "Installation of piping, HI-FOG high-pressure fire protection systems and HVAC equipment during the construction of a new cruise ship. The work covers the professional installation, completion and technical integration of piping and technical systems in line with the design documentation and the shipyard's requirements.",
        scope: [
          "Installation of piping systems",
          "HI-FOG high-pressure fire protection systems",
          "HVAC ventilation and air-conditioning equipment",
          "Completion and technical integration of the systems",
          "Work to the design documentation and the shipyard's requirements",
        ],
      },
      de: {
        title: "Montage von Rohrleitungs- und technischen Systemen auf einem Kreuzfahrtschiff",
        location: "Deutschland – Papenburg",
        industry: "Schiffbau",
        site: "Meyer Werft, Papenburg",
        name: "Neubau des Kreuzfahrtschiffs Nr. 724",
        summary:
          "Montage und Installation von Rohrleitungen, HI-FOG-Hochdruck-Brandschutzsystemen und HVAC-Anlagen beim Neubau des Kreuzfahrtschiffs Nr. 724.",
        description:
          "Montage und Installation von Rohrleitungen, HI-FOG-Hochdruck-Brandschutzsystemen und HVAC-Anlagen beim Neubau eines Kreuzfahrtschiffs. Die Arbeiten umfassen die fachgerechte Montage, die Komplettierung und die technische Integration der Rohrleitungs- und technischen Systeme nach Projektdokumentation und den Vorgaben der Werft.",
        scope: [
          "Montage und Installation von Rohrleitungen",
          "HI-FOG-Hochdruck-Brandschutzsysteme",
          "HVAC-Anlagen (Lüftung und Klima)",
          "Komplettierung und technische Integration der Systeme",
          "Ausführung nach Projektdokumentation und Vorgaben der Werft",
        ],
      },
      fr: {
        title: "Montage de tuyauteries et de systèmes techniques sur un navire de croisière",
        location: "Allemagne – Papenburg",
        industry: "Construction navale",
        site: "Meyer Werft, Papenburg",
        name: "Construction du navire de croisière n° 724",
        summary:
          "Montage et installation de tuyauteries, de systèmes de protection incendie haute pression HI-FOG et d'équipements CVC lors de la construction du nouveau navire de croisière n° 724.",
        description:
          "Montage et installation de tuyauteries, de systèmes de protection incendie haute pression HI-FOG et d'équipements CVC lors de la construction d'un nouveau navire de croisière. Les travaux comprennent le montage, l'achèvement et l'intégration technique des tuyauteries et des systèmes techniques selon la documentation du projet et les exigences du chantier naval.",
        scope: [
          "Montage et installation de tuyauteries",
          "Systèmes de protection incendie haute pression HI-FOG",
          "Équipements CVC (ventilation et climatisation)",
          "Achèvement et intégration technique des systèmes",
          "Travaux selon la documentation du projet et les exigences du chantier naval",
        ],
      },
      sv: {
        title: "Montage av rörsystem och tekniska system på ett kryssningsfartyg",
        location: "Tyskland – Papenburg",
        industry: "Varvsindustri",
        site: "Meyer Werft, Papenburg",
        name: "Bygget av kryssningsfartyg nr 724",
        summary:
          "Montage och installation av rörsystem, HI-FOG högtrycksbrandskydd och VVS-/ventilationsutrustning vid bygget av det nya kryssningsfartyget nr 724.",
        description:
          "Montage och installation av rörsystem, HI-FOG högtrycksbrandskydd och ventilations- och klimatutrustning (HVAC) vid bygget av ett nytt kryssningsfartyg. Arbetet omfattar fackmässigt montage, komplettering och teknisk integration av rörsystem och tekniska system enligt projekthandlingarna och varvets krav.",
        scope: [
          "Montage och installation av rörsystem",
          "HI-FOG högtrycksbrandskydd",
          "Ventilations- och klimatutrustning (HVAC)",
          "Komplettering och teknisk integration av systemen",
          "Arbete enligt projekthandlingar och varvets krav",
        ],
      },
      pl: {
        title: "Montaż rurociągów i systemów technologicznych na statku wycieczkowym",
        location: "Niemcy – Papenburg",
        industry: "Przemysł stoczniowy",
        site: "Meyer Werft, Papenburg",
        name: "Budowa statku wycieczkowego nr 724",
        summary:
          "Montaż i instalacja rurociągów, wysokociśnieniowych systemów przeciwpożarowych HI-FOG oraz urządzeń HVAC przy budowie nowego statku wycieczkowego nr 724.",
        description:
          "Montaż i instalacja rurociągów, wysokociśnieniowych systemów przeciwpożarowych HI-FOG oraz urządzeń wentylacyjno-klimatyzacyjnych HVAC przy budowie nowego statku wycieczkowego. Prace obejmują fachowy montaż, kompletację i integrację techniczną rurociągów i systemów technologicznych zgodnie z dokumentacją projektową i wymaganiami stoczni.",
        scope: [
          "Montaż i instalacja rurociągów",
          "Wysokociśnieniowe systemy przeciwpożarowe HI-FOG",
          "Urządzenia wentylacyjno-klimatyzacyjne HVAC",
          "Kompletacja i integracja techniczna systemów",
          "Prace zgodnie z dokumentacją projektową i wymaganiami stoczni",
        ],
      },
    },
  },
  {
    slug: "robinson-alpenrose-zurs",
    position: 2,
    published: true,
    sector: "buildings",
    divisions: ["electrical-automation"],
    periodFrom: 2026,
    periodTo: null,
    status: null,
    team: null,
    teamApprox: false,
    parties: [{ role: "client", name: "Fiegl & Spielberger GmbH" }],
    photo: null,
    gallery: [],
    stockPhoto: "sector-buildings",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Elektroinštalácie hotelového komplexu Robinson Alpenrose",
        location: "Rakúsko – Zürs",
        industry: "Stavebníctvo a technické zariadenia budov",
        site: "Robinson Alpenrose, Zürs",
        summary: "Realizácia elektroinštalačných, demontážnych, káblových a montážnych prác v rámci rekonštrukcie a modernizácie hotelového komplexu.",
        description:
          "Realizácia elektroinštalačných, demontážnych, káblových a montážnych prác v rámci rekonštrukcie a modernizácie hotelového komplexu. Rozsah prác zahŕňa inštaláciu elektrických rozvodov, montáž káblových trás, zapájanie elektroinštalačných prvkov a kompletizačné práce podľa technickej dokumentácie a požiadaviek projektu.",
        scope: [
          "Demontáž pôvodných elektroinštalácií",
          "Inštalácia elektrických rozvodov",
          "Montáž káblových trás",
          "Zapájanie elektroinštalačných prvkov",
          "Kompletizačné práce podľa technickej dokumentácie",
        ],
      },
      en: {
        title: "Electrical installations at the Robinson Alpenrose hotel complex",
        location: "Austria – Zürs",
        industry: "Building services",
        site: "Robinson Alpenrose, Zürs",
        summary: "Electrical installation, dismantling, cabling and assembly work during the renovation and modernisation of a hotel complex.",
        description:
          "Electrical installation, dismantling, cabling and assembly work during the renovation and modernisation of a hotel complex. The work covers installing electrical distribution, mounting cable routes, connecting electrical installation components and completion work in line with the technical documentation and the project's requirements.",
        scope: [
          "Dismantling of the existing electrical installations",
          "Installation of electrical distribution",
          "Mounting of cable routes",
          "Connecting electrical installation components",
          "Completion work to the technical documentation",
        ],
      },
      de: {
        title: "Elektroinstallationen im Hotelkomplex Robinson Alpenrose",
        location: "Österreich – Zürs",
        industry: "Technische Gebäudeausrüstung",
        site: "Robinson Alpenrose, Zürs",
        summary: "Elektroinstallations-, Demontage-, Kabel- und Montagearbeiten bei der Renovierung und Modernisierung eines Hotelkomplexes.",
        description:
          "Elektroinstallations-, Demontage-, Kabel- und Montagearbeiten bei der Renovierung und Modernisierung eines Hotelkomplexes. Der Leistungsumfang umfasst die Installation der elektrischen Verteilung, die Montage von Kabeltrassen, das Anschließen der Elektroinstallationskomponenten und Komplettierungsarbeiten nach technischer Dokumentation und Projektvorgaben.",
        scope: [
          "Demontage der bestehenden Elektroinstallation",
          "Installation der elektrischen Verteilung",
          "Montage von Kabeltrassen",
          "Anschließen der Elektroinstallationskomponenten",
          "Komplettierungsarbeiten nach technischer Dokumentation",
        ],
      },
      fr: {
        title: "Installations électriques du complexe hôtelier Robinson Alpenrose",
        location: "Autriche – Zürs",
        industry: "Équipements techniques du bâtiment",
        site: "Robinson Alpenrose, Zürs",
        summary: "Travaux d'installation électrique, de démontage, de câblage et de montage lors de la rénovation et de la modernisation d'un complexe hôtelier.",
        description:
          "Travaux d'installation électrique, de démontage, de câblage et de montage lors de la rénovation et de la modernisation d'un complexe hôtelier. Les travaux comprennent l'installation des réseaux électriques, le montage des chemins de câbles, le raccordement des équipements électriques et les travaux de finition selon la documentation technique et les exigences du projet.",
        scope: [
          "Démontage des installations électriques existantes",
          "Installation des réseaux électriques",
          "Montage des chemins de câbles",
          "Raccordement des équipements électriques",
          "Travaux de finition selon la documentation technique",
        ],
      },
      sv: {
        title: "Elinstallationer i hotellkomplexet Robinson Alpenrose",
        location: "Österrike – Zürs",
        industry: "Byggnadsteknik och installationer",
        site: "Robinson Alpenrose, Zürs",
        summary: "Elinstallation, demontage, kabeldragning och montage vid renoveringen och moderniseringen av ett hotellkomplex.",
        description:
          "Elinstallation, demontage, kabeldragning och montage vid renoveringen och moderniseringen av ett hotellkomplex. Arbetet omfattar installation av elfördelning, montage av kabelstegar, inkoppling av elinstallationskomponenter och kompletteringsarbeten enligt de tekniska handlingarna och projektets krav.",
        scope: [
          "Demontage av befintliga elinstallationer",
          "Installation av elfördelning",
          "Montage av kabelstegar",
          "Inkoppling av elinstallationskomponenter",
          "Kompletteringsarbeten enligt tekniska handlingar",
        ],
      },
      pl: {
        title: "Instalacje elektryczne w kompleksie hotelowym Robinson Alpenrose",
        location: "Austria – Zürs",
        industry: "Budownictwo i instalacje budynkowe",
        site: "Robinson Alpenrose, Zürs",
        summary: "Prace elektroinstalacyjne, demontażowe, kablowe i montażowe przy przebudowie i modernizacji kompleksu hotelowego.",
        description:
          "Prace elektroinstalacyjne, demontażowe, kablowe i montażowe przy przebudowie i modernizacji kompleksu hotelowego. Zakres prac obejmuje instalację rozdzielnic i obwodów elektrycznych, montaż tras kablowych, podłączanie elementów instalacji elektrycznej oraz prace wykończeniowe zgodnie z dokumentacją techniczną i wymaganiami projektu.",
        scope: [
          "Demontaż istniejących instalacji elektrycznych",
          "Instalacja obwodów elektrycznych",
          "Montaż tras kablowych",
          "Podłączanie elementów instalacji elektrycznej",
          "Prace wykończeniowe zgodnie z dokumentacją techniczną",
        ],
      },
    },
  },
  {
    slug: "electrical-installation-european-projects",
    position: 3,
    published: true,
    sector: "manufacturing",
    divisions: ["electrical-automation"],
    periodFrom: 2026,
    periodTo: 2027,
    status: null,
    team: null,
    teamApprox: false,
    parties: [{ role: "client", name: "SES Ship Electric Service GmbH" }],
    photo: null,
    gallery: [],
    stockPhoto: "sector-electrical",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Elektromontážne práce na európskych projektoch",
        location: "Rakúsko / ďalšie európske lokality",
        industry: "Elektrotechnika a priemyselné inštalácie",
        site: "Celá Európa",
        summary:
          "Poskytovanie kvalifikovaných elektrotechnikov na realizáciu elektroinštalácií, montáž a zapájanie elektrických zariadení a rozvádzačov, základné merania a technickú podporu pri realizácii projektov.",
        description:
          "Poskytovanie kvalifikovaných elektrotechnikov na realizáciu elektroinštalácií, montáž a zapájanie elektrických zariadení a rozvádzačov, základné elektrotechnické merania a technickú podporu pri realizácii projektov. Práce zahŕňajú odborné elektroinštalačné činnosti, zapájanie elektrických komponentov a súvisiace montážne a servisné práce podľa požiadaviek zákazníka.",
        scope: [
          "Elektroinštalačné práce",
          "Montáž a zapájanie elektrických zariadení a rozvádzačov",
          "Základné elektrotechnické merania",
          "Montážne a servisné práce podľa požiadaviek zákazníka",
          "Technická podpora pri realizácii projektov",
        ],
      },
      en: {
        title: "Electrical installation work on European projects",
        location: "Austria / other European locations",
        industry: "Electrical engineering and industrial installations",
        site: "Across Europe",
        summary:
          "Qualified electricians for electrical installations, mounting and wiring of electrical equipment and switchboards, basic measurements and technical support on projects.",
        description:
          "Qualified electricians for electrical installations, mounting and wiring of electrical equipment and switchboards, basic electrical measurements and technical support on projects. The work covers professional electrical installation, connecting electrical components and the related assembly and service work to the customer's requirements.",
        scope: [
          "Electrical installation work",
          "Mounting and wiring of electrical equipment and switchboards",
          "Basic electrical measurements",
          "Assembly and service work to the customer's requirements",
          "Technical support on the projects",
        ],
      },
      de: {
        title: "Elektromontagearbeiten bei europäischen Projekten",
        location: "Österreich / weitere europäische Standorte",
        industry: "Elektrotechnik und Industrieinstallationen",
        site: "Ganz Europa",
        summary:
          "Qualifizierte Elektrotechniker für Elektroinstallationen, Montage und Anschluss elektrischer Anlagen und Schaltschränke, Grundmessungen und technische Unterstützung bei Projekten.",
        description:
          "Qualifizierte Elektrotechniker für Elektroinstallationen, Montage und Anschluss elektrischer Anlagen und Schaltschränke, elektrotechnische Grundmessungen und technische Unterstützung bei der Projektabwicklung. Die Arbeiten umfassen fachgerechte Elektroinstallation, das Anschließen elektrischer Komponenten sowie zugehörige Montage- und Servicearbeiten nach Kundenvorgaben.",
        scope: [
          "Elektroinstallationsarbeiten",
          "Montage und Anschluss elektrischer Anlagen und Schaltschränke",
          "Elektrotechnische Grundmessungen",
          "Montage- und Servicearbeiten nach Kundenvorgaben",
          "Technische Unterstützung bei der Projektabwicklung",
        ],
      },
      fr: {
        title: "Travaux de montage électrique sur des projets européens",
        location: "Autriche / autres sites en Europe",
        industry: "Électrotechnique et installations industrielles",
        site: "Toute l'Europe",
        summary:
          "Électriciens qualifiés pour les installations électriques, le montage et le raccordement d'équipements et d'armoires électriques, les mesures de base et l'assistance technique sur les projets.",
        description:
          "Électriciens qualifiés pour les installations électriques, le montage et le raccordement d'équipements et d'armoires électriques, les mesures électriques de base et l'assistance technique dans la réalisation des projets. Les travaux comprennent l'installation électrique, le raccordement des composants électriques et les travaux de montage et de service associés selon les exigences du client.",
        scope: [
          "Travaux d'installation électrique",
          "Montage et raccordement d'équipements et d'armoires électriques",
          "Mesures électriques de base",
          "Travaux de montage et de service selon les exigences du client",
          "Assistance technique dans la réalisation des projets",
        ],
      },
      sv: {
        title: "Elmontage i europeiska projekt",
        location: "Österrike / andra platser i Europa",
        industry: "Elteknik och industriinstallationer",
        site: "Hela Europa",
        summary:
          "Kvalificerade elektriker för elinstallationer, montage och inkoppling av elutrustning och ställverk, grundläggande mätningar och tekniskt stöd i projekten.",
        description:
          "Kvalificerade elektriker för elinstallationer, montage och inkoppling av elutrustning och ställverk, grundläggande elmätningar och tekniskt stöd vid genomförandet av projekten. Arbetet omfattar fackmässiga elinstallationer, inkoppling av elkomponenter och tillhörande montage- och servicearbeten enligt kundens krav.",
        scope: [
          "Elinstallationsarbeten",
          "Montage och inkoppling av elutrustning och ställverk",
          "Grundläggande elmätningar",
          "Montage- och servicearbeten enligt kundens krav",
          "Tekniskt stöd vid genomförandet av projekten",
        ],
      },
      pl: {
        title: "Prace elektromontażowe przy projektach europejskich",
        location: "Austria / inne lokalizacje w Europie",
        industry: "Elektrotechnika i instalacje przemysłowe",
        site: "Cała Europa",
        summary:
          "Wykwalifikowani elektrycy do instalacji elektrycznych, montażu i podłączania urządzeń elektrycznych i rozdzielnic, podstawowych pomiarów oraz wsparcia technicznego przy projektach.",
        description:
          "Wykwalifikowani elektrycy do wykonywania instalacji elektrycznych, montażu i podłączania urządzeń elektrycznych i rozdzielnic, podstawowych pomiarów elektrycznych oraz wsparcia technicznego przy realizacji projektów. Prace obejmują fachowe prace elektroinstalacyjne, podłączanie komponentów elektrycznych oraz związane z nimi prace montażowe i serwisowe zgodnie z wymaganiami klienta.",
        scope: [
          "Prace elektroinstalacyjne",
          "Montaż i podłączanie urządzeń elektrycznych i rozdzielnic",
          "Podstawowe pomiary elektryczne",
          "Prace montażowe i serwisowe zgodnie z wymaganiami klienta",
          "Wsparcie techniczne przy realizacji projektów",
        ],
      },
    },
  },
  {
    slug: "shotton-mill-deeside",
    position: 4,
    published: true,
    sector: "manufacturing",
    divisions: ["electrical-automation"],
    periodFrom: 2026,
    periodTo: null,
    status: null,
    team: null,
    teamApprox: false,
    parties: [{ role: "client", name: "R11 Automation Sp. z o.o." }],
    photo: null,
    gallery: [],
    stockPhoto: "sector-manufacturing",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Elektromontáže pri výstavbe priemyselného závodu Shotton Mill",
        location: "Spojené kráľovstvo – Deeside",
        industry: "Papierenský priemysel",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Elektromontážne a technické práce v rámci výstavby a technologického vybavenia závodu Shotton Mill. Montáž káblových trás, inštalácia a zapájanie zariadení, pokládka silových a ovládacích káblov a elektrická integrácia technológií.",
        description:
          "Elektromontážne a technické práce v rámci výstavby a technologického vybavenia priemyselného závodu Shotton Mill. Rozsah projektu zahŕňa montáž káblových trás, inštaláciu a zapájanie elektrických zariadení, pokládku silových a ovládacích káblov, elektrickú integráciu technologických celkov a technickú podporu pri uvádzaní priemyselných systémov do prevádzky.",
        scope: [
          "Montáž káblových trás",
          "Inštalácia a zapájanie elektrických zariadení",
          "Pokládka silových a ovládacích káblov",
          "Elektrická integrácia technologických celkov",
          "Technická podpora pri uvádzaní systémov do prevádzky",
        ],
      },
      en: {
        title: "Electrical installation for the construction of the Shotton Mill plant",
        location: "United Kingdom – Deeside",
        industry: "Paper industry",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Electrical and technical work during the construction and fit-out of the Shotton Mill plant: cable routes, installing and connecting equipment, laying power and control cables and the electrical integration of the process units.",
        description:
          "Electrical installation and technical work during the construction and process fit-out of the Shotton Mill industrial plant. The project covers mounting cable routes, installing and connecting electrical equipment, laying power and control cables, the electrical integration of the process units and technical support during the commissioning of the industrial systems.",
        scope: [
          "Mounting of cable routes",
          "Installing and connecting electrical equipment",
          "Laying power and control cables",
          "Electrical integration of the process units",
          "Technical support during commissioning",
        ],
      },
      de: {
        title: "Elektromontage beim Bau des Industriewerks Shotton Mill",
        location: "Vereinigtes Königreich – Deeside",
        industry: "Papierindustrie",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Elektromontage- und technische Arbeiten beim Bau und der technologischen Ausrüstung des Werks Shotton Mill: Kabeltrassen, Installation und Anschluss von Anlagen, Verlegung von Energie- und Steuerkabeln und elektrische Integration der Anlagenteile.",
        description:
          "Elektromontage- und technische Arbeiten beim Bau und der technologischen Ausrüstung des Industriewerks Shotton Mill. Der Projektumfang umfasst die Montage von Kabeltrassen, die Installation und den Anschluss elektrischer Anlagen, die Verlegung von Energie- und Steuerkabeln, die elektrische Integration der Anlagenteile und technische Unterstützung bei der Inbetriebnahme der Industriesysteme.",
        scope: [
          "Montage von Kabeltrassen",
          "Installation und Anschluss elektrischer Anlagen",
          "Verlegung von Energie- und Steuerkabeln",
          "Elektrische Integration der Anlagenteile",
          "Technische Unterstützung bei der Inbetriebnahme",
        ],
      },
      fr: {
        title: "Montage électrique pour la construction de l'usine Shotton Mill",
        location: "Royaume-Uni – Deeside",
        industry: "Industrie papetière",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Travaux électriques et techniques lors de la construction et de l'équipement de l'usine Shotton Mill : chemins de câbles, installation et raccordement des équipements, pose de câbles de puissance et de commande, intégration électrique des unités.",
        description:
          "Travaux de montage électrique et travaux techniques lors de la construction et de l'équipement technologique de l'usine Shotton Mill. Le projet comprend le montage des chemins de câbles, l'installation et le raccordement des équipements électriques, la pose des câbles de puissance et de commande, l'intégration électrique des unités de production et l'assistance technique lors de la mise en service des systèmes industriels.",
        scope: [
          "Montage des chemins de câbles",
          "Installation et raccordement des équipements électriques",
          "Pose des câbles de puissance et de commande",
          "Intégration électrique des unités de production",
          "Assistance technique lors de la mise en service",
        ],
      },
      sv: {
        title: "Elmontage vid bygget av industrianläggningen Shotton Mill",
        location: "Storbritannien – Deeside",
        industry: "Pappersindustri",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Elmontage och tekniska arbeten vid bygget och utrustningen av Shotton Mill: kabelstegar, installation och inkoppling av utrustning, förläggning av kraft- och styrkablar och elektrisk integration av processdelarna.",
        description:
          "Elmontage och tekniska arbeten vid bygget och den processtekniska utrustningen av industrianläggningen Shotton Mill. Projektet omfattar montage av kabelstegar, installation och inkoppling av elutrustning, förläggning av kraft- och styrkablar, elektrisk integration av processdelarna och tekniskt stöd vid driftsättningen av industrisystemen.",
        scope: [
          "Montage av kabelstegar",
          "Installation och inkoppling av elutrustning",
          "Förläggning av kraft- och styrkablar",
          "Elektrisk integration av processdelarna",
          "Tekniskt stöd vid driftsättning",
        ],
      },
      pl: {
        title: "Elektromontaż przy budowie zakładu przemysłowego Shotton Mill",
        location: "Wielka Brytania – Deeside",
        industry: "Przemysł papierniczy",
        site: "Shotton Mill, Deeside",
        name: "Shotton Paper Mill",
        summary:
          "Prace elektromontażowe i techniczne przy budowie i wyposażeniu zakładu Shotton Mill: trasy kablowe, instalacja i podłączanie urządzeń, układanie kabli zasilających i sterowniczych oraz elektryczna integracja technologii.",
        description:
          "Prace elektromontażowe i techniczne przy budowie i wyposażeniu technologicznym zakładu przemysłowego Shotton Mill. Zakres projektu obejmuje montaż tras kablowych, instalację i podłączanie urządzeń elektrycznych, układanie kabli zasilających i sterowniczych, elektryczną integrację węzłów technologicznych oraz wsparcie techniczne przy uruchamianiu systemów przemysłowych.",
        scope: [
          "Montaż tras kablowych",
          "Instalacja i podłączanie urządzeń elektrycznych",
          "Układanie kabli zasilających i sterowniczych",
          "Elektryczna integracja węzłów technologicznych",
          "Wsparcie techniczne przy uruchomieniu",
        ],
      },
    },
  },
  {
    slug: "disney-adventure-wismar",
    position: 5,
    published: true,
    sector: "shipbuilding",
    divisions: ["electrical-automation", "welding-piping"],
    periodFrom: 2025,
    periodTo: 2026,
    status: "completed",
    team: 250,
    teamApprox: true,
    parties: [{ role: "client", name: "AS LTH-Baas" }],
    photo: null,
    gallery: [],
    stockPhoto: "division-electrical",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Elektroinštalácie, potrubárske a zváračské práce pri výstavbe výletnej lode",
        location: "Nemecko – Wismar",
        industry: "Lodný priemysel",
        site: "Meyer Wismar",
        name: "Výstavba výletnej lode Disney Adventure",
        summary:
          "Komplexné elektroinštalačné, potrubárske a zváračské práce v rámci výstavby novej výletnej lode Disney Adventure – montáž káblových trás, ťahanie a zapájanie káblov, inštalácia potrubných rozvodov a montáž technologických systémov.",
        description:
          "Komplexné elektroinštalačné, potrubárske a zváračské práce v rámci výstavby novej výletnej lode. Rozsah realizácie zahŕňal montáž káblových trás, ťahanie a zapájanie elektrických káblov, inštaláciu potrubných rozvodov, montáž technologických systémov a odborné zváračské práce súvisiace s kompletizáciou lodných zariadení.",
        scope: [
          "Montáž káblových trás",
          "Ťahanie a zapájanie elektrických káblov",
          "Inštalácia potrubných rozvodov",
          "Montáž technologických systémov",
          "Zváračské práce pri kompletizácii lodných zariadení",
        ],
      },
      en: {
        title: "Electrical, pipefitting and welding work on a cruise ship newbuild",
        location: "Germany – Wismar",
        industry: "Shipbuilding",
        site: "Meyer Wismar",
        name: "Construction of the cruise ship Disney Adventure",
        summary:
          "Electrical, pipefitting and welding work during the construction of the new cruise ship Disney Adventure: cable routes, pulling and connecting cables, piping installation and mounting of technical systems.",
        description:
          "Comprehensive electrical, pipefitting and welding work during the construction of a new cruise ship. The work covered mounting cable routes, pulling and connecting electrical cables, installing piping, mounting technical systems and the welding work for completing the ship's equipment.",
        scope: [
          "Mounting of cable routes",
          "Pulling and connecting electrical cables",
          "Installation of piping",
          "Mounting of technical systems",
          "Welding work for completing the ship's equipment",
        ],
      },
      de: {
        title: "Elektroinstallations-, Rohrleitungs- und Schweißarbeiten beim Neubau eines Kreuzfahrtschiffs",
        location: "Deutschland – Wismar",
        industry: "Schiffbau",
        site: "Meyer Wismar",
        name: "Neubau des Kreuzfahrtschiffs Disney Adventure",
        summary:
          "Elektroinstallations-, Rohrleitungs- und Schweißarbeiten beim Neubau des Kreuzfahrtschiffs Disney Adventure: Kabeltrassen, Kabelzug und Anschluss, Rohrleitungsinstallation und Montage technischer Systeme.",
        description:
          "Umfassende Elektroinstallations-, Rohrleitungs- und Schweißarbeiten beim Neubau eines Kreuzfahrtschiffs. Der Leistungsumfang umfasste die Montage von Kabeltrassen, das Ziehen und Anschließen elektrischer Kabel, die Installation von Rohrleitungen, die Montage technischer Systeme sowie Schweißarbeiten bei der Komplettierung der Schiffsausrüstung.",
        scope: [
          "Montage von Kabeltrassen",
          "Ziehen und Anschließen elektrischer Kabel",
          "Installation von Rohrleitungen",
          "Montage technischer Systeme",
          "Schweißarbeiten bei der Komplettierung der Schiffsausrüstung",
        ],
      },
      fr: {
        title: "Travaux électriques, de tuyauterie et de soudage pour la construction d'un navire de croisière",
        location: "Allemagne – Wismar",
        industry: "Construction navale",
        site: "Meyer Wismar",
        name: "Construction du navire de croisière Disney Adventure",
        summary:
          "Travaux électriques, de tuyauterie et de soudage lors de la construction du nouveau navire de croisière Disney Adventure : chemins de câbles, tirage et raccordement des câbles, tuyauteries et montage des systèmes techniques.",
        description:
          "Travaux complets d'installation électrique, de tuyauterie et de soudage lors de la construction d'un nouveau navire de croisière. Les travaux comprenaient le montage des chemins de câbles, le tirage et le raccordement des câbles électriques, l'installation des tuyauteries, le montage des systèmes techniques et le soudage lié à l'achèvement des équipements du navire.",
        scope: [
          "Montage des chemins de câbles",
          "Tirage et raccordement des câbles électriques",
          "Installation des tuyauteries",
          "Montage des systèmes techniques",
          "Soudage pour l'achèvement des équipements du navire",
        ],
      },
      sv: {
        title: "El-, rör- och svetsarbeten vid bygget av ett kryssningsfartyg",
        location: "Tyskland – Wismar",
        industry: "Varvsindustri",
        site: "Meyer Wismar",
        name: "Bygget av kryssningsfartyget Disney Adventure",
        summary:
          "El-, rör- och svetsarbeten vid bygget av det nya kryssningsfartyget Disney Adventure: kabelstegar, kabeldragning och inkoppling, rörinstallation och montage av tekniska system.",
        description:
          "Omfattande el-, rör- och svetsarbeten vid bygget av ett nytt kryssningsfartyg. Arbetet omfattade montage av kabelstegar, dragning och inkoppling av elkablar, installation av rörsystem, montage av tekniska system och svetsarbeten vid kompletteringen av fartygets utrustning.",
        scope: [
          "Montage av kabelstegar",
          "Dragning och inkoppling av elkablar",
          "Installation av rörsystem",
          "Montage av tekniska system",
          "Svetsarbeten vid komplettering av fartygets utrustning",
        ],
      },
      pl: {
        title: "Prace elektroinstalacyjne, rurarskie i spawalnicze przy budowie statku wycieczkowego",
        location: "Niemcy – Wismar",
        industry: "Przemysł stoczniowy",
        site: "Meyer Wismar",
        name: "Budowa statku wycieczkowego Disney Adventure",
        summary:
          "Prace elektroinstalacyjne, rurarskie i spawalnicze przy budowie nowego statku wycieczkowego Disney Adventure: trasy kablowe, układanie i podłączanie kabli, instalacja rurociągów i montaż systemów technologicznych.",
        description:
          "Kompleksowe prace elektroinstalacyjne, rurarskie i spawalnicze przy budowie nowego statku wycieczkowego. Zakres obejmował montaż tras kablowych, układanie i podłączanie kabli elektrycznych, instalację rurociągów, montaż systemów technologicznych oraz prace spawalnicze związane z kompletacją urządzeń statku.",
        scope: [
          "Montaż tras kablowych",
          "Układanie i podłączanie kabli elektrycznych",
          "Instalacja rurociągów",
          "Montaż systemów technologicznych",
          "Prace spawalnicze przy kompletacji urządzeń statku",
        ],
      },
    },
  },
  {
    slug: "mochovce-nuclear-power-plant-piping",
    position: 6,
    published: true,
    sector: "energy",
    divisions: ["welding-piping", "mechanical-maintenance"],
    periodFrom: 2025,
    periodTo: 2026,
    status: "completed",
    team: null,
    teamApprox: false,
    parties: [{ role: "client", name: "CHEMCOMEX, a.s. – organizačná zložka Slovensko" }],
    photo: null,
    gallery: [],
    stockPhoto: "sector-energy",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Montáž potrubných rozvodov – Atómová elektráreň Mochovce",
        location: "Slovensko – Mochovce",
        industry: "Jadrová energetika",
        site: "Atómová elektráreň Mochovce",
        summary:
          "Realizácia odborných potrubárskych a zámočníckych prác v technologických priestoroch JE Mochovce – montáž potrubných rozvodov, súvisiace montážne činnosti a technická podpora podľa platných bezpečnostných predpisov.",
        description:
          "Realizácia odborných potrubárskych a zámočníckych prác v technologických priestoroch Atómovej elektrárne Mochovce. Projekt zahŕňal zabezpečenie kvalifikovaných technických pracovníkov na montáž potrubných rozvodov, súvisiace zámočnícke a montážne činnosti a technickú podporu pri realizácii prác podľa požiadaviek objednávateľa a platných bezpečnostných predpisov.",
        scope: [
          "Montáž potrubných rozvodov",
          "Zámočnícke a montážne práce",
          "Kvalifikovaní technickí pracovníci v technologických priestoroch elektrárne",
          "Technická podpora pri realizácii prác",
          "Práce podľa platných bezpečnostných predpisov",
        ],
      },
      en: {
        title: "Piping installation – Mochovce nuclear power plant",
        location: "Slovakia – Mochovce",
        industry: "Nuclear power",
        site: "Mochovce nuclear power plant",
        summary:
          "Pipefitting and locksmith work in the process areas of the Mochovce nuclear power plant: piping installation, related assembly work and technical support under the applicable safety regulations.",
        description:
          "Specialist pipefitting and locksmith work in the process areas of the Mochovce nuclear power plant. The project covered providing qualified technical staff for piping installation, the related locksmith and assembly work, and technical support during the work in line with the client's requirements and the applicable safety regulations.",
        scope: [
          "Piping installation",
          "Locksmith and assembly work",
          "Qualified technical staff in the plant's process areas",
          "Technical support during the work",
          "Work under the applicable safety regulations",
        ],
      },
      de: {
        title: "Rohrleitungsmontage – Kernkraftwerk Mochovce",
        location: "Slowakei – Mochovce",
        industry: "Kernenergie",
        site: "Kernkraftwerk Mochovce",
        summary:
          "Rohrleitungs- und Schlosserarbeiten in den technologischen Bereichen des KKW Mochovce: Rohrleitungsmontage, zugehörige Montagearbeiten und technische Unterstützung nach den geltenden Sicherheitsvorschriften.",
        description:
          "Fachgerechte Rohrleitungs- und Schlosserarbeiten in den technologischen Bereichen des Kernkraftwerks Mochovce. Das Projekt umfasste die Bereitstellung qualifizierter technischer Fachkräfte für die Rohrleitungsmontage, zugehörige Schlosser- und Montagearbeiten sowie technische Unterstützung bei der Ausführung nach den Vorgaben des Auftraggebers und den geltenden Sicherheitsvorschriften.",
        scope: [
          "Rohrleitungsmontage",
          "Schlosser- und Montagearbeiten",
          "Qualifizierte Fachkräfte in den technologischen Bereichen des Kraftwerks",
          "Technische Unterstützung bei der Ausführung",
          "Arbeiten nach den geltenden Sicherheitsvorschriften",
        ],
      },
      fr: {
        title: "Montage de tuyauteries – centrale nucléaire de Mochovce",
        location: "Slovaquie – Mochovce",
        industry: "Énergie nucléaire",
        site: "Centrale nucléaire de Mochovce",
        summary:
          "Travaux de tuyauterie et de serrurerie dans les locaux techniques de la centrale nucléaire de Mochovce : montage de tuyauteries, travaux de montage associés et assistance technique selon les règles de sécurité en vigueur.",
        description:
          "Travaux spécialisés de tuyauterie et de serrurerie dans les locaux techniques de la centrale nucléaire de Mochovce. Le projet comprenait la mise à disposition de techniciens qualifiés pour le montage des tuyauteries, les travaux de serrurerie et de montage associés, ainsi que l'assistance technique lors des travaux selon les exigences du donneur d'ordre et les règles de sécurité en vigueur.",
        scope: [
          "Montage de tuyauteries",
          "Travaux de serrurerie et de montage",
          "Techniciens qualifiés dans les locaux techniques de la centrale",
          "Assistance technique pendant les travaux",
          "Travaux selon les règles de sécurité en vigueur",
        ],
      },
      sv: {
        title: "Rörmontage – kärnkraftverket Mochovce",
        location: "Slovakien – Mochovce",
        industry: "Kärnkraft",
        site: "Kärnkraftverket Mochovce",
        summary:
          "Rör- och smidesarbeten i kärnkraftverket Mochovces processutrymmen: rörmontage, tillhörande montagearbeten och tekniskt stöd enligt gällande säkerhetsföreskrifter.",
        description:
          "Fackmässiga rör- och smidesarbeten i processutrymmena i kärnkraftverket Mochovce. Projektet omfattade kvalificerad teknisk personal för rörmontage, tillhörande smides- och montagearbeten samt tekniskt stöd vid arbetets genomförande enligt beställarens krav och gällande säkerhetsföreskrifter.",
        scope: [
          "Rörmontage",
          "Smides- och montagearbeten",
          "Kvalificerad teknisk personal i kraftverkets processutrymmen",
          "Tekniskt stöd vid arbetets genomförande",
          "Arbete enligt gällande säkerhetsföreskrifter",
        ],
      },
      pl: {
        title: "Montaż rurociągów – Elektrownia jądrowa Mochovce",
        location: "Słowacja – Mochovce",
        industry: "Energetyka jądrowa",
        site: "Elektrownia jądrowa Mochovce",
        summary:
          "Prace rurarskie i ślusarskie w pomieszczeniach technologicznych EJ Mochovce: montaż rurociągów, związane z nim prace montażowe i wsparcie techniczne zgodnie z obowiązującymi przepisami bezpieczeństwa.",
        description:
          "Specjalistyczne prace rurarskie i ślusarskie w pomieszczeniach technologicznych Elektrowni Jądrowej Mochovce. Projekt obejmował zapewnienie wykwalifikowanych pracowników technicznych do montażu rurociągów, związane z nim prace ślusarskie i montażowe oraz wsparcie techniczne przy realizacji prac zgodnie z wymaganiami zamawiającego i obowiązującymi przepisami bezpieczeństwa.",
        scope: [
          "Montaż rurociągów",
          "Prace ślusarskie i montażowe",
          "Wykwalifikowani pracownicy techniczni w pomieszczeniach technologicznych elektrowni",
          "Wsparcie techniczne przy realizacji prac",
          "Prace zgodnie z obowiązującymi przepisami bezpieczeństwa",
        ],
      },
    },
  },
  {
    slug: "ineos-project-one-antwerp",
    position: 7,
    published: true,
    sector: "chemical",
    divisions: ["electrical-automation"],
    periodFrom: 2026,
    periodTo: null,
    status: null,
    team: 40,
    teamApprox: true,
    parties: [
      { role: "client", name: "INELTRON Solutions, S.L.U." },
      { role: "endClient", name: "INEOS Olefins Belgium NV" },
      { role: "mainContractor", name: "Técnicas Reunidas S.A." },
    ],
    photo: null,
    gallery: [],
    stockPhoto: "sector-chemical",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Elektromontážne a káblové práce – INEOS Project ONE",
        location: "Belgicko – Antverpy",
        industry: "Petrochemický a chemický priemysel",
        site: "INEOS Project ONE, Antverpy",
        name: "Výstavba nového závodu na výrobu etylénu",
        summary:
          "Rozsiahle elektromontážne a káblové práce pri výstavbe nového závodu na výrobu etylénu INEOS Project ONE – pokládka a inštalácia silových, riadiacich a prístrojových káblov, ich vedenie v trasách a zapájanie v technologických prevádzkach.",
        description:
          "Rozsiahle elektromontážne a káblové práce v rámci výstavby moderného petrochemického závodu INEOS Project ONE v belgických Antverpách. Rozsah projektu zahŕňal pokládku a inštaláciu silových, riadiacich a prístrojových káblov, ich vedenie v káblových trasách a chráničkách, ako aj súvisiace montážne a kompletizačné činnosti a zapájanie v technologických prevádzkach. Práce boli sústredené najmä do oblastí elektrických rozvodní, chladiacich systémov a výrobných technológií.",
        scope: [
          "Pokládka a inštalácia silových, riadiacich a prístrojových káblov",
          "Vedenie káblov v káblových trasách a chráničkách",
          "Zapájanie v technologických prevádzkach",
          "Montážne a kompletizačné práce",
          "Elektrické rozvodne, chladiace systémy a výrobné technológie",
        ],
      },
      en: {
        title: "Electrical installation and cabling – INEOS Project ONE",
        location: "Belgium – Antwerp",
        industry: "Petrochemical and chemical industry",
        site: "INEOS Project ONE, Antwerp",
        name: "Construction of a new ethylene plant",
        summary:
          "Extensive electrical and cabling work during the construction of the new INEOS Project ONE ethylene plant: laying and installing power, control and instrumentation cables, routing them on cable trays and connecting them in the process units.",
        description:
          "Extensive electrical installation and cabling work during the construction of the modern INEOS Project ONE petrochemical plant in Antwerp, Belgium. The project covered laying and installing power, control and instrumentation cables, routing them on cable trays and in conduits, and the related assembly, completion and termination work in the process units. The work focused mainly on the electrical substations, the cooling systems and the production units.",
        scope: [
          "Laying and installing power, control and instrumentation cables",
          "Routing cables on cable trays and in conduits",
          "Terminations in the process units",
          "Assembly and completion work",
          "Electrical substations, cooling systems and production units",
        ],
      },
      de: {
        title: "Elektromontage- und Kabelarbeiten – INEOS Project ONE",
        location: "Belgien – Antwerpen",
        industry: "Petrochemische und chemische Industrie",
        site: "INEOS Project ONE, Antwerpen",
        name: "Bau einer neuen Ethylenanlage",
        summary:
          "Umfangreiche Elektromontage- und Kabelarbeiten beim Bau der neuen Ethylenanlage INEOS Project ONE: Verlegung und Installation von Energie-, Steuer- und Instrumentenkabeln, Führung auf Kabeltrassen und Anschluss in den Prozessanlagen.",
        description:
          "Umfangreiche Elektromontage- und Kabelarbeiten beim Bau des modernen petrochemischen Werks INEOS Project ONE in Antwerpen, Belgien. Der Projektumfang umfasste die Verlegung und Installation von Energie-, Steuer- und Instrumentenkabeln, ihre Führung auf Kabeltrassen und in Schutzrohren sowie zugehörige Montage-, Komplettierungs- und Anschlussarbeiten in den Prozessanlagen. Schwerpunkte waren die elektrischen Schaltanlagen, die Kühlsysteme und die Produktionsanlagen.",
        scope: [
          "Verlegung und Installation von Energie-, Steuer- und Instrumentenkabeln",
          "Kabelführung auf Trassen und in Schutzrohren",
          "Anschlussarbeiten in den Prozessanlagen",
          "Montage- und Komplettierungsarbeiten",
          "Schaltanlagen, Kühlsysteme und Produktionsanlagen",
        ],
      },
      fr: {
        title: "Montage électrique et câblage – INEOS Project ONE",
        location: "Belgique – Anvers",
        industry: "Industrie pétrochimique et chimique",
        site: "INEOS Project ONE, Anvers",
        name: "Construction d'une nouvelle usine d'éthylène",
        summary:
          "Importants travaux de montage électrique et de câblage lors de la construction de la nouvelle usine d'éthylène INEOS Project ONE : pose de câbles de puissance, de commande et d'instrumentation, cheminement sur chemins de câbles et raccordement dans les unités.",
        description:
          "Importants travaux de montage électrique et de câblage lors de la construction de l'usine pétrochimique moderne INEOS Project ONE à Anvers, en Belgique. Le projet comprenait la pose et l'installation de câbles de puissance, de commande et d'instrumentation, leur cheminement sur chemins de câbles et sous gaines, ainsi que les travaux de montage, de finition et de raccordement associés dans les unités de production. Les travaux se concentraient principalement sur les postes électriques, les systèmes de refroidissement et les unités de production.",
        scope: [
          "Pose de câbles de puissance, de commande et d'instrumentation",
          "Cheminement sur chemins de câbles et sous gaines",
          "Raccordements dans les unités de production",
          "Travaux de montage et de finition",
          "Postes électriques, systèmes de refroidissement et unités de production",
        ],
      },
      sv: {
        title: "Elmontage och kabelarbeten – INEOS Project ONE",
        location: "Belgien – Antwerpen",
        industry: "Petrokemisk och kemisk industri",
        site: "INEOS Project ONE, Antwerpen",
        name: "Bygget av en ny etenanläggning",
        summary:
          "Omfattande elmontage och kabelarbeten vid bygget av den nya etenanläggningen INEOS Project ONE: förläggning av kraft-, styr- och instrumentkablar, dragning på kabelstegar och inkoppling i processanläggningarna.",
        description:
          "Omfattande elmontage och kabelarbeten vid bygget av den moderna petrokemiska anläggningen INEOS Project ONE i Antwerpen, Belgien. Projektet omfattade förläggning och installation av kraft-, styr- och instrumentkablar, dragning på kabelstegar och i skyddsrör samt tillhörande montage-, kompletterings- och inkopplingsarbeten i processanläggningarna. Arbetet var främst inriktat på ställverk, kylsystem och produktionsanläggningar.",
        scope: [
          "Förläggning av kraft-, styr- och instrumentkablar",
          "Kabeldragning på kabelstegar och i skyddsrör",
          "Inkoppling i processanläggningarna",
          "Montage- och kompletteringsarbeten",
          "Ställverk, kylsystem och produktionsanläggningar",
        ],
      },
      pl: {
        title: "Prace elektromontażowe i kablowe – INEOS Project ONE",
        location: "Belgia – Antwerpia",
        industry: "Przemysł petrochemiczny i chemiczny",
        site: "INEOS Project ONE, Antwerpia",
        name: "Budowa nowego zakładu produkcji etylenu",
        summary:
          "Rozległe prace elektromontażowe i kablowe przy budowie nowego zakładu produkcji etylenu INEOS Project ONE: układanie kabli zasilających, sterowniczych i obiektowych, prowadzenie ich w trasach kablowych i podłączanie w instalacjach technologicznych.",
        description:
          "Rozległe prace elektromontażowe i kablowe przy budowie nowoczesnego zakładu petrochemicznego INEOS Project ONE w Antwerpii w Belgii. Zakres projektu obejmował układanie i instalację kabli zasilających, sterowniczych i obiektowych, ich prowadzenie w trasach kablowych i rurach osłonowych oraz związane z tym prace montażowe, wykończeniowe i podłączeniowe w instalacjach technologicznych. Prace koncentrowały się głównie na rozdzielniach elektrycznych, systemach chłodzenia i instalacjach produkcyjnych.",
        scope: [
          "Układanie kabli zasilających, sterowniczych i obiektowych",
          "Prowadzenie kabli w trasach kablowych i rurach osłonowych",
          "Podłączenia w instalacjach technologicznych",
          "Prace montażowe i wykończeniowe",
          "Rozdzielnie elektryczne, systemy chłodzenia i instalacje produkcyjne",
        ],
      },
    },
  },
  {
    slug: "orlen-unipetrol-vacuum-distillation-litvinov",
    position: 8,
    published: true,
    sector: "chemical",
    divisions: ["welding-piping", "supervision-qa"],
    periodFrom: 2024,
    periodTo: null,
    status: "completed",
    team: 30,
    teamApprox: false,
    parties: [
      { role: "partner", name: "ROEZ, s.r.o." },
      { role: "endClient", name: "ORLEN Unipetrol RPA, s.r.o." },
    ],
    photo: null,
    gallery: [],
    stockPhoto: "division-welding",
    approved: { parties: false, team: false, photos: false },
    text: {
      sk: {
        title: "Modernizácia vákuovej destilačnej jednotky",
        location: "Česká republika – Litvínov",
        industry: "Petrochemický priemysel",
        site: "Priemyselný závod ORLEN Unipetrol, Litvínov",
        name: "Optimalizácia vákuovej destilačnej jednotky LD 21046",
        summary:
          "Zabezpečenie technických tímov pri modernizácii a optimalizácii vákuovej destilačnej jednotky LD 21046 v závode ORLEN Unipetrol – zváranie TIG, montáž potrubných rozvodov, technologické montáže, nedeštruktívne skúšanie (VT, PT) a kontrola kvality.",
        description:
          "Zabezpečenie kvalifikovaných technických tímov pri modernizácii a optimalizácii vákuovej destilačnej jednotky v petrochemickom závode ORLEN Unipetrol. Rozsah projektu zahŕňal odborné zváračské práce metódou TIG, montáž potrubných rozvodov, zámočnícke a technologické montáže, nedeštruktívne skúšanie zvarových spojov metódami VT a PT, technickú kontrolu kvality a zváračský dozor.",
        scope: [
          "Zváračské práce metódou TIG",
          "Montáž potrubných rozvodov",
          "Zámočnícke a technologické montáže",
          "Nedeštruktívne skúšanie zvarových spojov (VT, PT)",
          "Technická kontrola kvality a zváračský dozor",
        ],
      },
      en: {
        title: "Modernisation of a vacuum distillation unit",
        location: "Czech Republic – Litvínov",
        industry: "Petrochemical industry",
        site: "ORLEN Unipetrol industrial plant, Litvínov",
        name: "Optimisation of vacuum distillation unit LD 21046",
        summary:
          "Technical teams for the modernisation and optimisation of vacuum distillation unit LD 21046 at the ORLEN Unipetrol plant: TIG welding, piping installation, mechanical assembly, non-destructive testing (VT, PT) and quality control.",
        description:
          "Qualified technical teams for the modernisation and optimisation of a vacuum distillation unit at the ORLEN Unipetrol petrochemical plant. The project covered TIG welding, piping installation, locksmith and mechanical assembly, non-destructive testing of welds by VT and PT, technical quality control and welding supervision.",
        scope: [
          "TIG welding",
          "Piping installation",
          "Locksmith and mechanical assembly",
          "Non-destructive testing of welds (VT, PT)",
          "Technical quality control and welding supervision",
        ],
      },
      de: {
        title: "Modernisierung einer Vakuumdestillationsanlage",
        location: "Tschechien – Litvínov",
        industry: "Petrochemische Industrie",
        site: "Industriewerk ORLEN Unipetrol, Litvínov",
        name: "Optimierung der Vakuumdestillationsanlage LD 21046",
        summary:
          "Technische Teams für die Modernisierung und Optimierung der Vakuumdestillationsanlage LD 21046 im Werk ORLEN Unipetrol: WIG-Schweißen, Rohrleitungsmontage, Anlagenmontage, zerstörungsfreie Prüfung (VT, PT) und Qualitätskontrolle.",
        description:
          "Qualifizierte technische Teams für die Modernisierung und Optimierung einer Vakuumdestillationsanlage im petrochemischen Werk ORLEN Unipetrol. Der Projektumfang umfasste WIG-Schweißarbeiten, Rohrleitungsmontage, Schlosser- und Anlagenmontage, zerstörungsfreie Prüfung der Schweißnähte nach VT und PT, technische Qualitätskontrolle und Schweißaufsicht.",
        scope: [
          "WIG-Schweißarbeiten",
          "Rohrleitungsmontage",
          "Schlosser- und Anlagenmontage",
          "Zerstörungsfreie Prüfung der Schweißnähte (VT, PT)",
          "Technische Qualitätskontrolle und Schweißaufsicht",
        ],
      },
      fr: {
        title: "Modernisation d'une unité de distillation sous vide",
        location: "République tchèque – Litvínov",
        industry: "Industrie pétrochimique",
        site: "Site industriel ORLEN Unipetrol, Litvínov",
        name: "Optimisation de l'unité de distillation sous vide LD 21046",
        summary:
          "Équipes techniques pour la modernisation et l'optimisation de l'unité de distillation sous vide LD 21046 du site ORLEN Unipetrol : soudage TIG, tuyauteries, montage mécanique, contrôles non destructifs (VT, PT) et contrôle qualité.",
        description:
          "Équipes techniques qualifiées pour la modernisation et l'optimisation d'une unité de distillation sous vide sur le site pétrochimique ORLEN Unipetrol. Le projet comprenait le soudage TIG, le montage de tuyauteries, les travaux de serrurerie et de montage mécanique, les contrôles non destructifs des soudures par VT et PT, le contrôle qualité technique et la supervision du soudage.",
        scope: [
          "Soudage TIG",
          "Montage de tuyauteries",
          "Serrurerie et montage mécanique",
          "Contrôles non destructifs des soudures (VT, PT)",
          "Contrôle qualité technique et supervision du soudage",
        ],
      },
      sv: {
        title: "Modernisering av en vakuumdestillationsenhet",
        location: "Tjeckien – Litvínov",
        industry: "Petrokemisk industri",
        site: "ORLEN Unipetrols industrianläggning, Litvínov",
        name: "Optimering av vakuumdestillationsenheten LD 21046",
        summary:
          "Tekniska team för moderniseringen och optimeringen av vakuumdestillationsenheten LD 21046 vid ORLEN Unipetrol: TIG-svetsning, rörmontage, mekaniskt montage, oförstörande provning (VT, PT) och kvalitetskontroll.",
        description:
          "Kvalificerade tekniska team för moderniseringen och optimeringen av en vakuumdestillationsenhet vid ORLEN Unipetrols petrokemiska anläggning. Projektet omfattade TIG-svetsning, rörmontage, smides- och mekaniskt montage, oförstörande provning av svetsfogar med VT och PT, teknisk kvalitetskontroll och svetsövervakning.",
        scope: [
          "TIG-svetsning",
          "Rörmontage",
          "Smides- och mekaniskt montage",
          "Oförstörande provning av svetsfogar (VT, PT)",
          "Teknisk kvalitetskontroll och svetsövervakning",
        ],
      },
      pl: {
        title: "Modernizacja próżniowej jednostki destylacyjnej",
        location: "Czechy – Litvínov",
        industry: "Przemysł petrochemiczny",
        site: "Zakład przemysłowy ORLEN Unipetrol, Litvínov",
        name: "Optymalizacja próżniowej jednostki destylacyjnej LD 21046",
        summary:
          "Zespoły techniczne przy modernizacji i optymalizacji próżniowej jednostki destylacyjnej LD 21046 w zakładzie ORLEN Unipetrol: spawanie TIG, montaż rurociągów, montaże technologiczne, badania nieniszczące (VT, PT) i kontrola jakości.",
        description:
          "Wykwalifikowane zespoły techniczne przy modernizacji i optymalizacji próżniowej jednostki destylacyjnej w zakładzie petrochemicznym ORLEN Unipetrol. Zakres projektu obejmował spawanie metodą TIG, montaż rurociągów, prace ślusarskie i montaże technologiczne, badania nieniszczące złączy spawanych metodami VT i PT, techniczną kontrolę jakości oraz nadzór spawalniczy.",
        scope: [
          "Spawanie metodą TIG",
          "Montaż rurociągów",
          "Prace ślusarskie i montaże technologiczne",
          "Badania nieniszczące złączy spawanych (VT, PT)",
          "Techniczna kontrola jakości i nadzór spawalniczy",
        ],
      },
    },
  },
];
