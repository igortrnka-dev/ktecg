import type { Dictionary } from "..";

const sv: Dictionary = {
  meta: {
    title: "KTechnology – Personaluthyrning för industrin: svetsare, montörer, elektriker",
    description:
      "KTechnology s.r.o. hyr ut kompetenstestade svetsare, rörmontörer, elektriker, mekaniker och operatörer till industriprojekt i hela Europa och världen. Vi ordnar A1-intyg, resor och boende – team på plats inom cirka 14 dagar.",
  },
  nav: {
    services: "Tjänster",
    trades: "Yrken",
    sectors: "Branscher",
    process: "Så går det till",
    faq: "Vanliga frågor",
    contact: "Kontakt",
    cta: "Beställ personal",
    language: "Språk",
    menu: "Meny",
    mainNav: "Huvudmeny",
    skip: "Hoppa till innehållet",
    ctaShort: "Begär offert",
  },
  hero: {
    eyebrow: "Personaluthyrning för industrin · Europa & världen",
    title: "Yrkeskunniga svetsare, montörer och elektriker på plats hos er inom cirka 14\u00a0dagar",
    lead:
      "Vi hyr ut kompetenstestade yrkesarbetare inom industrin till tillverkare, entreprenörer och EPC-företag i hela Europa. Vi sköter avtal, A1-intyg eller arbetstillstånd, försäkring, resor och boende. En kontakt, en faktura.",
    primary: "Beställ personal",
    secondary: "Se våra yrken",
    facts: [
      { k: "Yrken", v: "Svetsare, montörer, elektriker, mekaniker, operatörer" },
      { k: "Var", v: "Tyskland, Österrike, Norden, Benelux, Frankrike, PL/CZ/SK, Arabemiraten" },
      { k: "Uppstart", v: "Offert inom 1\u00a0arbetsdag, team på plats inom cirka 14\u00a0dagar" },
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
      { name: "Svetsare", skills: ["MIG/MAG", "TIG", "MMA", "Stål & rostfritt"] },
      { name: "Rörmontörer", skills: ["Industrirör", "Isometriritningar", "Prefabricering", "Montage"] },
      { name: "Stålmontörer", skills: ["Stålkonstruktioner", "Tekniska ritningar", "Montage", "Skruvförband"] },
      { name: "Industrielektriker", skills: ["Installation", "Kablage & kabelstegar", "Elcentraler"] },
      { name: "Automationstekniker", skills: ["PLC", "Driftsättning", "Felsökning"] },
      { name: "Mekaniker & industrimontörer", skills: ["Maskininstallation", "Uppriktning", "Underhåll vid stopp"] },
      { name: "CNC- & maskinoperatörer", skills: ["Svarvning & fräsning", "Maskinställning", "Mätning"] },
      { name: "Monteringsoperatörer", skills: ["Linjemontering", "Kvalitetskontroll", "Skiftarbete"] },
      { name: "Logistikpersonal", skills: ["Truck", "Lager & plock", "Linjeförsörjning"] },
    ],
    note: "Behöver ni en annan yrkesgrupp? Fråga oss\u00a0– vårt nätverk täcker de flesta industriyrken.",
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
    items: [
      { name: "Fordon & underleverantörer", tags: "Montering · Kaross · Kvalitet" },
      { name: "Metallindustri & svetsning", tags: "MIG/MAG · TIG · Stålkonstruktioner" },
      { name: "Energi & kraftverk", tags: "Revisioner · Rör · Mekanik" },
      { name: "Varv & offshore", tags: "Skrov · Utrustning · Rörmontage" },
      { name: "El & automation", tags: "Installation · PLC · Driftsättning" },
      { name: "Logistik & produktion", tags: "Operatörer · Truck · Lager" },
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
    title: "Med bas i Slovakien\u00a0– på arbetsplatser i hela Europa och utanför",
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
      consent: "Vi använder dina personuppgifter enbart för att besvara förfrågan och ta fram en offert.",
    },
  },
  notFound: {
    title: "Sidan hittades inte",
    body: "Sidan du letar efter finns inte eller har flyttats.",
    home: "Tillbaka till startsidan",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Personaluthyrning för industrin från Slovakien, för projekt i hela Europa och världen.",
    rights: "Alla rättigheter förbehållna.",
    top: "Till toppen",
  },
};

export default sv;
