import type { Dictionary } from "..";

const fr: Dictionary = {
  meta: {
    title: "KTechnology — Mise à disposition de personnel industriel : soudeurs, monteurs, électriciens",
    description:
      "KTechnology s.r.o. met à disposition des soudeurs, tuyauteurs, électriciens, mécaniciens et opérateurs certifiés pour des projets industriels en Europe et dans le monde. Compétences testées, A1, transport et hébergement gérés, équipe sur site en 14 jours environ.",
  },
  nav: {
    services: "Services",
    trades: "Métiers",
    sectors: "Secteurs",
    process: "Fonctionnement",
    faq: "FAQ",
    contact: "Contact",
    cta: "Demander du personnel",
    language: "Langue",
    menu: "Menu",
    mainNav: "Main navigation",
    skip: "Skip to content",
    ctaShort: "Get a quote",
  },
  hero: {
    eyebrow: "Mise à disposition de personnel industriel · Europe & monde",
    title: "Des professionnels de l'industrie pour votre chantier, opérationnels dès le premier jour",
    lead:
      "KTechnology met à disposition des soudeurs, tuyauteurs, électriciens, mécaniciens et opérateurs certifiés auprès d'industriels, d'entreprises de travaux et de sociétés EPC. Nous recrutons, testons, embauchons, assurons et acheminons le personnel jusqu'à votre site.",
    primary: "Demander du personnel",
    secondary: "Voir nos métiers",
    facts: [
      { k: "Métiers", v: "Soudeurs, monteurs, électriciens, mécaniciens, opérateurs" },
      { k: "Où", v: "Partout en Europe et dans le monde" },
      { k: "Délai", v: "Équipe sur site en 14 jours environ" },
      { k: "Inclus", v: "A1 & permis, transport, hébergement, coordinateur" },
    ],
    card: {
      label: "Exemple de demande",
      rows: [
        { role: "Soudeur TIG", count: "6×" },
        { role: "Tuyauteur", count: "4×" },
        { role: "Électricien industriel", count: "2×" },
        { role: "Coordinateur de projet", count: "inclus" },
      ],
      meta: [
        { k: "Projet", v: "Arrêt de site" },
        { k: "Début", v: "sous ~14 jours" },
      ],
      status: "Équipe en préparation",
    },
  },
  services: {
    label: "Services",
    title: "Ce que nous proposons",
    lead: "Mise à disposition de personnel industriel : d'un seul spécialiste à une équipe complète, pour toute la durée de votre projet.",
    items: [
      {
        title: "Mise à disposition de personnel",
        body: "Des professionnels qualifiés mis à votre disposition pendant toute la durée du chantier. Ils travaillent sous la direction de votre site ; nous restons leur employeur.",
        points: ["Spécialistes individuels ou équipes complètes", "Missions courtes ou longues", "Aucun recrutement ni gestion RH de votre côté"],
      },
      {
        title: "Arrêts techniques & montées en cadence",
        body: "Des renforts pour les arrêts de site, les montées en cadence et les pics de projet. Augmentez vite vos effectifs, réduisez-les une fois le travail terminé.",
        points: ["Mobilisation en deux semaines environ", "Organisation des postes convenue avec le site", "Aucun coût fixe après le projet"],
      },
      {
        title: "Mobilisation clé en main",
        body: "Tout ce qui sépare « il nous faut du monde » de « ils sont productifs sur site » est pris en charge : recrutement, formalités, transport, hébergement et suivi.",
        points: ["Contrats, formulaires A1 et permis", "Transport, hébergement et EPI", "Un coordinateur pour tout le projet"],
      },
    ],
  },
  trades: {
    label: "Métiers",
    title: "Qui nous mettons à disposition",
    lead: "Des professionnels expérimentés. Chacun passe un test pratique et une vérification des certificats avant sa mission.",
    items: [
      { name: "Soudeurs", skills: ["MIG/MAG", "TIG", "Électrode enrobée", "Acier & inox"] },
      { name: "Tuyauteurs", skills: ["Tuyauterie industrielle", "Isométriques", "Préfabrication", "Montage"] },
      { name: "Charpentiers métalliques & serruriers", skills: ["Charpente métallique", "Plans techniques", "Montage", "Boulonnage"] },
      { name: "Électriciens industriels", skills: ["Installation", "Câblage & chemins de câbles", "Armoires électriques"] },
      { name: "Techniciens automatisme", skills: ["Automates (PLC)", "Mise en service", "Dépannage"] },
      { name: "Mécaniciens & monteurs industriels", skills: ["Installation de machines", "Alignement", "Maintenance d'arrêt"] },
      { name: "Opérateurs CNC & machines", skills: ["Tournage & fraisage", "Réglage machine", "Métrologie"] },
      { name: "Opérateurs de montage", skills: ["Montage sur ligne", "Contrôle qualité", "Travail posté"] },
      { name: "Opérateurs logistiques", skills: ["Cariste", "Entrepôt & préparation", "Approvisionnement des lignes"] },
    ],
    note: "Vous cherchez un autre métier ? Demandez-nous, notre réseau couvre la plupart des métiers industriels.",
  },
  included: {
    label: "Tout inclus",
    title: "Nous gérons tout autour de votre équipe",
    lead: "Vous recevez du personnel productif sur site. Recrutement, formalités, transport et suivi restent à notre charge.",
    items: [
      "Recherche & sélection",
      "Tests pratiques de compétences",
      "Vérification des certificats & documents",
      "Contrats de travail",
      "Formulaires A1 & permis de travail",
      "Assurance",
      "Équipements de protection individuelle",
      "Transport & hébergement",
      "Coordinateur de projet dédié",
      "Remplacement rapide",
    ],
  },
  sectors: {
    label: "Secteurs",
    title: "Où travaillent nos équipes",
    items: [
      { name: "Automobile & équipementiers", tags: "Montage · Tôlerie · Qualité" },
      { name: "Métallurgie & soudage", tags: "MIG/MAG · TIG · Charpente métallique" },
      { name: "Énergie & centrales", tags: "Arrêts · Tuyauterie · Mécanique" },
      { name: "Construction navale & offshore", tags: "Coque · Armement · Tuyauterie" },
      { name: "Électricité & automatisme", tags: "Installation · PLC · Mise en service" },
      { name: "Logistique & production", tags: "Opérateurs · Cariste · Entrepôt" },
    ],
  },
  process: {
    label: "Fonctionnement",
    title: "De votre demande à une équipe sur site en deux semaines environ",
    steps: [
      {
        period: "Jour 1",
        title: "Analyse des besoins",
        body: "Avec votre chef de projet, nous définissons postes, qualifications, effectifs, organisation des équipes et conditions du site.",
      },
      {
        period: "Jour 2–7",
        title: "Recrutement & vérification",
        body: "Les candidats de notre réseau passent des tests pratiques ainsi que des contrôles de documents et de certificats.",
      },
      {
        period: "Jour 7–14",
        title: "Formalités & mobilisation",
        body: "Contrats, A1 / permis de travail, assurance, EPI, transport et hébergement : nous organisons tout.",
      },
      {
        period: "Pendant le projet",
        title: "Suivi & assistance",
        body: "Un coordinateur reste en contact avec votre site, suit les performances et remplace rapidement le personnel si nécessaire.",
      },
    ],
  },
  why: {
    label: "Pourquoi KTechnology",
    title: "Un partenaire main-d'œuvre, pas un simple fournisseur de CV",
    items: [
      { title: "Un seul partenaire", body: "Recrutement, formalités, transport, hébergement et assistance sur site par un interlocuteur unique." },
      { title: "Testés avant la mission", body: "Chaque spécialiste réussit un test pratique, pour que votre planning ne paie pas les surprises." },
      { title: "Capacité flexible", body: "Renforcez vos équipes pour un arrêt ou une montée en cadence, réduisez-les à la fin du projet." },
      { title: "Remplacement rapide", body: "Si quelqu'un ne répond pas à vos exigences, nous le remplaçons rapidement." },
    ],
  },
  reach: {
    label: "Zones d'intervention",
    title: "Basés en Slovaquie, présents sur des chantiers dans toute l'Europe et au-delà",
    countries: [
      "Allemagne", "Autriche", "Suède", "Norvège", "Finlande", "Danemark",
      "Pays-Bas", "Belgique", "France", "Pologne", "Tchéquie", "Slovaquie", "Émirats arabes unis",
    ],
  },
  faq: {
    label: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Comment fonctionne la mise à disposition de personnel ?",
        a: "Le personnel est salarié de KTechnology et mis à votre disposition pendant la durée du projet. Il travaille sous la direction de votre site ; nous gérons contrats, salaires, assurance et formalités, et vous recevez une seule facture.",
      },
      {
        q: "Dans quel délai le personnel peut-il commencer ?",
        a: "En général environ deux semaines après votre demande : quelques jours pour la sélection et les tests, puis contrats, formulaires A1 et transport. Pour un arrêt urgent, donnez-nous votre date et nous vous dirons honnêtement ce qui est possible.",
      },
      {
        q: "Dans quels pays intervenez-vous ?",
        a: "Nous intervenons partout en Europe et dans le monde, notamment en Allemagne, en Autriche, dans les pays nordiques, au Benelux, en France, en Pologne et au Moyen-Orient.",
      },
      {
        q: "Quelles formalités prenez-vous en charge ?",
        a: "Contrats de travail, formulaires A1 ou permis de travail, assurance, vérification des certificats, EPI, transport et hébergement. Vous n'avez rien à organiser pour le personnel.",
      },
      {
        q: "Et si un intervenant ne répond pas à nos attentes ?",
        a: "Signalez-le à votre coordinateur. Nous examinons le problème et, si nécessaire, remplaçons la personne le plus vite possible.",
      },
      {
        q: "Comment le service est-il facturé ?",
        a: "Nous établissons un prix par intervenant selon le métier, le lieu, la durée et l'organisation des postes. Envoyez-nous votre demande et vous recevrez un devis sous un jour ouvré.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Dites-nous de qui vous avez besoin",
    body: "Envoyez-nous votre demande : un coordinateur de projet vous répond sous un jour ouvré avec les disponibilités et un devis.",
    emailLabel: "Ou écrivez-nous directement",
    tipsTitle: "Utile à préciser",
    tips: ["Métiers et effectifs", "Lieu du projet et date de début", "Durée prévue et organisation des postes"],
    form: {
      company: "Entreprise",
      name: "Votre nom",
      email: "E-mail",
      phone: "Téléphone",
      country: "Pays du projet",
      positions: "Postes recherchés (ex. 6× soudeur TIG)",
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
      start: "Début prévu",
      message: "Détails du projet",
      submit: "Envoyer la demande",
      sending: "Envoi…",
      success: "Merci. Nous avons bien reçu votre demande et vous recontacterons rapidement.",
      error: "Une erreur s'est produite. Merci de nous écrire directement par e-mail.",
      consent: "En envoyant ce formulaire, vous acceptez que vos données soient traitées pour répondre à votre demande.",
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    home: "Back to the homepage",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Mise à disposition de personnel industriel depuis la Slovaquie, pour des projets en Europe et dans le monde.",
    rights: "Tous droits réservés.",
    top: "Haut de page",
  },
};

export default fr;
