import type { Dictionary } from "..";

const de: Dictionary = {
  meta: {
    title: "KTechnology – Arbeitnehmerüberlassung für die Industrie: Schweißer, Monteure, Elektriker",
    description:
      "KTechnology s.r.o. überlässt praxisgeprüfte Schweißer, Rohrschlosser, Elektriker, Mechaniker und Maschinenbediener für Industrieprojekte in ganz Europa und Skandinavien. A1, Anreise und Unterkunft übernehmen wir; das Team ist in rund 14 Tagen vor Ort.",
  },
  nav: {
    home: "Startseite",
    services: "Leistungen",
    sectors: "Branchen",
    projects: "Projekte",
    about: "Über uns",
    contact: "Kontakt",
    breadcrumb: "Pfadnavigation",
    cta: "Fachkräfte anfragen",
    language: "Sprache",
    menu: "Menü",
    mainNav: "Hauptnavigation",
    skip: "Zum Inhalt springen",
    ctaShort: "Anfragen",
  },
  hero: {
    eyebrow: "Arbeitnehmerüberlassung für die Industrie\u00a0· Europa\u00a0&\u00a0Skandinavien",
    title: "Schweißer, Monteure und Elektriker in rund 14\u00a0Tagen bei Ihnen vor Ort",
    lead:
      "Wir überlassen geprüfte Industriefachkräfte an Hersteller, Anlagenbauer und EPC-Unternehmen in ganz Europa\u00a0– und übernehmen Verträge, A1/Genehmigungen, Versicherung, Anreise und Unterkunft. Ein Ansprechpartner, eine Rechnung.",
    primary: "Fachkräfte anfragen",
    secondary: "Unsere Berufe",
    facts: [
      { k: "Berufe", v: "Schweißer, Monteure, Elektriker, Mechaniker, Maschinenbediener" },
      { k: "Einsatzgebiete", v: "Deutschland, Österreich, Nordeuropa, Benelux, Frankreich, PL/CZ/SK, VAE" },
      { k: "Tempo", v: "Angebot in 1\u00a0Werktag, Team in rund 14\u00a0Tagen" },
      { k: "Inklusive", v: "A1 & Genehmigungen, Anreise, Unterkunft, Koordinator" },
    ],
    card: {
      label: "Beispielanfrage",
      rows: [
        { role: "WIG-Schweißer", count: "6×" },
        { role: "Rohrschlosser", count: "4×" },
        { role: "Industrieelektriker", count: "2×" },
        { role: "Projektkoordinator", count: "inkl." },
      ],
      meta: [
        { k: "Projekt", v: "Anlagenrevision" },
        { k: "Start", v: "in ~14\u00a0Tagen" },
      ],
      status: "In Vorbereitung",
    },
  },
  services: {
    label: "Leistungen",
    title: "Was wir anbieten",
    lead: "Arbeitnehmerüberlassung für die Industrie: von einer einzelnen Fachkraft bis zum kompletten Team, für die gesamte Projektdauer.",
    more: "Alle Leistungen und Berufe",
    items: [
      {
        title: "Arbeitnehmerüberlassung",
        body: "Wir überlassen Ihnen qualifizierte Fachkräfte für die Dauer des Auftrags. Vor Ort arbeiten sie nach Ihren Weisungen\u00a0– Arbeitgeber bleiben wir.",
        points: ["Einzelne Spezialisten oder ganze Teams", "Kurz- und langfristige Einsätze", "Kein Recruiting- oder HR-Aufwand für Sie"],
      },
      {
        title: "Revisionen & Hochläufe",
        body: "Zusätzliche Kapazität für Anlagenrevisionen, Produktionshochläufe und Projektspitzen. Schnell aufstocken, nach Abschluss wieder reduzieren.",
        points: ["Mobilisierung in rund zwei Wochen", "Schichtmodell nach Absprache", "Keine Fixkosten nach dem Projekt"],
      },
      {
        title: "Komplette Mobilisierung",
        body: "Alles zwischen „Wir brauchen Leute“ und „Das Team arbeitet produktiv vor Ort“ übernehmen wir: Recruiting, Formalitäten, Anreise, Unterkunft und Betreuung.",
        points: ["Verträge, A1 und Genehmigungen", "Anreise, Unterkunft und PSA", "Ein Koordinator für das ganze Projekt"],
      },
    ],
  },
  trades: {
    label: "Berufe",
    title: "Wen wir stellen",
    lead: "Erfahrene Fachkräfte. Jede absolviert vor dem Einsatz einen praktischen Eignungstest und eine Zertifikatsprüfung.",
    items: [
      {
        name: "Schweißer",
        skills: ["MIG/MAG", "WIG", "E-Hand", "Stahl & Edelstahl"],
        body: "Schweißer mit Erfahrung im MIG/MAG-, WIG- und E-Hand-Schweißen von Kohlenstoffstahl und Edelstahl.",
      },
      {
        name: "Rohrschlosser",
        skills: ["Industrierohrleitungen", "Isometrien", "Vorfertigung", "Montage"],
        body: "Rohrschlosser, die Industrierohrleitungen nach Isometrien vorfertigen und montieren.",
      },
      {
        name: "Stahlbauschlosser",
        skills: ["Stahlbau", "Technische Zeichnungen", "Montage", "Schraubverbindungen"],
        body: "Stahlbauschlosser, die Stahlkonstruktionen nach technischen Zeichnungen fertigen und montieren\u00a0– einschließlich Schraubverbindungen.",
      },
      {
        name: "Industrieelektriker",
        skills: ["Installation", "Kabel & Trassen", "Schaltschränke"],
        body: "Elektriker für Industrieinstallationen: Kabel verlegen, Kabeltrassen montieren und Schaltschränke verdrahten.",
      },
      {
        name: "Automatisierungstechniker",
        skills: ["SPS", "Inbetriebnahme", "Fehlersuche"],
        body: "Techniker für SPS-Programmierung, die Inbetriebnahme von Anlagen und die Fehlersuche.",
      },
      {
        name: "Mechaniker & Industriemonteure",
        skills: ["Maschinenaufstellung", "Ausrichtung", "Revisionsarbeiten"],
        body: "Mechaniker, die Maschinen aufstellen und ausrichten und Instandhaltungsarbeiten während Revisionen durchführen.",
      },
      {
        name: "CNC- & Maschinenbediener",
        skills: ["Drehen & Fräsen", "Maschineneinrichtung", "Messen"],
        body: "Maschinenbediener für Dreh- und Fräsarbeiten, das Einrichten von Maschinen und das Messen von Teilen.",
      },
      {
        name: "Montagemitarbeiter",
        skills: ["Linienmontage", "Qualitätsprüfung", "Schichtarbeit"],
        body: "Mitarbeiter für Linienmontage und Qualitätsprüfung, mit Erfahrung in Schichtarbeit.",
      },
      {
        name: "MSR-Techniker",
        skills: ["Mess-, Steuer- und Regelungstechnik", "Kalibrierung von Messgeräten", "Sensorik & Regelkreise"],
        body: "Techniker für Mess-, Steuer- und Regelungstechnik: Kalibrierung von Messgeräten, Sensorik und Regelkreise.",
      },
    ],
    note: "Der gesuchte Beruf ist nicht dabei? Fragen Sie uns\u00a0– unser Netzwerk deckt die meisten Industrieberufe ab.",
    open: "Details zum Beruf",
    skillsTitle: "Kenntnisse",
    vetting: "Jede Fachkraft absolviert vor dem Einsatz einen praktischen Eignungstest und eine Zertifikatsprüfung.",
    projectsTitle: "Passende Projekte",
    others: "Weitere Berufe",
    metaSuffix: "Arbeitnehmerüberlassung für die Industrie | KTechnology",
  },
  included: {
    label: "Alles inklusive",
    title: "Wir kümmern uns um alles rund um Ihr Team",
    lead: "Sie bekommen produktive Fachkräfte vor Ort. Recruiting, Formalitäten, Anreise und Betreuung übernehmen wir.",
    items: [
      "Suche & Auswahl",
      "Praktische Eignungstests",
      "Prüfung von Zertifikaten & Dokumenten",
      "Arbeitsverträge",
      "A1-Bescheinigungen & Arbeitserlaubnisse",
      "Versicherung",
      "Persönliche Schutzausrüstung",
      "Anreise & Unterkunft",
      "Eigener Projektkoordinator",
      "Schneller Ersatz",
    ],
  },
  sectors: {
    label: "Branchen",
    title: "Wo unsere Leute arbeiten",
    lead: "Branchen, in denen unsere Leute die Teams von Herstellern, Anlagenbauern und EPC-Unternehmen verstärken.",
    items: [
      { name: "Automobil & Zulieferer", tags: "Automatisierung · Programmierung · Robotik" },
      { name: "Metallverarbeitung & Schweißen", tags: "MIG/MAG · WIG · Stahlbau" },
      { name: "Energie & Kraftwerke", tags: "Revisionen · Rohrleitungen · Mechanik" },
      { name: "Schiffbau & Offshore", tags: "Rumpf · Ausrüstung · Rohrleitungsmontage" },
      { name: "Elektro & Automatisierung", tags: "Installation · SPS · Inbetriebnahme" },
      { name: "Logistik & Produktion", tags: "Maschinenbediener · Stapler · Lager" },
      { name: "Gewerbe- und Bürogebäude", tags: "Elektrotechnik · Betrieb & Wartung · MSR" },
    ],
  },
  process: {
    label: "Ablauf",
    title: "Von Ihrer Anfrage zum Team vor Ort in rund zwei Wochen",
    steps: [
      {
        period: "Tag 1",
        title: "Bedarfsanalyse",
        body: "Mit Ihrer Projektleitung legen wir Rollen, Qualifikationen, Anzahl, Schichtmodell und Bedingungen vor Ort fest.",
      },
      {
        period: "Tag 2–7",
        title: "Suche & Prüfung",
        body: "Kandidaten aus unserem Netzwerk durchlaufen praktische Tests sowie Dokumenten- und Zertifikatsprüfungen.",
      },
      {
        period: "Tag 7–14",
        title: "Verträge & Mobilisierung",
        body: "Verträge, A1 / Arbeitserlaubnisse, Versicherung, PSA, Anreise und Unterkunft organisieren wir.",
      },
      {
        period: "Im Projekt",
        title: "Betreuung & Support",
        body: "Ein Koordinator hält Kontakt zu Ihrer Projektleitung vor Ort, behält die Arbeitsqualität im Blick und sorgt bei Bedarf schnell für Ersatz.",
      },
    ],
  },
  why: {
    label: "Warum KTechnology",
    title: "Wir liefern Fachkräfte, nicht nur Lebensläufe",
    items: [
      { title: "Ein Partner für alles", body: "Recruiting, Formalitäten, Anreise, Unterkunft und Betreuung vor Ort aus einer Hand." },
      { title: "Vor dem Einsatz geprüft", body: "Jede Fachkraft besteht vorab einen Praxistest\u00a0– damit Ihr Zeitplan nicht unter bösen Überraschungen leidet." },
      { title: "Flexible Kapazität", body: "Für Revision oder Hochlauf aufstocken und nach Projektende wieder reduzieren." },
      { title: "Schneller Ersatz", body: "Wenn jemand Ihren Anforderungen nicht entspricht, ersetzen wir ihn zügig." },
    ],
  },
  reach: {
    label: "Einsatzgebiete",
    title: "Mit Sitz in der Slowakei\u00a0– im Einsatz in ganz Europa und Skandinavien",
    countries: [
      "Deutschland", "Österreich", "Schweden", "Norwegen", "Finnland", "Dänemark",
      "Niederlande", "Belgien", "Frankreich", "Polen", "Tschechien", "Slowakei", "VAE",
    ],
  },
  faq: {
    label: "FAQ",
    title: "Häufige Fragen",
    items: [
      {
        q: "Wie funktioniert die Arbeitnehmerüberlassung?",
        a: "Die Fachkräfte sind bei KTechnology angestellt und werden Ihnen für die Projektdauer überlassen. Vor Ort arbeiten sie nach Ihren Weisungen; wir kümmern uns um Verträge, Löhne, Versicherung und alle Formalitäten\u00a0– und Sie erhalten eine einzige Rechnung.",
      },
      {
        q: "Wie schnell können die Fachkräfte anfangen?",
        a: "In der Regel rund zwei Wochen nach Ihrer Anfrage: einige Tage für Suche und Eignungstests, danach Verträge, A1 und Anreise. Bei dringenden Revisionen nennen Sie uns Ihren Termin, und wir sagen Ihnen ehrlich, was möglich ist.",
      },
      {
        q: "In welchen Ländern sind Sie tätig?",
        a: "Wir sind in folgenden Ländern im Einsatz: Deutschland, Österreich, Schweden, Norwegen, Finnland, Dänemark, die Benelux-Länder, Frankreich, Polen, Tschechien, die Slowakei und die VAE. Weitere Länder auf Anfrage.",
      },
      {
        q: "Welche Formalitäten übernehmen Sie?",
        a: "Arbeitsverträge, A1-Bescheinigungen oder Arbeitserlaubnisse, Versicherung, Zertifikatsprüfung, PSA, Anreise und Unterkunft. Um all das müssen Sie sich nicht selbst kümmern.",
      },
      {
        q: "Was, wenn eine Fachkraft nicht unseren Erwartungen entspricht?",
        a: "Wenden Sie sich an Ihren Koordinator. Wir besprechen das Problem und ersetzen die Person bei Bedarf so schnell wie möglich.",
      },
      {
        q: "Wie werden die Kosten berechnet?",
        a: "Wir kalkulieren pro Fachkraft, abhängig von Beruf, Einsatzort, Dauer und Schichtmodell. Senden Sie uns Ihre Anfrage und Sie erhalten innerhalb eines Werktags ein Angebot.",
      },
    ],
  },
  contact: {
    label: "Kontakt",
    title: "Sagen Sie uns, wen Sie brauchen",
    body: "Senden Sie uns Ihre Anfrage, und ein Projektkoordinator meldet sich innerhalb eines Werktags mit Verfügbarkeit und Angebot.",
    emailLabel: "Oder direkt per E-\u2060Mail",
    tipsTitle: "Hilfreiche Angaben",
    tips: ["Einsatzort (Stadt) und Arbeitszeiten", "Erforderliche Zertifikate, z.\u00a0B. Schweißverfahren und Norm", "Arbeitssprache und notwendige Sicherheitsnachweise"],
    form: {
      company: "Unternehmen",
      name: "Ihr Name",
      email: "E-Mail",
      phone: "Telefon",
      country: "Einsatzland",
      positions: "Positionen (z.\u00a0B. 6×\u00a0WIG-Schweißer)",
      duration: "Dauer (z.\u00a0B. 6\u00a0Wochen)",
      shift: "Schichtmodell",
      shifts: {
        unsure: "Noch offen",
        single: "1 Schicht",
        double: "2 Schichten",
        triple: "3 Schichten",
        rotation: "12-h-Schichten",
      },
      required: "* Pflichtfelder",
      start: "Geplanter Start",
      message: "Projektdetails",
      submit: "Anfrage senden",
      sending: "Wird gesendet…",
      success: "Vielen Dank. Ein Projektkoordinator meldet sich innerhalb eines Werktags mit Verfügbarkeit und Angebot.",
      error: "Ihre Anfrage konnte nicht gesendet werden. Ihre Angaben stehen noch im Formular\u00a0– bitte senden Sie sie uns per E-\u2060Mail an:",
      invalid: "Bitte prüfen Sie die markierten Felder.",
      emailHint: "z.\u00a0B. name@firma.de",
      consent: "Ihre Angaben verwenden wir ausschließlich, um Ihre Anfrage zu beantworten und ein Angebot zu erstellen.",
    },
  },
  projects: {
    label: "Projekte",
    title: "Projekte und Referenzen",
    lead: "Ausgewählte Projekte, an denen unsere Schweißer, Monteure, Elektriker und Techniker mitgearbeitet haben.",
    empty: "Wir stellen gerade die Übersicht unserer abgeschlossenen Projekte zusammen. Schreiben Sie uns\u00a0– gern berichten wir Ihnen von Projekten in Ihrer Branche.",
    open: "Projektdetails",
    metaSuffix: "Projekt | KTechnology",
    facts: { country: "Land", sector: "Branche", year: "Jahr", team: "Fachkräfte", duration: "Dauer" },
    scopeTitle: "Leistungsumfang",
    tradesTitle: "Berufe im Projekt",
    stats: {
      label: "In Zahlen",
      title: "KTechnology in Zahlen",
      projects: "Abgeschlossene Projekte",
      countries: "Länder",
      workers: "Geprüfte Fachkräfte",
    },
  },
  about: {
    label: "Über uns",
    title: "Industriefachkräfte aus der Slowakei für Projekte in ganz Europa und Skandinavien",
    lead: "KTechnology s.r.o. ist ein slowakisches Unternehmen, das qualifizierte Industriefachkräfte an Hersteller, Anlagenbauer und EPC-Unternehmen überlässt.",
    body: [
      "Wir stellen Schweißer, Rohrschlosser, Stahlbauschlosser, Elektriker, Mechaniker, Techniker und Maschinenbediener\u00a0– von einer einzelnen Fachkraft bis zum kompletten Team, für die gesamte Projektdauer. Jede Fachkraft absolviert vor dem Einsatz einen praktischen Eignungstest und eine Zertifikatsprüfung.",
      "Wir kümmern uns um alles rund um das Team: Verträge, A1-Bescheinigungen und Genehmigungen, Versicherung, PSA, Anreise und Unterkunft. Während des Projekts haben Sie einen Koordinator als Ansprechpartner und erhalten eine einzige Rechnung.",
    ],
  },
  cta: {
    title: "Möchten Sie Ihr Team verstärken?",
    body: "Senden Sie uns Ihre Anfrage, und wir antworten innerhalb eines Werktags mit Verfügbarkeit und Angebot.",
    email: "Oder schreiben Sie uns per E-\u2060Mail",
  },
  pages: {
    services: {
      meta: {
        title: "Leistungen und Berufe – Arbeitnehmerüberlassung für die Industrie | KTechnology",
        description:
          "Arbeitnehmerüberlassung, Teams für Revisionen und Hochläufe, komplette Mobilisierung: Schweißer, Rohrschlosser, Elektriker, Mechaniker, Techniker und Maschinenbediener, vor dem Einsatz praxisgeprüft.",
      },
    },
    sectors: {
      meta: {
        title: "Branchen – KTechnology",
        description:
          "Wo unsere Leute arbeiten: Automobil, Metallverarbeitung, Energie, Schiffbau und Offshore, Elektro und Automatisierung, Logistik und Produktion, Gewerbe- und Bürogebäude.",
      },
    },
    projects: {
      meta: {
        title: "Projekte und Referenzen – KTechnology",
        description: "Projekte, an denen unsere Schweißer, Monteure, Elektriker und Techniker in ganz Europa und Skandinavien mitgearbeitet haben.",
      },
    },
    about: {
      meta: {
        title: "Über uns – KTechnology",
        description:
          "KTechnology s.r.o. ist ein slowakisches Unternehmen, das qualifizierte Industriefachkräfte an Hersteller, Anlagenbauer und EPC-Unternehmen in ganz Europa und Skandinavien überlässt.",
      },
    },
    contact: {
      meta: {
        title: "Kontakt – Fachkräfte anfragen | KTechnology",
        description: "Senden Sie uns Ihre Anfrage: Ein Projektkoordinator meldet sich innerhalb eines Werktags mit Verfügbarkeit und Angebot.",
      },
    },
  },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    home: "Zurück zur Startseite",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Arbeitnehmerüberlassung aus der Slowakei für Industrieprojekte in ganz Europa und Skandinavien.",
    pages: "Seiten",
    rights: "Alle Rechte vorbehalten.",
    top: "Nach oben",
  },
};

export default de;
