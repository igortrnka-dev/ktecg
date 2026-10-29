import type { Dictionary } from "..";

const pl: Dictionary = {
  meta: {
    title: "KTechnology — Leasing pracowników dla przemysłu: spawacze, monterzy, elektrycy",
    description:
      "KTechnology s.r.o. zapewnia leasing certyfikowanych spawaczy, monterów rurociągów, elektryków, mechaników i operatorów do projektów przemysłowych w Europie i na świecie. Sprawdzone umiejętności, A1, dojazd i zakwaterowanie po naszej stronie, zespół na miejscu w około 14 dni.",
  },
  nav: {
    services: "Usługi",
    trades: "Zawody",
    sectors: "Branże",
    process: "Jak działamy",
    faq: "FAQ",
    contact: "Kontakt",
    cta: "Zamów pracowników",
    language: "Język",
    menu: "Menu",
    mainNav: "Main navigation",
    skip: "Skip to content",
    ctaShort: "Get a quote",
  },
  hero: {
    eyebrow: "Leasing pracowników dla przemysłu · Europa i świat",
    title: "Wykwalifikowani pracownicy przemysłowi dla Twojego projektu, gotowi od pierwszego dnia",
    lead:
      "KTechnology zapewnia leasing certyfikowanych spawaczy, monterów rurociągów, elektryków, mechaników i operatorów dla producentów, wykonawców i firm EPC. Rekrutujemy, testujemy, zatrudniamy, ubezpieczamy i dowozimy ich na Twoją budowę.",
    primary: "Zamów pracowników",
    secondary: "Zobacz zawody",
    facts: [
      { k: "Zawody", v: "Spawacze, monterzy, elektrycy, mechanicy, operatorzy" },
      { k: "Gdzie", v: "W całej Europie i na świecie" },
      { k: "Czas", v: "Zespół na miejscu w około 14 dni" },
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
        { k: "Start", v: "w ~14 dni" },
      ],
      status: "Zespół w przygotowaniu",
    },
  },
  services: {
    label: "Usługi",
    title: "Co oferujemy",
    lead: "Leasing pracowników dla przemysłu: od jednego specjalisty po kompletny zespół, na cały czas trwania projektu.",
    items: [
      {
        title: "Leasing pracowników",
        body: "Wykwalifikowani fachowcy oddelegowani do Twojej firmy na czas zlecenia. Pracują pod kierownictwem Twojej budowy, a pracodawcą pozostajemy my.",
        points: ["Pojedynczy specjaliści lub całe zespoły", "Krótkie i długie oddelegowania", "Bez rekrutacji i obsługi kadrowej po Twojej stronie"],
      },
      {
        title: "Postoje remontowe i rozruchy",
        body: "Dodatkowe ręce do pracy na postoje remontowe, rozruchy produkcji i szczyty projektowe. Szybko zwiększ zespół i zmniejsz go po zakończeniu prac.",
        points: ["Mobilizacja w około dwa tygodnie", "System zmianowy uzgodniony z budową", "Brak kosztów stałych po projekcie"],
      },
      {
        title: "Kompleksowa mobilizacja",
        body: "Wszystko pomiędzy „potrzebujemy ludzi” a „pracują wydajnie na miejscu” bierzemy na siebie: rekrutację, dokumenty, dojazd, zakwaterowanie i wsparcie.",
        points: ["Umowy, formularze A1 i zezwolenia", "Dojazd, zakwaterowanie i ŚOI", "Koordynator przez cały projekt"],
      },
    ],
  },
  trades: {
    label: "Zawody",
    title: "Kogo zapewniamy",
    lead: "Doświadczonych fachowców. Każdy przed oddelegowaniem przechodzi praktyczny test umiejętności i weryfikację certyfikatów.",
    items: [
      { name: "Spawacze", skills: ["MIG/MAG", "TIG", "MMA", "Stal i stal nierdzewna"] },
      { name: "Monterzy rurociągów", skills: ["Rurociągi przemysłowe", "Rysunki izometryczne", "Prefabrykacja", "Montaż"] },
      { name: "Monterzy konstrukcji stalowych", skills: ["Konstrukcje stalowe", "Rysunki techniczne", "Montaż", "Połączenia śrubowe"] },
      { name: "Elektrycy przemysłowi", skills: ["Instalacje", "Okablowanie i koryta", "Rozdzielnice"] },
      { name: "Technicy automatyki", skills: ["PLC", "Uruchomienia", "Diagnostyka"] },
      { name: "Mechanicy i monterzy maszyn", skills: ["Instalacja maszyn", "Osiowanie", "Utrzymanie ruchu w postojach"] },
      { name: "Operatorzy CNC i maszyn", skills: ["Toczenie i frezowanie", "Ustawianie maszyn", "Pomiary"] },
      { name: "Operatorzy montażu", skills: ["Montaż liniowy", "Kontrola jakości", "Praca zmianowa"] },
      { name: "Pracownicy logistyki", skills: ["Wózek widłowy", "Magazyn i kompletacja", "Zasilanie linii"] },
    ],
    note: "Szukasz innego zawodu? Zapytaj nas, nasza sieć obejmuje większość zawodów przemysłowych.",
  },
  included: {
    label: "Wszystko w cenie",
    title: "Zajmujemy się wszystkim wokół Twojego zespołu",
    lead: "Ty otrzymujesz wydajnych ludzi na miejscu. Rekrutacja, dokumenty, dojazd i wsparcie zostają po naszej stronie.",
    items: [
      "Wyszukiwanie i selekcja",
      "Praktyczne testy umiejętności",
      "Weryfikacja certyfikatów i dokumentów",
      "Umowy o pracę",
      "Formularze A1 i zezwolenia na pracę",
      "Ubezpieczenie",
      "Środki ochrony indywidualnej",
      "Dojazd i zakwaterowanie",
      "Własny koordynator projektu",
      "Szybka wymiana pracownika",
    ],
  },
  sectors: {
    label: "Branże",
    title: "Gdzie pracują nasi ludzie",
    items: [
      { name: "Motoryzacja i dostawcy", tags: "Montaż · Karoseria · Jakość" },
      { name: "Obróbka metali i spawanie", tags: "MIG/MAG · TIG · Konstrukcje stalowe" },
      { name: "Energetyka i elektrownie", tags: "Postoje · Rurociągi · Mechanika" },
      { name: "Przemysł stoczniowy i offshore", tags: "Kadłub · Wyposażenie · Rurociągi" },
      { name: "Elektryka i automatyka", tags: "Instalacje · PLC · Uruchomienia" },
      { name: "Logistyka i produkcja", tags: "Operatorzy · Wózki widłowe · Magazyn" },
    ],
  },
  process: {
    label: "Jak działamy",
    title: "Od zapytania do zespołu na miejscu w około dwa tygodnie",
    steps: [
      {
        period: "Dzień 1",
        title: "Analiza potrzeb",
        body: "Razem z Twoim kierownikiem projektu ustalamy stanowiska, kwalifikacje, liczbę osób, system zmianowy i warunki na budowie.",
      },
      {
        period: "Dzień 2–7",
        title: "Rekrutacja i weryfikacja",
        body: "Kandydaci z naszej sieci przechodzą testy praktyczne oraz weryfikację dokumentów i certyfikatów.",
      },
      {
        period: "Dzień 7–14",
        title: "Formalności i mobilizacja",
        body: "Umowy, A1 / zezwolenia na pracę, ubezpieczenie, ŚOI, dojazd i zakwaterowanie organizujemy my.",
      },
      {
        period: "W trakcie projektu",
        title: "Nadzór i wsparcie",
        body: "Koordynator pozostaje w kontakcie z budową, monitoruje wydajność i w razie potrzeby szybko zapewnia zastępstwo.",
      },
    ],
  },
  why: {
    label: "Dlaczego KTechnology",
    title: "Partner kadrowy, a nie tylko dostawca CV",
    items: [
      { title: "Jeden partner do wszystkiego", body: "Rekrutacja, dokumenty, dojazd, zakwaterowanie i wsparcie na miejscu od jednej osoby kontaktowej." },
      { title: "Sprawdzeni przed wyjazdem", body: "Każdy specjalista zdaje test praktyczny, aby Twój harmonogram nie płacił za niespodzianki." },
      { title: "Elastyczna liczba ludzi", body: "Zwiększ zespół na postój lub rozruch i zmniejsz go po zakończeniu projektu." },
      { title: "Szybka wymiana", body: "Jeśli ktoś nie spełnia Twoich wymagań, szybko go wymienimy." },
    ],
  },
  reach: {
    label: "Gdzie działamy",
    title: "Siedziba na Słowacji, praca na budowach w całej Europie i poza nią",
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
        a: "Pracownicy są zatrudnieni przez KTechnology i oddelegowani do Twojej firmy na czas projektu. Pracują pod kierownictwem Twojej budowy; my zajmujemy się umowami, wynagrodzeniami, ubezpieczeniem i formalnościami, a Ty otrzymujesz jedną fakturę.",
      },
      {
        q: "Jak szybko pracownicy mogą zacząć?",
        a: "Zwykle w około dwa tygodnie od zapytania: kilka dni na selekcję i testy, potem umowy, formularze A1 i dojazd. Przy pilnych postojach podaj nam termin, a uczciwie powiemy, co jest możliwe.",
      },
      {
        q: "W jakich krajach działacie?",
        a: "Oddelegowujemy pracowników w całej Europie i na świecie, m.in. do Niemiec, Austrii, krajów nordyckich, Beneluksu, Francji, Polski i na Bliski Wschód.",
      },
      {
        q: "Jakie formalności załatwiacie?",
        a: "Umowy o pracę, formularze A1 lub zezwolenia na pracę, ubezpieczenie, weryfikację certyfikatów, ŚOI, dojazd i zakwaterowanie. Nie musisz niczego organizować dla pracowników.",
      },
      {
        q: "Co jeśli pracownik nie spełnia naszych oczekiwań?",
        a: "Powiedz o tym swojemu koordynatorowi. Omówimy problem i w razie potrzeby jak najszybciej wymienimy pracownika.",
      },
      {
        q: "Jak wyceniana jest usługa?",
        a: "Wyceniamy za pracownika, w zależności od zawodu, lokalizacji, czasu trwania i systemu zmianowego. Wyślij zapytanie, a ofertę otrzymasz w ciągu jednego dnia roboczego.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Napisz, kogo potrzebujesz",
    body: "Wyślij zapytanie, a koordynator projektu odezwie się w ciągu jednego dnia roboczego z dostępnością i wyceną.",
    emailLabel: "Lub napisz bezpośrednio",
    tipsTitle: "Warto podać",
    tips: ["Zawody i liczbę osób", "Lokalizację projektu i datę rozpoczęcia", "Przewidywany czas trwania i system zmianowy"],
    form: {
      company: "Firma",
      name: "Imię i nazwisko",
      email: "E-mail",
      phone: "Telefon",
      country: "Kraj projektu",
      positions: "Potrzebne stanowiska (np. 6× spawacz TIG)",
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
      start: "Planowany start",
      message: "Szczegóły projektu",
      submit: "Wyślij zapytanie",
      sending: "Wysyłanie…",
      success: "Dziękujemy. Otrzymaliśmy Twoje zapytanie i wkrótce się odezwiemy.",
      error: "Coś poszło nie tak. Napisz do nas bezpośrednio e-mail.",
      consent: "Wysyłając formularz, zgadzasz się na przetwarzanie danych w celu odpowiedzi na zapytanie.",
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    home: "Back to the homepage",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Leasing pracowników dla przemysłu ze Słowacji, do projektów w całej Europie i na świecie.",
    rights: "Wszelkie prawa zastrzeżone.",
    top: "Do góry",
  },
};

export default pl;
