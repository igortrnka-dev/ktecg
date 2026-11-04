import type { Dictionary } from "..";

const sv: Dictionary = {
  meta: {
    title: "KTechnology – Personaluthyrning för industrin: svetsare, montörer, elektriker",
    description:
      "KTechnology s.r.o. hyr ut kompetenstestade svetsare, rörmontörer, elektriker, mekaniker och operatörer till industriprojekt i Europa och Skandinavien. Vi ordnar A1-intyg, resor och boende – team på plats inom cirka 14 dagar.",
  },
  nav: {
    home: "Hem",
    services: "Tjänster",
    sectors: "Branscher",
    projects: "Projekt",
    about: "Om oss",
    contact: "Kontakt",
    breadcrumb: "Brödsmulor",
    cta: "Beställ personal",
    language: "Språk",
    menu: "Meny",
    mainNav: "Huvudmeny",
    skip: "Hoppa till innehållet",
    ctaShort: "Begär offert",
  },
  hero: {
    eyebrow: "Personaluthyrning för industrin\u00a0· Europa\u00a0&\u00a0Skandinavien",
    title: "Yrkeskunniga svetsare, montörer och elektriker på plats hos er inom cirka 14\u00a0dagar",
    lead:
      "Vi hyr ut kompetenstestade yrkesarbetare inom industrin till tillverkare, entreprenörer och EPC-företag i hela Europa. Vi sköter avtal, A1-intyg eller arbetstillstånd, försäkring, resor och boende. En kontakt, en faktura.",
    primary: "Beställ personal",
    secondary: "Se våra yrken",
    facts: [
      { k: "Yrken", v: "Svetsare, montörer, elektriker, mekaniker, operatörer" },
      { k: "Var", v: "Tyskland, Österrike, Norden, Benelux, Frankrike, PL/CZ/SK, Arabemiraten" },
      { k: "Ledtid", v: "Offert inom 1\u00a0arbetsdag, team på plats inom cirka 14\u00a0dagar" },
      { k: "Ingår", v: "A1 & tillstånd, resor, boende, koordinator" },
    ],
    card: {
      label: "Exempel på förfrågan",
      rows: [
        { role: "TIG-svetsare", count: "6×" },
        { role: "Rörmontör", count: "4×" },
        { role: "Industrielektriker", count: "2×" },
        { role: "Projektkoordinator", count: "ingår" },
      ],
      meta: [
        { k: "Projekt", v: "Revisionsstopp" },
        { k: "Start", v: "inom ~14\u00a0dagar" },
      ],
      status: "Team förbereds",
    },
  },
  services: {
    label: "Tjänster",
    title: "Vad vi erbjuder",
    lead: "Personaluthyrning för industrin: från en enskild specialist till ett komplett team, under hela projektets löptid.",
    more: "Alla tjänster och yrken",
    items: [
      {
        title: "Personaluthyrning",
        body: "Vi hyr ut kvalificerade yrkesarbetare till er så länge uppdraget pågår. De arbetar under er arbetsledning\u00a0– vi förblir deras arbetsgivare.",
        points: ["Enskilda specialister eller hela team", "Korta och långa uppdrag", "Ingen rekrytering eller HR-administration för er"],
      },
      {
        title: "Revisionsstopp & upprampning",
        body: "Extra kapacitet för revisionsstopp, produktionsupprampning och projekttoppar. Skala upp snabbt och ner när jobbet är klart.",
        points: ["Mobilisering inom cirka två veckor", "Skiftschema enligt överenskommelse", "Inga fasta kostnader efter projektet"],
      },
      {
        title: "Komplett mobilisering",
        body: "Allt mellan ”vi behöver folk” och ”de jobbar produktivt på plats” sköter vi: rekrytering, pappersarbete, resor, boende och stöd.",
        points: ["Avtal, A1-intyg och tillstånd", "Resor, boende och skyddsutrustning", "En koordinator för hela projektet"],
      },
    ],
  },
  trades: {
    label: "Yrken",
    title: "Vilka vi hyr ut",
    lead: "Erfarna yrkesarbetare. Alla genomgår ett praktiskt kompetenstest och en certifikatkontroll före uppdraget.",
    items: [
      {
        name: "Svetsare",
        skills: ["MIG/MAG", "TIG", "MMA", "Stål & rostfritt"],
        body: "Svetsare med erfarenhet av MIG/MAG-, TIG- och MMA-svetsning i kolstål och rostfritt.",
      },
      {
        name: "Rörmontörer",
        skills: ["Industrirör", "Isometriritningar", "Prefabricering", "Montage"],
        body: "Rörmontörer som prefabricerar och monterar industrirör enligt isometriritningar.",
      },
      {
        name: "Stålmontörer",
        skills: ["Stålkonstruktioner", "Tekniska ritningar", "Montage", "Skruvförband"],
        body: "Stålmontörer som tillverkar och monterar stålkonstruktioner enligt tekniska ritningar, inklusive skruvförband.",
      },
      {
        name: "Industrielektriker",
        skills: ["Installation", "Kablage & kabelstegar", "Elcentraler"],
        body: "Elektriker för industriinstallationer: kabeldragning, montage av kabelstegar och inkoppling av elcentraler.",
      },
      {
        name: "Automationstekniker",
        skills: ["PLC", "Driftsättning", "Felsökning"],
        body: "Tekniker för PLC-programmering, driftsättning av utrustning och felsökning.",
      },
      {
        name: "Mekaniker & industrimontörer",
        skills: ["Maskininstallation", "Uppriktning", "Underhåll vid stopp"],
        body: "Mekaniker som installerar och riktar upp maskiner och utför underhåll under revisionsstopp.",
      },
      {
        name: "CNC- & maskinoperatörer",
        skills: ["Svarvning & fräsning", "Maskinställning", "Mätning"],
        body: "Operatörer för svarvning och fräsning, maskinställning och mätning av detaljer.",
      },
      {
        name: "Monteringsoperatörer",
        skills: ["Linjemontering", "Kvalitetskontroll", "Skiftarbete"],
        body: "Operatörer för linjemontering och kvalitetskontroll, vana vid skiftarbete.",
      },
      {
        name: "Instrumenttekniker",
        skills: ["Mät- och reglerteknik", "Kalibrering av instrument", "Givare & reglerkretsar"],
        body: "Tekniker inom mät- och reglerteknik: kalibrering av instrument, givare och reglerkretsar.",
      },
    ],
    note: "Behöver ni en annan yrkesgrupp? Fråga oss\u00a0– vårt nätverk täcker de flesta industriyrken.",
    open: "Mer om yrket",
    skillsTitle: "Kompetenser",
    vetting: "Alla genomgår ett praktiskt kompetenstest och en certifikatkontroll före uppdraget.",
    projectsTitle: "Relevanta projekt",
    others: "Andra yrken",
    metaSuffix: "personaluthyrning för industrin | KTechnology",
  },
  included: {
    label: "Allt ingår",
    title: "Vi sköter allt runt ert team",
    lead: "Ni får produktiv personal på plats\u00a0– vi tar hand om rekrytering, administration, resor och stöd.",
    items: [
      "Sökning & urval",
      "Praktiska kompetenstester",
      "Kontroll av certifikat & dokument",
      "Anställningsavtal",
      "A1-intyg & arbetstillstånd",
      "Försäkring",
      "Personlig skyddsutrustning",
      "Resor & boende",
      "Egen projektkoordinator",
      "Snabbt byte av personal",
    ],
  },
  sectors: {
    label: "Branscher",
    title: "Där vår personal arbetar",
    lead: "Branscher där vår personal förstärker teamen hos tillverkare, entreprenörer och EPC-företag.",
    items: [
      { name: "Fordon & underleverantörer", tags: "Automation · Programmering · Robotik" },
      { name: "Metallindustri & svetsning", tags: "MIG/MAG · TIG · Stålkonstruktioner" },
      { name: "Energi & kraftverk", tags: "Revisioner · Rör · Mekanik" },
      { name: "Varv & offshore", tags: "Skrov · Utrustning · Rörmontage" },
      { name: "El & automation", tags: "Installation · PLC · Driftsättning" },
      { name: "Logistik & produktion", tags: "Operatörer · Truck · Lager" },
      { name: "Kommersiella byggnader & kontor", tags: "El · Fastighetsteknik · Mät- och reglerteknik" },
    ],
  },
  process: {
    label: "Så går det till",
    title: "Från er förfrågan till ett team på plats inom cirka två veckor",
    steps: [
      {
        period: "Dag 1",
        title: "Behovsanalys",
        body: "Tillsammans med er projektledare definierar vi roller, kvalifikationer, antal, skiftschema och förhållanden på plats.",
      },
      {
        period: "Dag 2–7",
        title: "Rekrytering & kontroll",
        body: "Kandidater från vårt nätverk genomgår praktiska tester samt kontroll av dokument och certifikat.",
      },
      {
        period: "Dag 7–14",
        title: "Formalia & mobilisering",
        body: "Vi ordnar avtal, A1-intyg eller arbetstillstånd, försäkring, skyddsutrustning, resor och boende.",
      },
      {
        period: "Under projektet",
        title: "Uppföljning & stöd",
        body: "En koordinator håller kontakten med er arbetsplats, följer upp arbetet och ersätter personal snabbt vid behov.",
      },
    ],
  },
  why: {
    label: "Varför KTechnology",
    title: "En bemanningspartner, inte bara en CV-leverantör",
    items: [
      { title: "En partner för allt", body: "Rekrytering, pappersarbete, resor, boende och stöd på plats\u00a0– via en och samma kontakt." },
      { title: "Testade före uppdraget", body: "Varje specialist har klarat ett praktiskt test, så att er tidplan inte drabbas av överraskningar." },
      { title: "Flexibel kapacitet", body: "Skala upp inför ett stopp eller en upprampning och ner när projektet är klart." },
      { title: "Snabbt byte av personal", body: "Om någon inte lever upp till era krav byter vi snabbt ut personen." },
    ],
  },
  reach: {
    label: "Var vi arbetar",
    title: "Med bas i Slovakien\u00a0– på arbetsplatser i hela Europa och Skandinavien",
    countries: [
      "Tyskland", "Österrike", "Sverige", "Norge", "Finland", "Danmark",
      "Nederländerna", "Belgien", "Frankrike", "Polen", "Tjeckien", "Slovakien", "Förenade Arabemiraten",
    ],
  },
  faq: {
    label: "FAQ",
    title: "Vanliga frågor",
    items: [
      {
        q: "Hur fungerar personaluthyrning?",
        a: "Personalen är anställd av KTechnology och hyrs ut till er så länge projektet pågår. De arbetar under er arbetsledning; vi sköter avtal, löner, försäkring och all administration\u00a0– och ni får allt samlat på en faktura.",
      },
      {
        q: "Hur snabbt kan personalen börja?",
        a: "Vanligtvis inom cirka två veckor från förfrågan: några dagar för urval och tester, sedan avtal, A1-intyg och resor. Gäller det ett akut stopp? Ange ert datum, så säger vi ärligt vad som är möjligt.",
      },
      {
        q: "I vilka länder arbetar ni?",
        a: "Vi tar uppdrag i Tyskland, Österrike, Sverige, Norge, Finland, Danmark, Beneluxländerna, Frankrike, Polen, Tjeckien, Slovakien och Förenade Arabemiraten. Andra länder på förfrågan.",
      },
      {
        q: "Vilken administration sköter ni?",
        a: "Anställningsavtal, A1-intyg eller arbetstillstånd, försäkring, certifikatkontroll, skyddsutrustning, resor och boende. Ni behöver inte själva ordna något av detta för personalen.",
      },
      {
        q: "Vad händer om någon inte motsvarar våra förväntningar?",
        a: "Meddela er koordinator. Vi går igenom problemet och ersätter vid behov personen så snabbt som möjligt.",
      },
      {
        q: "Hur prissätts tjänsten?",
        a: "Vi offererar per person utifrån yrke, ort, uppdragets längd och skiftschema. Skicka er förfrågan så får ni en offert inom en arbetsdag.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Berätta vilka ni behöver",
    body: "Skicka er förfrågan så återkommer en projektkoordinator inom en arbetsdag med tillgänglighet och offert.",
    emailLabel: "Eller mejla oss direkt",
    tipsTitle: "Bra att ange",
    tips: ["Arbetsort (stad) och arbetstider", "Certifikat som krävs, t.ex. svetsmetod och standard", "Arbetsspråk och nödvändiga säkerhetsintyg"],
    form: {
      company: "Företag",
      name: "Ditt namn",
      email: "E-post",
      phone: "Telefon",
      country: "Projektland",
      positions: "Yrken (t.ex. 6×\u00a0TIG-svetsare)",
      duration: "Längd (t.ex. 6\u00a0veckor)",
      shift: "Skiftschema",
      shifts: {
        unsure: "Inte bestämt än",
        single: "Enskift",
        double: "Tvåskift",
        triple: "Treskift",
        rotation: "12-timmarsskift",
      },
      required: "* Obligatoriska fält",
      start: "Planerad start",
      message: "Projektdetaljer",
      submit: "Skicka förfrågan",
      sending: "Skickar…",
      success: "Tack. En projektkoordinator återkommer inom en arbetsdag med tillgänglighet och offert.",
      error: "Din förfrågan kunde inte skickas. Dina uppgifter finns kvar i formuläret\u00a0– mejla dem gärna till oss:",
      invalid: "Kontrollera de markerade fälten.",
      emailHint: "t.ex. namn@foretag.se",
      consent: "Vi använder dina personuppgifter enbart för att besvara förfrågan och ta fram en offert.",
    },
  },
  projects: {
    label: "Projekt",
    title: "Projekt och referenser",
    lead: "Ett urval av projekt där våra svetsare, montörer, elektriker och tekniker har arbetat.",
    empty: "Vi håller på att sammanställa en översikt över våra genomförda projekt. Skriv till oss, så berättar vi gärna om projekt inom er bransch.",
    open: "Mer om projektet",
    metaSuffix: "projekt | KTechnology",
    facts: { country: "Land", sector: "Bransch", year: "År", team: "Antal personer", duration: "Längd" },
    scopeTitle: "Arbetsomfattning",
    tradesTitle: "Yrken i projektet",
    stats: {
      label: "I siffror",
      title: "KTechnology i siffror",
      projects: "Genomförda projekt",
      countries: "Länder",
      workers: "Kontrollerade yrkesarbetare",
    },
  },
  about: {
    label: "Om oss",
    title: "Industrispecialister från Slovakien för projekt i Europa och Skandinavien",
    lead: "KTechnology s.r.o. är ett slovakiskt företag som hyr ut kvalificerade yrkesarbetare inom industrin till tillverkare, entreprenörer och EPC-företag.",
    body: [
      "Vi tillhandahåller svetsare, rörmontörer, stålmontörer, elektriker, mekaniker, tekniker och operatörer\u00a0– från en enskild specialist till ett komplett team, under hela ert projekt. Alla genomgår ett praktiskt kompetenstest och en certifikatkontroll före uppdraget.",
      "Vi sköter allt runt teamet: avtal, A1-intyg och tillstånd, försäkring, skyddsutrustning, resor och boende. Under projektet har ni en och samma koordinator och får allt samlat på en faktura.",
    ],
  },
  cta: {
    title: "Behöver ni förstärka ert team?",
    body: "Skicka er förfrågan så återkommer vi inom en arbetsdag med tillgänglighet och offert.",
    email: "Eller mejla oss",
  },
  pages: {
    services: {
      meta: {
        title: "Tjänster och yrken – Personaluthyrning för industrin | KTechnology",
        description:
          "Personaluthyrning, team för revisionsstopp och upprampning, komplett mobilisering: svetsare, rörmontörer, elektriker, mekaniker, tekniker och operatörer, kompetenstestade före uppdraget.",
      },
    },
    sectors: {
      meta: {
        title: "Branscher – KTechnology",
        description:
          "Där vår personal arbetar: fordonsindustri, metallindustri, energi, varv och offshore, el och automation, logistik och produktion, kommersiella byggnader och kontor.",
      },
    },
    projects: {
      meta: {
        title: "Projekt och referenser – KTechnology",
        description: "Projekt där våra svetsare, montörer, elektriker och tekniker har arbetat i Europa och Skandinavien.",
      },
    },
    about: {
      meta: {
        title: "Om oss – KTechnology",
        description:
          "KTechnology s.r.o. är ett slovakiskt företag som hyr ut kvalificerade yrkesarbetare inom industrin till tillverkare, entreprenörer och EPC-företag i Europa och Skandinavien.",
      },
    },
    contact: {
      meta: {
        title: "Kontakt – Beställ personal | KTechnology",
        description: "Skicka er förfrågan: en projektkoordinator återkommer inom en arbetsdag med tillgänglighet och offert.",
      },
    },
  },
  notFound: {
    title: "Sidan hittades inte",
    body: "Sidan du letar efter finns inte eller har flyttats.",
    home: "Tillbaka till startsidan",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Personaluthyrning från Slovakien till industriprojekt i Europa och Skandinavien.",
    pages: "Sidor",
    rights: "Alla rättigheter förbehållna.",
    top: "Till toppen",
  },
};

export default sv;
