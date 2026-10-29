import type { Dictionary } from "..";

const sv: Dictionary = {
  meta: {
    title: "KTechnology — Personaluthyrning för industrin: svetsare, montörer, elektriker",
    description:
      "KTechnology s.r.o. hyr ut certifierade svetsare, rörmontörer, elektriker, mekaniker och operatörer till industriprojekt i hela Europa och världen. Testad kompetens, A1, resor och boende ordnat, team på plats inom cirka 14 dagar.",
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
    mainNav: "Main navigation",
    skip: "Skip to content",
    ctaShort: "Get a quote",
  },
  hero: {
    eyebrow: "Personaluthyrning för industrin · Europa & världen",
    title: "Yrkeskunnig industripersonal till ert projekt, redo från första dagen",
    lead:
      "KTechnology hyr ut certifierade svetsare, rörmontörer, elektriker, mekaniker och operatörer till tillverkare, entreprenörer och EPC-företag. Vi rekryterar, testar, anställer, försäkrar och tar dem till er arbetsplats.",
    primary: "Beställ personal",
    secondary: "Se våra yrken",
    facts: [
      { k: "Yrken", v: "Svetsare, montörer, elektriker, mekaniker, operatörer" },
      { k: "Var", v: "I hela Europa och världen" },
      { k: "Tempo", v: "Team på plats inom cirka 14 dagar" },
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
        { k: "Start", v: "inom ~14 dagar" },
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
        body: "Kvalificerade yrkesarbetare uthyrda till ert företag under uppdragets längd. De arbetar under er platsledning; vi är fortsatt arbetsgivare.",
        points: ["Enskilda specialister eller hela team", "Korta och långa uppdrag", "Ingen rekrytering eller HR-administration för er"],
      },
      {
        title: "Revisionsstopp & upprampning",
        body: "Extra kapacitet för revisionsstopp, produktionsupprampning och projekttoppar. Skala upp snabbt och ner när jobbet är klart.",
        points: ["Mobilisering inom cirka två veckor", "Skiftschema enligt överenskommelse", "Inga fasta kostnader efter projektet"],
      },
      {
        title: "Komplett mobilisering",
        body: "Allt mellan ”vi behöver folk” och ”de jobbar produktivt på plats” sköter vi: rekrytering, papper, resor, boende och stöd.",
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
      { name: "Stålmontörer & plåtslagare", skills: ["Stålkonstruktioner", "Tekniska ritningar", "Montage", "Skruvförband"] },
      { name: "Industrielektriker", skills: ["Installation", "Kablage & kabelstegar", "Ställverk"] },
      { name: "Automationstekniker", skills: ["PLC", "Driftsättning", "Felsökning"] },
      { name: "Mekaniker & industrimontörer", skills: ["Maskininstallation", "Uppriktning", "Underhåll vid stopp"] },
      { name: "CNC- & maskinoperatörer", skills: ["Svarvning & fräsning", "Maskinställning", "Mätning"] },
      { name: "Monteringsoperatörer", skills: ["Linjemontering", "Kvalitetskontroll", "Skiftarbete"] },
      { name: "Logistikpersonal", skills: ["Truck", "Lager & plock", "Linjeförsörjning"] },
    ],
    note: "Söker ni ett annat yrke? Fråga oss, vårt nätverk täcker de flesta industriyrken.",
  },
  included: {
    label: "Allt ingår",
    title: "Vi sköter allt runt ert team",
    lead: "Ni får produktiv personal på plats. Rekrytering, papper, resor och stöd ligger kvar hos oss.",
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
      "Snabb ersättning",
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
    title: "Från er förfrågan till ett team på plats på cirka två veckor",
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
        title: "Juridik & mobilisering",
        body: "Avtal, A1 / arbetstillstånd, försäkring, skyddsutrustning, resor och boende ordnar vi.",
      },
      {
        period: "Under projektet",
        title: "Uppföljning & stöd",
        body: "En koordinator håller kontakten med er arbetsplats, följer upp prestationen och ersätter personal snabbt vid behov.",
      },
    ],
  },
  why: {
    label: "Varför KTechnology",
    title: "En bemanningspartner, inte bara en CV-leverantör",
    items: [
      { title: "En partner för allt", body: "Rekrytering, papper, resor, boende och stöd på plats från en och samma kontakt." },
      { title: "Testade före uppdraget", body: "Varje specialist klarar ett praktiskt test, så att er tidplan inte betalar för överraskningar." },
      { title: "Flexibel kapacitet", body: "Skala upp inför ett stopp eller en upprampning och ner när projektet är klart." },
      { title: "Snabb ersättning", body: "Om någon inte håller er standard ersätter vi personen snabbt." },
    ],
  },
  reach: {
    label: "Var vi arbetar",
    title: "Baserade i Slovakien, på arbetsplatser i hela Europa och längre bort",
    countries: [
      "Tyskland", "Österrike", "Sverige", "Norge", "Finland", "Danmark",
      "Nederländerna", "Belgien", "Frankrike", "Polen", "Tjeckien", "Slovakien", "Förenade Arabemiraten",
    ],
  },
  faq: {
    label: "Vanliga frågor",
    title: "Vanliga frågor",
    items: [
      {
        q: "Hur fungerar personaluthyrning?",
        a: "Personalen är anställd av KTechnology och hyrs ut till er under projektets längd. De arbetar under er platsledning; vi sköter avtal, löner, försäkring och all administration, och ni får en faktura.",
      },
      {
        q: "Hur snabbt kan personalen börja?",
        a: "Vanligtvis inom cirka två veckor från förfrågan: några dagar för urval och tester, sedan avtal, A1-intyg och resor. Vid akuta stopp, ange ert datum så säger vi ärligt vad som är möjligt.",
      },
      {
        q: "I vilka länder arbetar ni?",
        a: "Vi arbetar i hela Europa och världen, bland annat i Tyskland, Österrike, Norden, Benelux, Frankrike, Polen och Mellanöstern.",
      },
      {
        q: "Vilken administration sköter ni?",
        a: "Anställningsavtal, A1-intyg eller arbetstillstånd, försäkring, certifikatkontroll, skyddsutrustning, resor och boende. Ni behöver inte ordna något för personalen.",
      },
      {
        q: "Vad händer om någon inte motsvarar våra förväntningar?",
        a: "Meddela er koordinator. Vi går igenom problemet och ersätter vid behov personen så snabbt som möjligt.",
      },
      {
        q: "Hur prissätts tjänsten?",
        a: "Vi offererar per person utifrån yrke, ort, längd och skiftschema. Skicka er förfrågan så får ni en offert inom en arbetsdag.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Berätta vilka ni behöver",
    body: "Skicka er förfrågan så återkommer en projektkoordinator inom en arbetsdag med tillgänglighet och offert.",
    emailLabel: "Eller mejla oss direkt",
    tipsTitle: "Bra att ange",
    tips: ["Yrken och antal", "Projektort och startdatum", "Beräknad längd och skiftschema"],
    form: {
      company: "Företag",
      name: "Ditt namn",
      email: "E-post",
      phone: "Telefon",
      country: "Projektland",
      positions: "Tjänster som behövs (t.ex. 6× TIG-svetsare)",
      duration: "Duration (e.g. 6 weeks)",
      shift: "Shift pattern",
      shifts: {
        unsure: "Not sure yet",
        single: "1 shift",
        double: "2 shifts",
        triple: "3 shifts",
        rotation: "12-hour rotation",
      },
      required: "* Required fields",
      start: "Planerad start",
      message: "Projektdetaljer",
      submit: "Skicka förfrågan",
      sending: "Skickar…",
      success: "Tack. Vi har tagit emot er förfrågan och hör av oss inom kort.",
      error: "Något gick fel. Mejla oss gärna direkt.",
      consent: "Genom att skicka formuläret godkänner du att vi behandlar dina uppgifter för att besvara förfrågan.",
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    home: "Back to the homepage",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Personaluthyrning för industrin från Slovakien, för projekt i hela Europa och världen.",
    rights: "Alla rättigheter förbehållna.",
    top: "Till toppen",
  },
};

export default sv;
