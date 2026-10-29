import type { Dictionary } from "..";

const sk: Dictionary = {
  meta: {
    title: "KTechnology – Leasing pracovníkov pre priemysel: zvárači, montéri, elektrikári",
    description:
      "KTechnology s.r.o. prenajíma certifikovaných zváračov, potrubárov, elektrikárov, mechanikov a operátorov pre priemyselné projekty v Európe aj vo svete. Zručnosti overuje testom, vybaví A1, dopravu aj ubytovanie a tím dostane na miesto približne do 14 dní.",
  },
  nav: {
    services: "Služby",
    trades: "Profesie",
    sectors: "Odvetvia",
    process: "Ako to funguje",
    faq: "Otázky",
    contact: "Kontakt",
    cta: "Poslať dopyt",
    language: "Jazyk",
    menu: "Menu",
    mainNav: "Hlavná navigácia",
    skip: "Preskočiť na obsah",
    ctaShort: "Poslať dopyt",
  },
  hero: {
    eyebrow: "Leasing pracovníkov pre priemysel · Európa\u00a0a\u00a0svet",
    title: "Kvalifikovaní zvárači, montéri a\u00a0elektrikári na vašom pracovisku približne do 14\u00a0dní",
    lead:
      "Prenajímame overených priemyselných odborníkov výrobcom, zhotoviteľom a EPC spoločnostiam v celej Európe. Postaráme sa o zmluvy, A1 a povolenia, poistenie, dopravu aj ubytovanie. Jeden kontakt, jedna faktúra.",
    primary: "Vyžiadať pracovníkov",
    secondary: "Pozrieť profesie",
    facts: [
      { k: "Profesie", v: "Zvárači, montéri, elektrikári, mechanici, operátori" },
      { k: "Kde", v: "Nemecko, Rakúsko, severské krajiny, Benelux, Francúzsko, PL/CZ/SK, SAE" },
      { k: "Rýchlosť", v: "Tím na mieste približne do 14 dní" },
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
        { k: "Nástup", v: "do ~14 dní" },
      ],
      status: "Tím sa pripravuje",
    },
  },
  services: {
    label: "Služby",
    title: "Čo ponúkame",
    lead: "Leasing pracovníkov pre priemysel: od jedného špecialistu po kompletný tím, na celú dobu vášho projektu.",
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
      { name: "Zvárači", skills: ["MIG/MAG", "TIG", "MMA", "Oceľ a nerez"] },
      { name: "Potrubári", skills: ["Priemyselné potrubia", "Izometrické výkresy", "Prefabrikácia", "Montáž"] },
      { name: "Zámočníci a montéri konštrukcií", skills: ["Oceľové konštrukcie", "Technické výkresy", "Montáž", "Skrutkové spoje"] },
      { name: "Priemyselní elektrikári", skills: ["Inštalácie", "Káble a žľaby", "Rozvádzače"] },
      { name: "Technici automatizácie", skills: ["PLC", "Uvádzanie do prevádzky", "Diagnostika porúch"] },
      { name: "Mechanici a montéri strojov", skills: ["Inštalácia strojov", "Ustavovanie", "Údržba počas odstávok"] },
      { name: "Operátori CNC a strojov", skills: ["Sústruženie a frézovanie", "Nastavovanie strojov", "Meranie"] },
      { name: "Montážni operátori", skills: ["Montáž na linke", "Kontrola kvality", "Zmenová práca"] },
      { name: "Operátori logistiky", skills: ["VZV", "Sklad a vychystávanie", "Zásobovanie liniek"] },
    ],
    note: "Hľadáte inú profesiu? Opýtajte sa nás – naša sieť pokrýva väčšinu priemyselných odborností.",
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
    items: [
      { name: "Automobilový priemysel a dodávatelia", tags: "Montáž · Karosárne · Kvalita" },
      { name: "Kovovýroba a zváranie", tags: "MIG/MAG · TIG · Oceľové konštrukcie" },
      { name: "Energetika a elektrárne", tags: "Odstávky · Potrubia · Strojné montáže" },
      { name: "Lodiarstvo a offshore", tags: "Trup · Vystrojovanie · Potrubárstvo" },
      { name: "Elektrotechnika a automatizácia", tags: "Inštalácia · PLC · Uvádzanie do prevádzky" },
      { name: "Logistika a výroba", tags: "Operátori · VZV · Sklady" },
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
    title: "Personálny partner, nie iba dodávateľ životopisov",
    items: [
      { title: "Jeden partner na všetko", body: "Nábor, administratíva, doprava, ubytovanie aj podpora na mieste od jednej kontaktnej osoby." },
      { title: "Overení pred nasadením", body: "Každý špecialista prejde praktickým testom, aby váš harmonogram nenarušili nepríjemné prekvapenia." },
      { title: "Flexibilná kapacita", body: "Navýšte kapacitu na odstávku či nábeh výroby a po skončení projektu ju znížte." },
      { title: "Rýchla náhrada", body: "Ak niekto nespĺňa vaše požiadavky, rýchlo ho nahradíme." },
    ],
  },
  reach: {
    label: "Kde pôsobíme",
    title: "Sídlime na Slovensku, pracujeme na projektoch v\u00a0celej Európe aj mimo nej",
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
    tips: ["Profesie a počty ľudí", "Miesto projektu a termín nástupu", "Predpokladanú dĺžku a zmennosť"],
    form: {
      company: "Spoločnosť",
      name: "Vaše meno",
      email: "E-mail",
      phone: "Telefón",
      country: "Krajina projektu",
      positions: "Potrebné pozície (napr. 6× zvárač TIG)",
      duration: "Trvanie (napr. 6 týždňov)",
      shift: "Zmennosť",
      shifts: {
        unsure: "Zatiaľ neviem",
        single: "1 zmena",
        double: "2 zmeny",
        triple: "3 zmeny",
        rotation: "12-hodinové zmeny",
      },
      required: "* Povinné polia",
      start: "Plánovaný nástup",
      message: "Detaily projektu",
      submit: "Odoslať dopyt",
      sending: "Odosiela sa…",
      success: "Ďakujeme. Váš dopyt sme prijali a čoskoro sa vám ozveme.",
      error: "Dopyt sa nepodarilo odoslať. Pošlite nám ho, prosím, priamo e-mailom.",
      consent: "Vaše osobné údaje spracúvame len na vybavenie tohto dopytu a prípravu cenovej ponuky.",
    },
  },
  notFound: {
    title: "Stránka sa nenašla",
    body: "Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.",
    home: "Späť na úvodnú stránku",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Leasing pracovníkov pre priemysel zo Slovenska, pre projekty v celej Európe aj vo svete.",
    rights: "Všetky práva vyhradené.",
    top: "Späť hore",
  },
};

export default sk;
