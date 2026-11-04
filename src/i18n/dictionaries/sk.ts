import type { Dictionary } from "..";

const sk: Dictionary = {
  meta: {
    title: "KTechnology – Leasing pracovníkov pre priemysel: zvárači, montéri, elektrikári",
    description:
      "KTechnology s.r.o. prenajíma zváračov, potrubárov, elektrikárov, mechanikov a operátorov pre priemyselné projekty v Európe a v Škandinávii. Zručnosti pracovníkov overí testom, vybaví A1, dopravu aj ubytovanie a tím nasadí približne do 14 dní.",
  },
  nav: {
    home: "Domov",
    services: "Služby",
    sectors: "Odvetvia",
    projects: "Projekty",
    about: "O nás",
    contact: "Kontakty",
    breadcrumb: "Navigačná cesta",
    cta: "Poslať dopyt",
    language: "Jazyk",
    menu: "Menu",
    mainNav: "Hlavná navigácia",
    skip: "Preskočiť na obsah",
    ctaShort: "Poslať dopyt",
  },
  hero: {
    eyebrow: "Leasing pracovníkov pre priemysel\u00a0· Európa\u00a0a\u00a0Škandinávia",
    title: "Kvalifikovaní zvárači, montéri a\u00a0elektrikári na vašom pracovisku približne do 14\u00a0dní",
    lead:
      "Prenajímame overených priemyselných odborníkov výrobcom, zhotoviteľom a EPC spoločnostiam v celej Európe. Postaráme sa o zmluvy, A1 a povolenia, poistenie, dopravu aj ubytovanie. Jeden kontakt, jedna faktúra.",
    primary: "Vyžiadať pracovníkov",
    secondary: "Pozrieť profesie",
    facts: [
      { k: "Profesie", v: "Zvárači, montéri, elektrikári, mechanici, operátori" },
      { k: "Kde", v: "Nemecko, Rakúsko, severské krajiny, Benelux, Francúzsko, PL/CZ/SK, SAE" },
      { k: "Rýchlosť", v: "Cenová ponuka do 1\u00a0pracovného dňa, tím na mieste približne do 14\u00a0dní" },
      { k: "Súčasť služby", v: "A1 a povolenia, doprava, ubytovanie, koordinátor" },
    ],
    card: {
      label: "Príklad dopytu",
      rows: [
        { role: "Zvárač TIG", count: "6×" },
        { role: "Potrubár", count: "4×" },
        { role: "Priemyselný elektrikár", count: "2×" },
        { role: "Projektový koordinátor", count: "zahrnutý" },
      ],
      meta: [
        { k: "Projekt", v: "Odstávka závodu" },
        { k: "Nástup", v: "do ~14\u00a0dní" },
      ],
      status: "Tím sa pripravuje",
    },
  },
  services: {
    label: "Služby",
    title: "Čo ponúkame",
    lead: "Leasing pracovníkov pre priemysel: od jedného špecialistu po kompletný tím, na celú dobu vášho projektu.",
    more: "Všetky služby a profesie",
    items: [
      {
        title: "Leasing pracovníkov",
        body: "Kvalifikovaných odborníkov vám prenajmeme na celú dobu zákazky. Pracujú pod vaším vedením priamo na pracovisku, zamestnávateľom však zostávame my.",
        points: ["Jednotlivci aj celé tímy", "Krátkodobé aj dlhodobé nasadenia", "Žiadny nábor ani personálna administratíva na vašej strane"],
      },
      {
        title: "Odstávky a nábehy výroby",
        body: "Posily na odstávky, nábehy výroby a obdobia špičky. Kapacitu rýchlo navýšite a po skončení prác ju znova znížite.",
        points: ["Mobilizácia približne do dvoch týždňov", "Zmennosť podľa dohody s pracoviskom", "Po projekte žiadne fixné náklady"],
      },
      {
        title: "Kompletná mobilizácia",
        body: "Všetko medzi „potrebujeme ľudí“ a „pracujú produktívne na mieste“ je na nás: nábor, administratíva, doprava, ubytovanie aj podpora.",
        points: ["Zmluvy, formuláre A1 a povolenia", "Doprava, ubytovanie a OOPP", "Koordinátor počas celého projektu"],
      },
    ],
  },
  trades: {
    label: "Profesie",
    title: "Koho vám dodáme",
    lead: "Skúsených odborníkov. Každý pred nasadením prejde praktickým testom zručností a kontrolou certifikátov.",
    items: [
      {
        name: "Zvárači",
        skills: ["MIG/MAG", "TIG", "MMA", "Oceľ a nerez"],
        body: "Zvárači so skúsenosťami s metódami MIG/MAG, TIG a MMA pri zváraní ocele aj nerezu.",
      },
      {
        name: "Potrubári",
        skills: ["Priemyselné potrubia", "Izometrické výkresy", "Prefabrikácia", "Montáž"],
        body: "Potrubári na prefabrikáciu a montáž priemyselných potrubí podľa izometrických výkresov.",
      },
      {
        name: "Zámočníci a montéri konštrukcií",
        skills: ["Oceľové konštrukcie", "Technické výkresy", "Montáž", "Skrutkové spoje"],
        body: "Zámočníci a montéri, ktorí podľa technických výkresov zhotovujú a montujú oceľové konštrukcie vrátane skrutkových spojov.",
      },
      {
        name: "Priemyselní elektrikári",
        skills: ["Inštalácie", "Káble a žľaby", "Rozvádzače"],
        body: "Elektrikári na priemyselné inštalácie: ťahanie káblov, montáž káblových žľabov a zapojenie rozvádzačov.",
      },
      {
        name: "Technici automatizácie",
        skills: ["PLC", "Uvádzanie do prevádzky", "Diagnostika porúch"],
        body: "Technici na programovanie PLC, uvádzanie zariadení do prevádzky a diagnostiku porúch.",
      },
      {
        name: "Mechanici a montéri strojov",
        skills: ["Inštalácia strojov", "Ustavovanie", "Údržba počas odstávok"],
        body: "Mechanici na inštaláciu a ustavovanie strojov aj na údržbu počas odstávok.",
      },
      {
        name: "Operátori CNC a strojov",
        skills: ["Sústruženie a frézovanie", "Nastavovanie strojov", "Meranie"],
        body: "Operátori na sústruženie a frézovanie, nastavovanie strojov a meranie dielov.",
      },
      {
        name: "Montážni operátori",
        skills: ["Montáž na linke", "Kontrola kvality", "Zmenová práca"],
        body: "Operátori na montáž na linke a kontrolu kvality, zvyknutí na prácu na zmeny.",
      },
      {
        name: "Technici pre meranie a reguláciu",
        skills: ["MaR", "Kalibrácia prístrojov", "Snímače a regulačné slučky"],
        body: "Technici pre meranie a reguláciu: kalibrácia prístrojov, snímače a regulačné slučky.",
      },
    ],
    note: "Hľadáte inú profesiu? Opýtajte sa nás – naša sieť pokrýva väčšinu priemyselných odborností.",
    open: "Detail profesie",
    skillsTitle: "Zručnosti",
    vetting: "Každý pracovník pred nasadením prejde praktickým testom zručností a kontrolou certifikátov.",
    projectsTitle: "Relevantné projekty",
    others: "Ďalšie profesie",
    metaSuffix: "leasing pracovníkov | KTechnology",
  },
  included: {
    label: "Komplexná služba",
    title: "Všetko okolo vášho tímu vybavíme my",
    lead: "Vy dostanete produktívnych ľudí na pracovisku. Nábor, administratíva, doprava a podpora zostávajú na nás.",
    items: [
      "Vyhľadanie a výber",
      "Praktické testy zručností",
      "Kontrola certifikátov a dokladov",
      "Pracovné zmluvy",
      "Formuláre A1 a pracovné povolenia",
      "Poistenie",
      "Osobné ochranné pracovné prostriedky",
      "Doprava a ubytovanie",
      "Vlastný projektový koordinátor",
      "Rýchla náhrada",
    ],
  },
  sectors: {
    label: "Odvetvia",
    title: "Kde pracujú naši ľudia",
    lead: "Odvetvia, v ktorých naši ľudia posilňujú tímy výrobcov, zhotoviteľov a EPC spoločností.",
    items: [
      { name: "Automobilový priemysel a dodávatelia", tags: "Automatizácia · Programovanie · Robotika" },
      { name: "Kovovýroba a zváranie", tags: "MIG/MAG · TIG · Oceľové konštrukcie" },
      { name: "Energetika a elektrárne", tags: "Odstávky · Potrubia · Strojné montáže" },
      { name: "Lodiarstvo a offshore", tags: "Trup · Vystrojovanie · Potrubárstvo" },
      { name: "Elektrotechnika a automatizácia", tags: "Inštalácia · PLC · Uvádzanie do prevádzky" },
      { name: "Logistika a výroba", tags: "Operátori · VZV · Sklady" },
      { name: "Komerčné a administratívne budovy", tags: "Elektroinštalácie · TZB · MaR" },
    ],
  },
  process: {
    label: "Ako to funguje",
    title: "Od dopytu po tím na mieste približne za dva týždne",
    steps: [
      {
        period: "Deň 1",
        title: "Analýza potrieb",
        body: "S vaším projektovým manažérom určíme pozície, kvalifikácie, počty, zmennosť a podmienky na pracovisku.",
      },
      {
        period: "Dni 2–7",
        title: "Nábor a preverenie",
        body: "Kandidáti z našej siete prejdú praktickými testami a kontrolou dokladov a certifikátov.",
      },
      {
        period: "Dni 7–14",
        title: "Administratíva a mobilizácia",
        body: "Zmluvy, A1 / pracovné povolenia, poistenie, OOPP, dopravu a ubytovanie vybavíme za vás.",
      },
      {
        period: "Počas projektu",
        title: "Dohľad a podpora",
        body: "Koordinátor je v kontakte s vaším pracoviskom, sleduje výkon a v prípade potreby rýchlo zabezpečí náhradu.",
      },
    ],
  },
  why: {
    label: "Prečo KTechnology",
    title: "Personálny partner, nie\u00a0iba dodávateľ životopisov",
    items: [
      { title: "Jeden partner na všetko", body: "Nábor, administratíva, doprava, ubytovanie aj podpora na mieste – všetko riešite s jednou kontaktnou osobou." },
      { title: "Overení pred nasadením", body: "Každý špecialista prejde praktickým testom, aby váš harmonogram nenarušili nepríjemné prekvapenia." },
      { title: "Flexibilná kapacita", body: "Navýšte kapacitu na odstávku či nábeh výroby a po skončení projektu ju znížte." },
      { title: "Rýchla náhrada", body: "Ak niekto nespĺňa vaše požiadavky, rýchlo ho nahradíme." },
    ],
  },
  reach: {
    label: "Kde pôsobíme",
    title: "Sídlime na Slovensku, pracujeme na projektoch v\u00a0celej Európe a\u00a0v\u00a0Škandinávii",
    countries: [
      "Nemecko", "Rakúsko", "Švédsko", "Nórsko", "Fínsko", "Dánsko",
      "Holandsko", "Belgicko", "Francúzsko", "Poľsko", "Česko", "Slovensko", "SAE",
    ],
  },
  faq: {
    label: "Otázky",
    title: "Časté otázky",
    items: [
      {
        q: "Ako funguje leasing pracovníkov?",
        a: "Pracovníci sú zamestnancami KTechnology a na dobu projektu vám ich prenajmeme. Na mieste pracujú pod vaším vedením. Zmluvy, mzdy, poistenie a celú administratívu riešime my – vy dostanete jednu faktúru.",
      },
      {
        q: "Ako rýchlo môžu pracovníci nastúpiť?",
        a: "Zvyčajne približne do dvoch týždňov od dopytu: niekoľko dní na výber a testy, potom zmluvy, formuláre A1 a doprava. Pri naliehavých odstávkach nám napíšte požadovaný termín a otvorene vám povieme, čo sa dá stihnúť.",
      },
      {
        q: "V ktorých krajinách pôsobíte?",
        a: "Pracovníkov nasadzujeme v Nemecku, Rakúsku, Švédsku, Nórsku, Fínsku, Dánsku, Beneluxe, Francúzsku, Poľsku, Česku, na Slovensku a v SAE. Ďalšie krajiny po dohode.",
      },
      {
        q: "Akú administratívu vybavíte?",
        a: "Pracovné zmluvy, formuláre A1 alebo pracovné povolenia, poistenie, kontrolu certifikátov, OOPP, dopravu a ubytovanie. Pre pracovníkov nemusíte nič zabezpečovať.",
      },
      {
        q: "Čo ak pracovník nespĺňa naše očakávania?",
        a: "Dajte to vedieť koordinátorovi vášho projektu. Situáciu s vami preberieme a v prípade potreby pracovníka čo najrýchlejšie nahradíme.",
      },
      {
        q: "Ako stanovujete cenu?",
        a: "Cenu stanovujeme na pracovníka podľa profesie, lokality, dĺžky nasadenia a zmennosti. Pošlite nám dopyt a cenovú ponuku dostanete do jedného pracovného dňa.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Napíšte nám, koho potrebujete",
    body: "Pošlite nám dopyt a projektový koordinátor sa vám do jedného pracovného dňa ozve s informáciou o dostupnosti pracovníkov a s cenovou ponukou.",
    emailLabel: "Alebo nám napíšte priamo",
    tipsTitle: "Pomôže, ak uvediete",
    tips: ["Miesto výkonu práce (mesto) a pracovný čas", "Požadované certifikáty, napr.\u00a0metódu zvárania a normu", "Pracovný jazyk a potrebné školenia či preukazy BOZP"],
    form: {
      company: "Spoločnosť",
      name: "Vaše meno",
      email: "E-mail",
      phone: "Telefón",
      country: "Krajina projektu",
      positions: "Potrebné pozície (napr.\u00a06×\u00a0zvárač\u00a0TIG)",
      duration: "Dĺžka (napr.\u00a06\u00a0týždňov)",
      shift: "Zmennosť",
      shifts: {
        unsure: "Zatiaľ neviem",
        single: "1 zmena",
        double: "2 zmeny",
        triple: "3 zmeny",
        rotation: "Zmeny po 12\u00a0h",
      },
      required: "* Povinné polia",
      start: "Plánovaný nástup",
      message: "Detaily projektu",
      submit: "Odoslať dopyt",
      sending: "Odosiela sa…",
      success: "Ďakujeme. Projektový koordinátor sa vám do jedného pracovného dňa ozve s informáciou o dostupnosti pracovníkov a s cenovou ponukou.",
      error: "Dopyt sa nepodarilo odoslať. Vyplnené údaje zostali vo formulári – pošlite nám ich, prosím, e-\u2060mailom na adresu:",
      invalid: "Skontrolujte, prosím, označené polia.",
      emailHint: "napr. meno@firma.sk",
      consent: "Vaše osobné údaje spracúvame len na vybavenie tohto dopytu a prípravu cenovej ponuky.",
    },
  },
  projects: {
    label: "Projekty",
    title: "Projekty a referencie",
    lead: "Vybrané projekty, na ktorých pracovali naši zvárači, montéri, elektrikári a technici.",
    empty: "Prehľad realizovaných projektov práve dopĺňame. Napíšte nám a radi vám povieme o projektoch vo vašom odvetví.",
    open: "Detail projektu",
    metaSuffix: "projekt | KTechnology",
    facts: { country: "Krajina", sector: "Odvetvie", year: "Rok", team: "Počet pracovníkov", duration: "Trvanie" },
    scopeTitle: "Rozsah prác",
    tradesTitle: "Profesie na projekte",
    stats: {
      label: "V číslach",
      title: "KTechnology v číslach",
      projects: "Realizovaných projektov",
      countries: "Krajín",
      workers: "Overených pracovníkov",
    },
  },
  about: {
    label: "O nás",
    title: "Priemyselní odborníci zo Slovenska pre projekty v Európe a v Škandinávii",
    lead: "KTechnology s.r.o. je slovenská spoločnosť, ktorá prenajíma kvalifikovaných priemyselných pracovníkov výrobcom, zhotoviteľom a EPC spoločnostiam.",
    body: [
      "Dodávame zváračov, potrubárov, montérov, elektrikárov, mechanikov, technikov aj operátorov – od jedného špecialistu po celý tím, na celú dobu vášho projektu. Každý pracovník pred nasadením prejde praktickým testom zručností a kontrolou certifikátov.",
      "Postaráme sa o všetko okolo tímu: zmluvy, formuláre A1 a povolenia, poistenie, OOPP, dopravu aj ubytovanie. Počas projektu máte jedného koordinátora a dostanete jednu faktúru.",
    ],
  },
  cta: {
    title: "Potrebujete posilniť tím?",
    body: "Pošlite nám dopyt a do jedného pracovného dňa vám odpovieme s informáciou o dostupnosti pracovníkov a s cenovou ponukou.",
    email: "Alebo nám napíšte",
  },
  pages: {
    services: {
      meta: {
        title: "Služby a profesie – leasing pracovníkov pre priemysel | KTechnology",
        description:
          "Leasing pracovníkov, posily na odstávky a nábehy výroby, kompletná mobilizácia: zvárači, potrubári, elektrikári, mechanici, technici a operátori, overení pred nasadením.",
      },
    },
    sectors: {
      meta: {
        title: "Odvetvia – KTechnology",
        description:
          "Kde pracujú naši ľudia: automobilový priemysel, kovovýroba, energetika, lodiarstvo a offshore, elektrotechnika a automatizácia, logistika a výroba, komerčné a administratívne budovy.",
      },
    },
    projects: {
      meta: {
        title: "Projekty a referencie – KTechnology",
        description: "Projekty, na ktorých pracovali naši zvárači, montéri, elektrikári a technici v Európe a v Škandinávii.",
      },
    },
    about: {
      meta: {
        title: "O nás – KTechnology",
        description:
          "KTechnology s.r.o. je slovenská spoločnosť, ktorá prenajíma kvalifikovaných priemyselných pracovníkov výrobcom, zhotoviteľom a EPC spoločnostiam v Európe a v Škandinávii.",
      },
    },
    contact: {
      meta: {
        title: "Kontakt – poslať dopyt | KTechnology",
        description: "Pošlite nám dopyt: projektový koordinátor sa vám do jedného pracovného dňa ozve s dostupnosťou pracovníkov a s cenovou ponukou.",
      },
    },
  },
  notFound: {
    title: "Stránka sa nenašla",
    body: "Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.",
    home: "Späť na úvodnú stránku",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Leasing pracovníkov pre priemysel zo Slovenska, pre projekty v Európe a v Škandinávii.",
    pages: "Stránky",
    rights: "Všetky práva vyhradené.",
    top: "Späť hore",
  },
};

export default sk;
