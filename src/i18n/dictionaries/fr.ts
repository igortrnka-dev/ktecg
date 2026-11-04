import type { Dictionary } from "..";

const fr: Dictionary = {
  meta: {
    title: "KTechnology — Mise à disposition de soudeurs, tuyauteurs et électriciens",
    description:
      "KTechnology s.r.o. met à disposition des soudeurs, tuyauteurs, électriciens, mécaniciens et opérateurs aux compétences testées pour des projets industriels en Europe et en Scandinavie. Formulaires A1, transport et hébergement pris en charge, équipe sur site en 14 jours environ.",
  },
  nav: {
    home: "Accueil",
    services: "Services",
    sectors: "Secteurs",
    projects: "Projets",
    about: "À propos",
    contact: "Contact",
    breadcrumb: "Fil d’Ariane",
    cta: "Faire une demande",
    language: "Langue",
    menu: "Menu",
    mainNav: "Navigation principale",
    skip: "Aller au contenu",
    ctaShort: "Devis",
  },
  hero: {
    eyebrow: "Mise à disposition de personnel industriel\u00a0· Europe et Scandinavie",
    title: "Soudeurs, tuyauteurs et électriciens qualifiés sur votre site en 14\u00a0jours environ",
    lead:
      "Nous mettons des ouvriers et techniciens testés à la disposition d’industriels, d’entreprises de travaux et de sociétés EPC dans toute l’Europe, et prenons en charge contrats, formulaires A1 ou permis de travail, assurance, transport et hébergement. Un seul interlocuteur, une seule facture.",
    primary: "Demander du personnel",
    secondary: "Voir nos métiers",
    facts: [
      { k: "Métiers", v: "Soudeurs, monteurs, électriciens, mécaniciens, opérateurs" },
      { k: "Où", v: "Allemagne, Autriche, pays nordiques, Benelux, France, PL/CZ/SK, EAU" },
      { k: "Délai", v: "Devis sous 1\u00a0jour ouvré, équipe sur site en 14\u00a0jours environ" },
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
        { k: "Projet", v: "Arrêt technique" },
        { k: "Début", v: "sous ~14\u00a0jours" },
      ],
      status: "Équipe en préparation",
    },
  },
  services: {
    label: "Services",
    title: "Ce que nous proposons",
    lead: "Mise à disposition de personnel industriel : d’un seul spécialiste à une équipe complète, pour la durée de votre projet.",
    more: "Tous les services et métiers",
    items: [
      {
        title: "Mise à disposition de personnel",
        body: "Des professionnels qualifiés mis à votre disposition pour la durée de la mission. Ils travaillent sous l’autorité de votre encadrement ; nous restons leur employeur.",
        points: ["Spécialistes individuels ou équipes complètes", "Missions courtes ou longues", "Aucun recrutement ni gestion RH de votre côté"],
      },
      {
        title: "Arrêts techniques & montées en cadence",
        body: "Des renforts pour vos arrêts techniques, montées en cadence et pics de charge. Augmentez vite vos effectifs, réduisez-les une fois le travail terminé.",
        points: ["Mobilisation en deux semaines environ", "Rythme de travail défini avec votre site", "Aucun coût fixe après le projet"],
      },
      {
        title: "Mobilisation clé en main",
        body: "De « il nous faut du monde » à « ils sont productifs sur site », nous prenons tout en charge : recrutement, formalités, transport, hébergement et suivi.",
        points: ["Contrats, formulaires A1 et permis de travail", "Transport, hébergement et EPI", "Un coordinateur pour tout le projet"],
      },
    ],
  },
  trades: {
    label: "Métiers",
    title: "Les profils que nous mettons à disposition",
    lead: "Des professionnels expérimentés. Chacun passe un test pratique et une vérification des certificats avant sa mission.",
    items: [
      {
        name: "Soudeurs",
        skills: ["MIG/MAG", "TIG", "Électrode enrobée", "Acier & inox"],
        body: "Des soudeurs expérimentés en soudage MIG/MAG, TIG et à l’électrode enrobée, sur acier au carbone et inox.",
      },
      {
        name: "Tuyauteurs",
        skills: ["Tuyauterie industrielle", "Isométriques", "Préfabrication", "Montage"],
        body: "Des tuyauteurs qui préfabriquent et montent la tuyauterie industrielle d’après les isométriques.",
      },
      {
        name: "Monteurs en charpente métallique",
        skills: ["Structures métalliques", "Plans techniques", "Montage", "Boulonnage"],
        body: "Des monteurs qui fabriquent et assemblent des structures métalliques d’après les plans techniques, assemblages boulonnés compris.",
      },
      {
        name: "Électriciens industriels",
        skills: ["Installation", "Câblage & chemins de câbles", "Armoires électriques"],
        body: "Des électriciens pour les installations industrielles : tirage de câbles, pose de chemins de câbles et câblage d’armoires électriques.",
      },
      {
        name: "Techniciens automatisme",
        skills: ["Automates (PLC)", "Mise en service", "Dépannage"],
        body: "Des techniciens pour la programmation d’automates (PLC), la mise en service des équipements et le dépannage.",
      },
      {
        name: "Mécaniciens & monteurs industriels",
        skills: ["Installation de machines", "Alignement", "Maintenance d’arrêt"],
        body: "Des mécaniciens qui installent et alignent les machines et assurent la maintenance pendant les arrêts techniques.",
      },
      {
        name: "Opérateurs CNC & machines",
        skills: ["Tournage & fraisage", "Réglage machine", "Métrologie"],
        body: "Des opérateurs pour le tournage et le fraisage, le réglage des machines et le contrôle dimensionnel des pièces.",
      },
      {
        name: "Opérateurs de montage",
        skills: ["Montage sur ligne", "Contrôle qualité", "Travail posté"],
        body: "Des opérateurs pour le montage sur ligne et le contrôle qualité, habitués au travail posté.",
      },
      {
        name: "Techniciens instrumentation & régulation",
        skills: ["Mesure & régulation", "Étalonnage des instruments", "Capteurs & boucles de régulation"],
        body: "Des techniciens en mesure et régulation : étalonnage des instruments, capteurs et boucles de régulation.",
      },
    ],
    note: "Besoin d’un autre profil ? Contactez-nous : notre réseau couvre la plupart des métiers industriels.",
    open: "Détails du métier",
    skillsTitle: "Compétences",
    vetting: "Chaque intervenant passe un test pratique et une vérification des certificats avant sa mission.",
    projectsTitle: "Projets associés",
    others: "Autres métiers",
    metaSuffix: "mise à disposition de personnel industriel | KTechnology",
  },
  included: {
    label: "Tout inclus",
    title: "Nous gérons tout ce qui entoure votre équipe",
    lead: "Vous disposez sur site d’un personnel opérationnel. Recrutement, formalités, transport et suivi restent à notre charge.",
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
    lead: "Les secteurs dans lesquels nos équipes renforcent celles des industriels, des entreprises de travaux et des sociétés EPC.",
    items: [
      { name: "Automobile & équipementiers", tags: "Automatisation · Programmation · Robotique" },
      { name: "Métallurgie & soudage", tags: "MIG/MAG · TIG · Charpente métallique" },
      { name: "Énergie & centrales", tags: "Arrêts · Tuyauterie · Mécanique" },
      { name: "Construction navale & offshore", tags: "Coque · Armement · Tuyauterie" },
      { name: "Électricité & automatisme", tags: "Installation · PLC · Mise en service" },
      { name: "Logistique & production", tags: "Opérateurs · Caristes · Entrepôt" },
      { name: "Bâtiments tertiaires & de bureaux", tags: "Électricité · Lots techniques · Mesure & régulation" },
    ],
  },
  process: {
    label: "Fonctionnement",
    title: "De votre demande à une équipe sur site en deux semaines environ",
    steps: [
      {
        period: "Jour 1",
        title: "Analyse des besoins",
        body: "Avec votre chef de projet, nous définissons postes, qualifications, effectifs, rythme de travail et conditions du site.",
      },
      {
        period: "Jours 2–7",
        title: "Recrutement & vérification",
        body: "Les candidats de notre réseau passent des tests pratiques ainsi que des contrôles de documents et de certificats.",
      },
      {
        period: "Jours 7–14",
        title: "Formalités & mobilisation",
        body: "Contrats, A1 / permis de travail, assurance, EPI, transport et hébergement : nous organisons tout.",
      },
      {
        period: "Pendant le projet",
        title: "Suivi & assistance",
        body: "Un coordinateur reste en contact avec votre site, suit la qualité du travail et remplace rapidement un intervenant si nécessaire.",
      },
    ],
  },
  why: {
    label: "Pourquoi KTechnology",
    title: "Un partenaire de terrain, pas un simple fournisseur de CV",
    items: [
      { title: "Un seul partenaire", body: "Recrutement, formalités, transport, hébergement et assistance sur site, le tout via un interlocuteur unique." },
      { title: "Testés avant la mission", body: "Chaque spécialiste réussit un test pratique, pour éviter les mauvaises surprises sur votre planning." },
      { title: "Capacité flexible", body: "Renforcez vos équipes pour un arrêt ou une montée en cadence, réduisez-les à la fin du projet." },
      { title: "Remplacement rapide", body: "Si quelqu’un ne répond pas à vos exigences, nous le remplaçons rapidement." },
    ],
  },
  reach: {
    label: "Zones d’intervention",
    title: "Basés en Slovaquie, présents sur des sites industriels en Europe et en Scandinavie",
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
        q: "Comment fonctionne la mise à disposition de personnel ?",
        a: "Le personnel est salarié de KTechnology et mis à votre disposition pour la durée de la mission. Il travaille sous l’autorité de votre encadrement ; nous gérons contrats, salaires, assurance et formalités, et vous recevez une seule facture.",
      },
      {
        q: "Dans quel délai le personnel peut-il commencer ?",
        a: "Comptez en général deux semaines environ après votre demande : quelques jours pour la sélection et les tests, puis les contrats, les formulaires A1 et le transport. Pour un arrêt urgent, indiquez-nous votre date : nous vous dirons en toute transparence ce qui est faisable.",
      },
      {
        q: "Où intervenez-vous ?",
        a: "Nous intervenons en Allemagne, en Autriche, en Suède, en Norvège, en Finlande, au Danemark, au Benelux, en France, en Pologne, en Tchéquie, en Slovaquie et aux Émirats arabes unis. Autres pays sur demande.",
      },
      {
        q: "Quelles formalités prenez-vous en charge ?",
        a: "Contrats de travail, formulaires A1 ou permis de travail, assurance, vérification des certificats, EPI, transport et hébergement. Vous n’avez pas à vous en occuper.",
      },
      {
        q: "Et si un intervenant ne répond pas à nos attentes ?",
        a: "Signalez-le à votre coordinateur. Nous examinons le problème et, si nécessaire, remplaçons la personne le plus vite possible.",
      },
      {
        q: "Comment le service est-il facturé ?",
        a: "Nous établissons un prix par intervenant selon le métier, le lieu, la durée et le rythme de travail. Envoyez-nous votre demande et vous recevrez un devis sous un jour ouvré.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Dites-nous de qui vous avez besoin",
    body: "Envoyez-nous votre demande : un coordinateur de projet vous répond sous un jour ouvré avec les disponibilités et un devis.",
    emailLabel: "Ou écrivez-nous directement",
    tipsTitle: "Utile à préciser",
    tips: ["Lieu d’intervention (ville) et horaires de travail", "Certificats requis, ex.\u00a0procédé et norme de soudage", "Langue de travail et habilitations sécurité exigées sur site"],
    form: {
      company: "Entreprise",
      name: "Votre nom",
      email: "E-mail",
      phone: "Téléphone",
      country: "Pays du projet",
      positions: "Postes recherchés (ex.\u00a06×\u00a0soudeur\u00a0TIG)",
      duration: "Durée (ex.\u00a06\u00a0semaines)",
      shift: "Rythme de travail",
      shifts: {
        unsure: "À définir",
        single: "1 équipe",
        double: "2 équipes",
        triple: "3 équipes",
        rotation: "Équipes de 12\u202fh",
      },
      required: "* Champs obligatoires",
      start: "Début prévu",
      message: "Détails du projet",
      submit: "Envoyer la demande",
      sending: "Envoi…",
      success: "Merci. Un coordinateur de projet vous répondra sous un jour ouvré avec les disponibilités et un devis.",
      error: "Votre demande n’a pas pu être envoyée. Les informations saisies sont toujours dans le formulaire\u202f; merci de nous les envoyer par e-\u2060mail\u00a0:",
      invalid: "Veuillez vérifier les champs signalés.",
      emailHint: "ex. nom@entreprise.fr",
      consent: "Nous utilisons vos données uniquement pour répondre à cette demande et établir un devis.",
    },
  },
  projects: {
    label: "Projets",
    title: "Projets et références",
    lead: "Une sélection de projets sur lesquels ont travaillé nos soudeurs, monteurs, électriciens et techniciens.",
    empty: "Nous préparons actuellement la présentation de nos projets réalisés. Écrivez-nous : nous vous parlerons volontiers de projets dans votre secteur.",
    open: "Détails du projet",
    metaSuffix: "projet | KTechnology",
    facts: { country: "Pays", sector: "Secteur", year: "Année", team: "Intervenants", duration: "Durée" },
    scopeTitle: "Périmètre des travaux",
    tradesTitle: "Métiers mobilisés",
    stats: {
      label: "En chiffres",
      title: "KTechnology en chiffres",
      projects: "Projets réalisés",
      countries: "Pays",
      workers: "Intervenants vérifiés",
    },
  },
  about: {
    label: "À propos",
    title: "Des professionnels de l’industrie venus de Slovaquie pour vos projets en Europe et en Scandinavie",
    lead: "KTechnology s.r.o. est une entreprise slovaque spécialisée dans la mise à disposition d’ouvriers et de techniciens qualifiés auprès d’industriels, d’entreprises de travaux et de sociétés EPC.",
    body: [
      "Nous mettons à disposition des soudeurs, tuyauteurs, monteurs en charpente métallique, électriciens, mécaniciens, techniciens et opérateurs, d’un seul spécialiste à une équipe complète, pour toute la durée de votre projet. Chaque intervenant passe un test pratique et une vérification des certificats avant sa mission.",
      "Nous prenons en charge tout ce qui entoure l’équipe : contrats, formulaires A1 et permis de travail, assurance, EPI, transport et hébergement. Pendant le projet, vous avez un seul coordinateur et recevez une seule facture.",
    ],
  },
  cta: {
    title: "Besoin de renforcer votre équipe ?",
    body: "Envoyez-nous votre demande : sous un jour ouvré, nous vous répondons avec les disponibilités et un devis.",
    email: "Ou écrivez-nous",
  },
  pages: {
    services: {
      meta: {
        title: "Services et métiers – Mise à disposition de personnel industriel | KTechnology",
        description:
          "Mise à disposition de personnel, renforts pour arrêts techniques et montées en cadence, mobilisation clé en main : soudeurs, tuyauteurs, électriciens, mécaniciens, techniciens et opérateurs, testés avant leur mission.",
      },
    },
    sectors: {
      meta: {
        title: "Secteurs – KTechnology",
        description:
          "Où travaillent nos équipes : automobile, métallurgie, énergie, construction navale et offshore, électricité et automatisme, logistique et production, bâtiments tertiaires et de bureaux.",
      },
    },
    projects: {
      meta: {
        title: "Projets et références – KTechnology",
        description: "Les projets sur lesquels ont travaillé nos soudeurs, monteurs, électriciens et techniciens en Europe et en Scandinavie.",
      },
    },
    about: {
      meta: {
        title: "À propos – KTechnology",
        description:
          "KTechnology s.r.o., entreprise slovaque, met des ouvriers et techniciens qualifiés à la disposition d’industriels, d’entreprises de travaux et de sociétés EPC en Europe et en Scandinavie.",
      },
    },
    contact: {
      meta: {
        title: "Contact – Faire une demande | KTechnology",
        description: "Envoyez-nous votre demande : un coordinateur de projet vous répond sous un jour ouvré avec les disponibilités et un devis.",
      },
    },
  },
  notFound: {
    title: "Page introuvable",
    body: "La page que vous recherchez n’existe pas ou a été déplacée.",
    home: "Retour à l’accueil",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Mise à disposition de personnel industriel depuis la Slovaquie, pour des projets en Europe et en Scandinavie.",
    pages: "Pages",
    rights: "Tous droits réservés.",
    top: "Haut de page",
  },
};

export default fr;
