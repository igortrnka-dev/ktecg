import type { Dictionary } from "..";

const sk: Dictionary = {
  meta: {
    title: "KTechnology — Leasing pracovníkov pre priemysel: zvárači, montéri, elektrikári",
    description:
      "KTechnology s.r.o. prenajíma certifikovaných zváračov, potrubárov, elektrikárov, mechanikov a operátorov pre priemyselné projekty v Európe aj vo svete. Overené zručnosti, A1, doprava a ubytovanie vybavené, tím na mieste približne do 14 dní.",
  },
  nav: {
    services: "Služby",
    trades: "Profesie",
    sectors: "Odvetvia",
    process: "Ako to funguje",
    faq: "Otázky",
    contact: "Kontakt",
    cta: "Vyžiadať pracovníkov",
    language: "Jazyk",
    menu: "Menu",
  },
  hero: {
    eyebrow: "Leasing pracovníkov pre priemysel · Európa a svet",
    title: "Kvalifikovaní priemyselní pracovníci pre váš projekt, pripravení od prvého dňa",
    lead:
      "KTechnology prenajíma certifikovaných zváračov, potrubárov, elektrikárov, mechanikov a operátorov výrobcom, stavebným firmám a EPC spoločnostiam. Pracovníkov vyberieme, otestujeme, zamestnáme, poistíme a dopravíme na vaše pracovisko.",
    primary: "Vyžiadať pracovníkov",
    secondary: "Pozrieť profesie",
    facts: [
      { k: "Profesie", v: "Zvárači, montéri, elektrikári, mechanici, operátori" },
      { k: "Kde", v: "V celej Európe aj vo svete" },
      { k: "Rýchlosť", v: "Tím na mieste približne do 14 dní" },
      { k: "V cene", v: "A1 a povolenia, doprava, ubytovanie, koordinátor" },
    ],
    card: {
      label: "Príklad dopytu",
      rows: [
        { role: "Zvárač TIG", count: "6×" },
        { role: "Potrubár", count: "4×" },
        { role: "Priemyselný elektrikár", count: "2×" },
        { role: "Projektový koordinátor", count: "v cene" },
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
        body: "Kvalifikovaných odborníkov vám prenajmeme na celú dobu zákazky. Pracujú pod vedením vášho pracoviska, zamestnávateľom zostávame my.",
        points: ["Jednotlivci aj celé tímy", "Krátkodobé aj dlhodobé nasadenia", "Žiadny nábor ani HR administratíva na vašej strane"],
      },
      {
        title: "Odstávky a nábehy výroby",
        body: "Posila pre odstávky, nábehy výroby a projektové špičky. Kapacitu rýchlo navýšite a po skončení prác ju znova znížite.",
        points: ["Mobilizácia približne do dvoch týždňov", "Zmennosť podľa dohody s pracoviskom", "Po projekte žiadne fixné náklady"],
      },
      {
        title: "Kompletná mobilizácia",
        body: "Všetko medzi „potrebujeme ľudí“ a „pracujú produktívne na mieste“ je na nás: nábor, papiere, doprava, ubytovanie aj podpora.",
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
    note: "Hľadáte inú profesiu? Opýtajte sa nás, naša sieť pokrýva väčšinu priemyselných profesií.",
  },
  included: {
    label: "Všetko v cene",
    title: "Všetko okolo vášho tímu vybavíme my",
    lead: "Vy dostanete produktívnych ľudí na pracovisku. Nábor, papiere, doprava a podpora zostávajú na nás.",
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
      { name: "Automotive a dodávatelia", tags: "Montáž · Karosárne · Kvalita" },
      { name: "Kovovýroba a zváranie", tags: "MIG/MAG · TIG · Oceľové konštrukcie" },
      { name: "Energetika a elektrárne", tags: "Odstávky · Potrubia · Strojárstvo" },
      { name: "Lodiarstvo a offshore", tags: "Trup · Vystrojovanie · Potrubárstvo" },
      { name: "Elektro a automatizácia", tags: "Inštalácia · PLC · Uvádzanie do prevádzky" },
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
        period: "Deň 2–7",
        title: "Nábor a preverenie",
        body: "Kandidáti z našej siete prejdú praktickými testami a kontrolou dokladov a certifikátov.",
      },
      {
        period: "Deň 7–14",
        title: "Legislatíva a mobilizácia",
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
    title: "Personálny partner, nie len dodávateľ životopisov",
    items: [
      { title: "Jeden partner na všetko", body: "Nábor, papiere, doprava, ubytovanie aj podpora na mieste od jednej kontaktnej osoby." },
      { title: "Overení pred nasadením", body: "Každý špecialista prejde praktickým testom, aby váš harmonogram neplatil za prekvapenia." },
      { title: "Flexibilná kapacita", body: "Navýšte kapacitu na odstávku či nábeh výroby a po skončení projektu ju znížte." },
      { title: "Rýchla náhrada", body: "Ak niekto nespĺňa vaše požiadavky, rýchlo ho nahradíme." },
    ],
  },
  reach: {
    label: "Kde pôsobíme",
    title: "Sídlime na Slovensku, pracujeme na projektoch v celej Európe aj mimo nej",
    countries: [
      "Nemecko", "Rakúsko", "Švajčiarsko", "Švédsko", "Nórsko", "Fínsko", "Dánsko",
      "Holandsko", "Belgicko", "Francúzsko", "Poľsko", "Česko", "Slovensko", "SAE",
    ],
  },
  faq: {
    label: "Otázky",
    title: "Časté otázky",
    items: [
      {
        q: "Ako funguje leasing pracovníkov?",
        a: "Pracovníci sú zamestnancami KTechnology a na dobu projektu vám ich prenajmeme. Pracujú pod vedením vášho pracoviska, my riešime zmluvy, mzdy, poistenie a všetku administratívu a vy dostanete jednu faktúru.",
      },
      {
        q: "Ako rýchlo môžu pracovníci nastúpiť?",
        a: "Zvyčajne približne do dvoch týždňov od dopytu: niekoľko dní na výber a testy, potom zmluvy, formuláre A1 a doprava. Pri naliehavých odstávkach nám povedzte termín a úprimne vám povieme, čo je možné.",
      },
      {
        q: "V ktorých krajinách pôsobíte?",
        a: "Pracovníkov nasadzujeme v celej Európe aj vo svete, okrem iného v Nemecku, Rakúsku, škandinávskych krajinách, Beneluxe, Francúzsku, Poľsku a na Blízkom východe.",
      },
      {
        q: "Akú administratívu vybavíte?",
        a: "Pracovné zmluvy, formuláre A1 alebo pracovné povolenia, poistenie, kontrolu certifikátov, OOPP, dopravu a ubytovanie. Pre pracovníkov nemusíte nič zabezpečovať.",
      },
      {
        q: "Čo ak pracovník nespĺňa naše očakávania?",
        a: "Povedzte to svojmu koordinátorovi. Problém preberieme a v prípade potreby pracovníka čo najrýchlejšie nahradíme.",
      },
      {
        q: "Ako sa služba oceňuje?",
        a: "Cenu stanovujeme na pracovníka podľa profesie, lokality, dĺžky nasadenia a zmennosti. Pošlite nám dopyt a cenovú ponuku dostanete do jedného pracovného dňa.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Napíšte nám, koho potrebujete",
    body: "Pošlite nám dopyt a projektový koordinátor sa vám do jedného pracovného dňa ozve s dostupnosťou a cenovou ponukou.",
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
      headcount: "Počet ľudí",
      start: "Plánovaný nástup",
      message: "Detaily projektu",
      submit: "Odoslať dopyt",
      sending: "Odosiela sa…",
      success: "Ďakujeme. Váš dopyt sme prijali a čoskoro sa ozveme.",
      error: "Niečo sa pokazilo. Napíšte nám, prosím, priamo e-mail.",
      consent: "Odoslaním formulára súhlasíte so spracovaním údajov na účely vybavenia dopytu.",
    },
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Leasing pracovníkov pre priemysel zo Slovenska, pre projekty v celej Európe aj vo svete.",
    rights: "Všetky práva vyhradené.",
    top: "Späť hore",
  },
};

export default sk;
