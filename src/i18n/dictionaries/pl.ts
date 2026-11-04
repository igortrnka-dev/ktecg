import type { Dictionary } from "..";

const pl: Dictionary = {
  meta: {
    title: "KTechnology — Leasing pracowników dla przemysłu: spawacze, monterzy, elektrycy",
    description:
      "KTechnology s.r.o. zapewnia leasing spawaczy, monterów rurociągów, elektryków, mechaników i operatorów o sprawdzonych umiejętnościach do projektów przemysłowych w Europie i Skandynawii. A1, dojazd i zakwaterowanie po naszej stronie, zespół na miejscu w ciągu około 14 dni.",
  },
  nav: {
    home: "Strona główna",
    services: "Usługi",
    sectors: "Branże",
    projects: "Projekty",
    about: "O nas",
    contact: "Kontakt",
    breadcrumb: "Ścieżka nawigacyjna",
    cta: "Zamów pracowników",
    language: "Język",
    menu: "Menu",
    mainNav: "Nawigacja główna",
    skip: "Przejdź do treści",
    ctaShort: "Wycena",
  },
  hero: {
    eyebrow: "Leasing pracowników dla przemysłu\u00a0· Europa i Skandynawia",
    title: "Wykwali\u00adfiko\u00adwani spawacze, monterzy i elektrycy na miejscu w ciągu około 14\u00a0dni",
    lead:
      "W ramach leasingu pracowników zapewniamy sprawdzonych fachowców producentom, wykonawcom i firmom EPC w całej Europie. Zajmujemy się umowami, zaświadczeniami A1 lub zezwoleniami na pracę, ubezpieczeniem, dojazdem i zakwaterowaniem. Jedna osoba kontaktowa, jedna faktura.",
    primary: "Zamów pracowników",
    secondary: "Zobacz zawody",
    facts: [
      { k: "Zawody", v: "Spawacze, monterzy, elektrycy, mechanicy, operatorzy" },
      { k: "Gdzie", v: "Niemcy, Austria, kraje nordyckie, Beneluks, Francja, PL/CZ/SK, ZEA" },
      { k: "Czas", v: "Wycena w ciągu 1\u00a0dnia roboczego, zespół na miejscu w ok.\u00a014\u00a0dni" },
      { k: "W cenie", v: "A1 i zezwolenia, dojazd, zakwaterowanie, koordynator" },
    ],
    card: {
      label: "Przykładowe zapytanie",
      rows: [
        { role: "Spawacz TIG", count: "6×" },
        { role: "Monter rurociągów", count: "4×" },
        { role: "Elektryk przemysłowy", count: "2×" },
        { role: "Koordynator projektu", count: "w cenie" },
      ],
      meta: [
        { k: "Projekt", v: "Postój remontowy" },
        { k: "Start", v: "za ~14\u00a0dni" },
      ],
      status: "Kompletujemy zespół",
    },
  },
  services: {
    label: "Usługi",
    title: "Co oferujemy",
    lead: "Leasing pracowników dla przemysłu: od jednego specjalisty po kompletny zespół, na czas trwania projektu.",
    more: "Wszystkie usługi i zawody",
    items: [
      {
        title: "Leasing pracowników",
        body: "Wykwalifikowani fachowcy skierowani do Państwa firmy na czas zlecenia. Pracują pod nadzorem kierownictwa na miejscu, a ich pracodawcą pozostajemy my.",
        points: ["Pojedynczy specjaliści lub całe zespoły", "Zlecenia krótko- i długoterminowe", "Bez rekrutacji i obsługi kadrowej po Państwa stronie"],
      },
      {
        title: "Postoje remontowe i wzrost produkcji",
        body: "Dodatkowi ludzie na czas postojów remontowych, zwiększenia produkcji i spiętrzenia prac w projektach. Zespół można szybko powiększyć, a po zakończeniu prac – zmniejszyć.",
        points: ["Mobilizacja w ciągu około dwóch tygodni", "System zmianowy uzgodniony z Państwem", "Brak kosztów stałych po projekcie"],
      },
      {
        title: "Kompleksowa mobilizacja",
        body: "Wszystko od „potrzebujemy ludzi” do „pracują wydajnie na miejscu” bierzemy na siebie: rekrutację, dokumenty, dojazd, zakwaterowanie i wsparcie.",
        points: ["Umowy, zaświadczenia A1 i zezwolenia", "Dojazd, zakwaterowanie i ŚOI", "Koordynator przez cały projekt"],
      },
    ],
  },
  trades: {
    label: "Zawody",
    title: "Kogo zapewniamy",
    lead: "Doświadczonych fachowców. Każdy przed skierowaniem do pracy przechodzi praktyczny test umiejętności i weryfikację certyfikatów.",
    items: [
      {
        name: "Spawacze",
        skills: ["MIG/MAG", "TIG", "MMA", "Stal czarna i nierdzewna"],
        body: "Spawacze z doświadczeniem w spawaniu stali czarnej i nierdzewnej metodami MIG/MAG, TIG i MMA.",
      },
      {
        name: "Monterzy rurociągów",
        skills: ["Rurociągi przemysłowe", "Rysunki izometryczne", "Prefabrykacja", "Montaż"],
        body: "Monterzy rurociągów, którzy prefabrykują i montują rurociągi przemysłowe na podstawie rysunków izometrycznych.",
      },
      {
        name: "Monterzy konstrukcji stalowych",
        skills: ["Konstrukcje stalowe", "Rysunki techniczne", "Montaż", "Połączenia śrubowe"],
        body: "Monterzy, którzy na podstawie rysunków technicznych wykonują i montują konstrukcje stalowe, łącznie z połączeniami śrubowymi.",
      },
      {
        name: "Elektrycy przemysłowi",
        skills: ["Instalacje", "Okablowanie i koryta", "Rozdzielnice"],
        body: "Elektrycy do instalacji przemysłowych: układanie kabli, montaż koryt kablowych i podłączanie rozdzielnic.",
      },
      {
        name: "Technicy automatyki",
        skills: ["PLC", "Uruchomienia", "Diagnostyka"],
        body: "Technicy do programowania sterowników PLC, uruchamiania urządzeń i diagnozowania usterek.",
      },
      {
        name: "Mechanicy i monterzy maszyn",
        skills: ["Instalacja maszyn", "Osiowanie", "Remonty podczas postojów"],
        body: "Mechanicy do instalacji i osiowania maszyn oraz prac remontowych podczas postojów.",
      },
      {
        name: "Operatorzy CNC i maszyn",
        skills: ["Toczenie i frezowanie", "Ustawianie maszyn", "Pomiary"],
        body: "Operatorzy do toczenia i frezowania, ustawiania maszyn oraz pomiaru części.",
      },
      {
        name: "Operatorzy montażu",
        skills: ["Montaż liniowy", "Kontrola jakości", "Praca zmianowa"],
        body: "Operatorzy do montażu liniowego i kontroli jakości, przyzwyczajeni do pracy zmianowej.",
      },
      {
        name: "Technicy AKPiA",
        skills: ["Pomiary i automatyka", "Kalibracja przyrządów", "Czujniki i pętle regulacji"],
        body: "Technicy w zakresie pomiarów i automatyki: kalibracja przyrządów, czujniki i pętle regulacji.",
      },
    ],
    note: "Potrzebują Państwo innej specjalności? Prosimy o kontakt – nasza sieć obejmuje większość zawodów przemysłowych.",
    open: "Szczegóły zawodu",
    skillsTitle: "Umiejętności",
    vetting: "Każdy pracownik przed skierowaniem do pracy przechodzi praktyczny test umiejętności i weryfikację certyfikatów.",
    projectsTitle: "Powiązane projekty",
    others: "Inne zawody",
    metaSuffix: "leasing pracowników dla przemysłu | KTechnology",
  },
  included: {
    label: "Wszystko w cenie",
    title: "Bierzemy na siebie całą obsługę zespołu",
    lead: "Państwo otrzymują wydajnych ludzi na miejscu, a rekrutacja, dokumenty, dojazd i wsparcie pozostają po naszej stronie.",
    items: [
      "Wyszukiwanie i selekcja",
      "Praktyczne testy umiejętności",
      "Weryfikacja certyfikatów i dokumentów",
      "Umowy o pracę",
      "Zaświadczenia A1 i zezwolenia na pracę",
      "Ubezpieczenie",
      "Środki ochrony indywidualnej",
      "Dojazd i zakwaterowanie",
      "Stały koordynator projektu",
      "Szybka wymiana pracownika",
    ],
  },
  sectors: {
    label: "Branże",
    title: "Gdzie pracują nasi ludzie",
    lead: "Branże, w których nasi ludzie wzmacniają zespoły producentów, wykonawców i firm EPC.",
    items: [
      { name: "Motoryzacja i dostawcy", tags: "Automatyka · Programowanie · Robotyka" },
      { name: "Obróbka metali i spawanie", tags: "MIG/MAG · TIG · Konstrukcje stalowe" },
      { name: "Energetyka i elektrownie", tags: "Postoje · Rurociągi · Mechanika" },
      { name: "Przemysł stoczniowy i offshore", tags: "Kadłub · Wyposażenie · Rurociągi" },
      { name: "Elektryka i automatyka", tags: "Instalacje · PLC · Uruchomienia" },
      { name: "Logistyka i produkcja", tags: "Operatorzy · Wózki widłowe · Magazyn" },
      { name: "Budynki komercyjne i biurowe", tags: "Elektryka · Instalacje budynkowe · AKPiA" },
    ],
  },
  process: {
    label: "Jak działamy",
    title: "Od zapytania do zespołu na miejscu w ciągu około dwóch tygodni",
    steps: [
      {
        period: "Dzień 1",
        title: "Analiza potrzeb",
        body: "Wspólnie z Państwa kierownikiem projektu ustalamy stanowiska, kwalifikacje, liczbę osób, system zmianowy i warunki na miejscu.",
      },
      {
        period: "Dni 2–7",
        title: "Rekrutacja i weryfikacja",
        body: "Kandydaci z naszej sieci przechodzą testy praktyczne oraz weryfikację dokumentów i certyfikatów.",
      },
      {
        period: "Dni 7–14",
        title: "Formalności i mobilizacja",
        body: "Organizujemy umowy, zaświadczenia A1 lub zezwolenia na pracę, ubezpieczenie, ŚOI, dojazd i zakwaterowanie.",
      },
      {
        period: "W trakcie projektu",
        title: "Nadzór i wsparcie",
        body: "Koordynator pozostaje w kontakcie z Państwa kierownictwem na miejscu, monitoruje wydajność i w razie potrzeby szybko zapewnia zastępstwo.",
      },
    ],
  },
  why: {
    label: "Dlaczego KTechnology",
    title: "Partner, który zapewnia ludzi, a nie tylko CV",
    items: [
      { title: "Wszystko u jednego partnera", body: "Rekrutacja, dokumenty, dojazd, zakwaterowanie i wsparcie na miejscu – wszystko przez jedną osobę kontaktową." },
      { title: "Sprawdzeni przed wyjazdem", body: "Każdy specjalista przechodzi test praktyczny, dzięki czemu unikają Państwo niespodzianek w harmonogramie." },
      { title: "Elastyczna obsada", body: "Zespół można powiększyć na czas postoju lub zwiększenia produkcji i zmniejszyć po zakończeniu projektu." },
      { title: "Szybka wymiana", body: "Jeśli ktoś nie spełnia Państwa wymagań, szybko go wymienimy." },
    ],
  },
  reach: {
    label: "Gdzie działamy",
    title: "Siedziba na Słowacji, projekty w całej Europie i Skandynawii",
    countries: [
      "Niemcy", "Austria", "Szwecja", "Norwegia", "Finlandia", "Dania",
      "Holandia", "Belgia", "Francja", "Polska", "Czechy", "Słowacja", "ZEA",
    ],
  },
  faq: {
    label: "FAQ",
    title: "Najczęstsze pytania",
    items: [
      {
        q: "Jak działa leasing pracowników?",
        a: "Pracownicy są zatrudnieni przez KTechnology i skierowani do Państwa firmy na czas projektu. Pracują pod nadzorem kierownictwa na miejscu, a my zajmujemy się umowami, wynagrodzeniami, ubezpieczeniem i wszystkimi formalnościami. Otrzymują Państwo jedną fakturę.",
      },
      {
        q: "Jak szybko pracownicy mogą zacząć?",
        a: "Zwykle w ciągu około dwóch tygodni od zapytania: kilka dni na selekcję i testy, potem umowy, zaświadczenia A1 i dojazd. W przypadku pilnego postoju prosimy podać termin – uczciwie powiemy, co jest możliwe.",
      },
      {
        q: "W jakich krajach działacie?",
        a: "Kierujemy pracowników do pracy w Niemczech, Austrii, Szwecji, Norwegii, Finlandii, Danii, krajach Beneluksu, Francji, Polsce i Czechach, a także na Słowacji i w Zjednoczonych Emiratach Arabskich. Pozostałe kraje – na zapytanie.",
      },
      {
        q: "Jakie formalności załatwiacie?",
        a: "Umowy o pracę, zaświadczenia A1 lub zezwolenia na pracę, ubezpieczenie, weryfikację certyfikatów, ŚOI, dojazd i zakwaterowanie. Nie muszą Państwo niczego organizować dla pracowników.",
      },
      {
        q: "Co, jeśli pracownik nie spełnia naszych oczekiwań?",
        a: "Wystarczy zgłosić to koordynatorowi. Omówimy problem i w razie potrzeby jak najszybciej wymienimy pracownika.",
      },
      {
        q: "Jak wyceniana jest usługa?",
        a: "Stawka jest ustalana za pracownika i zależy od zawodu, lokalizacji, czasu trwania oraz systemu zmianowego. Wycenę przesyłamy w ciągu jednego dnia roboczego od otrzymania zapytania.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Kogo Państwo potrzebują?",
    body: "Po otrzymaniu zapytania koordynator projektu odpowie w ciągu jednego dnia roboczego, podając dostępność pracowników i wycenę.",
    emailLabel: "Lub bezpośrednio e-\u2060mailem",
    tipsTitle: "Warto podać",
    tips: ["Lokalizację (miasto) i godziny pracy", "Wymagane certyfikaty, np.\u00a0metodę spawania i normę", "Język roboczy i wymagane szkolenia BHP"],
    form: {
      company: "Firma",
      name: "Imię i nazwisko",
      email: "E-mail",
      phone: "Telefon",
      country: "Kraj projektu",
      positions: "Potrzebne stanowiska (np.\u00a06×\u00a0spawacz\u00a0TIG)",
      duration: "Okres (np.\u00a06\u00a0tygodni)",
      shift: "System zmianowy",
      shifts: {
        unsure: "Do ustalenia",
        single: "1 zmiana",
        double: "2 zmiany",
        triple: "3 zmiany",
        rotation: "Zmiany po 12\u00a0h",
      },
      required: "* Pola obowiązkowe",
      start: "Planowany start",
      message: "Szczegóły projektu",
      submit: "Wyślij zapytanie",
      sending: "Wysyłanie…",
      success: "Dziękujemy. Koordynator projektu odpowie w ciągu jednego dnia roboczego, podając dostępność pracowników i wycenę.",
      error: "Nie udało się wysłać zapytania. Wprowadzone dane pozostały w formularzu – prosimy przesłać je e-\u2060mailem na adres:",
      invalid: "Prosimy sprawdzić zaznaczone pola.",
      emailHint: "np. imie@firma.pl",
      consent: "Państwa dane wykorzystujemy wyłącznie w celu odpowiedzi na zapytanie i przygotowania wyceny.",
    },
  },
  projects: {
    label: "Projekty",
    title: "Projekty i referencje",
    lead: "Wybrane projekty, przy których pracowali nasi spawacze, monterzy, elektrycy i technicy.",
    empty: "Właśnie uzupełniamy przegląd zrealizowanych projektów. Prosimy o kontakt – chętnie opowiemy o projektach w Państwa branży.",
    open: "Szczegóły projektu",
    metaSuffix: "projekt | KTechnology",
    facts: { country: "Kraj", sector: "Branża", year: "Rok", team: "Liczba pracowników", duration: "Czas trwania" },
    scopeTitle: "Zakres prac",
    tradesTitle: "Zawody w projekcie",
    stats: {
      label: "W liczbach",
      title: "KTechnology w liczbach",
      projects: "Zrealizowane projekty",
      countries: "Kraje",
      workers: "Sprawdzeni pracownicy",
    },
  },
  about: {
    label: "O nas",
    title: "Specjaliści dla przemysłu ze Słowacji do projektów w Europie i Skandynawii",
    lead: "KTechnology s.r.o. to słowacka firma, która zapewnia leasing wykwalifikowanych pracowników przemysłowych producentom, wykonawcom i firmom EPC.",
    body: [
      "Zapewniamy spawaczy, monterów rurociągów, monterów konstrukcji stalowych, elektryków, mechaników, techników i operatorów – od jednego specjalisty po kompletny zespół, na cały czas trwania Państwa projektu. Każdy pracownik przed skierowaniem do pracy przechodzi praktyczny test umiejętności i weryfikację certyfikatów.",
      "Zajmujemy się wszystkim, co dotyczy zespołu: umowami, zaświadczeniami A1 i zezwoleniami, ubezpieczeniem, ŚOI, dojazdem i zakwaterowaniem. W trakcie projektu mają Państwo jednego koordynatora i otrzymują jedną fakturę.",
    ],
  },
  cta: {
    title: "Potrzebują Państwo wzmocnienia zespołu?",
    body: "Prosimy przesłać zapytanie – w ciągu jednego dnia roboczego odpowiemy, podając dostępność pracowników i wycenę.",
    email: "Lub bezpośrednio e-\u2060mailem",
  },
  pages: {
    services: {
      meta: {
        title: "Usługi i zawody – leasing pracowników dla przemysłu | KTechnology",
        description:
          "Leasing pracowników, wsparcie podczas postojów remontowych i wzrostu produkcji, kompleksowa mobilizacja: spawacze, monterzy rurociągów, elektrycy, mechanicy, technicy i operatorzy, sprawdzeni przed skierowaniem do pracy.",
      },
    },
    sectors: {
      meta: {
        title: "Branże – KTechnology",
        description:
          "Gdzie pracują nasi ludzie: motoryzacja, obróbka metali, energetyka, przemysł stoczniowy i offshore, elektryka i automatyka, logistyka i produkcja, budynki komercyjne i biurowe.",
      },
    },
    projects: {
      meta: {
        title: "Projekty i referencje – KTechnology",
        description: "Projekty, przy których pracowali nasi spawacze, monterzy, elektrycy i technicy w Europie i Skandynawii.",
      },
    },
    about: {
      meta: {
        title: "O nas – KTechnology",
        description:
          "KTechnology s.r.o. to słowacka firma, która zapewnia leasing wykwalifikowanych pracowników przemysłowych producentom, wykonawcom i firmom EPC w Europie i Skandynawii.",
      },
    },
    contact: {
      meta: {
        title: "Kontakt – zamów pracowników | KTechnology",
        description: "Prosimy przesłać zapytanie: koordynator projektu odpowie w ciągu jednego dnia roboczego, podając dostępność pracowników i wycenę.",
      },
    },
  },
  notFound: {
    title: "Nie znaleziono strony",
    body: "Szukana strona nie istnieje lub została przeniesiona.",
    home: "Powrót na stronę główną",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Leasing pracowników dla przemysłu – ze Słowacji do projektów w całej Europie i Skandynawii.",
    pages: "Strony",
    rights: "Wszelkie prawa zastrzeżone.",
    top: "Do góry",
  },
};

export default pl;
