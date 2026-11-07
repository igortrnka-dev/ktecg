import type { Dictionary } from "..";

const en: Dictionary = {
  meta: {
    title: "KTechnology – technical capacity and industrial projects in Europe and Scandinavia",
    description:
      "KTechnology s.r.o. provides industrial subcontracting services: electrical engineering and automation, welding and pipework, mechanical installation and maintenance, technical supervision and quality control for projects in Europe and Scandinavia.",
  },
  nav: {
    home: "Home",
    services: "Services",
    sectors: "Industries",
    projects: "Projects",
    about: "About us",
    contact: "Contact",
    breadcrumb: "Breadcrumb",
    cta: "Project enquiry",
    language: "Language",
    menu: "Menu",
    mainNav: "Main navigation",
    skip: "Skip to content",
    ctaShort: "Enquire",
  },
  hero: {
    eyebrow: "Technical capacity and industrial projects | Europe and\u00a0Scandinavia",
    title: "Connecting specialists with\u00a0industry",
    subtitle: "Industrial subcontracting services for projects in Europe and Scandinavia.",
    lead:
      "KTechnology supports industrial companies, equipment suppliers and main contractors in delivering demanding projects in electrical engineering, automation, welding, pipework, mechanical installation and industrial maintenance.",
    primary: "Send a project enquiry",
    secondary: "Our services",
    features: [
      { title: "Expertise", body: "Electrical engineering, automation, welding, pipework, mechanical installation and maintenance." },
      { title: "Where we work", body: "European industrial projects with a focus on Germany, Austria, the Benelux and the Nordic countries." },
      { title: "Project flexibility", body: "Technical teams and scope of services tailored to the requirements, schedule and nature of each project." },
      { title: "Delivery support", body: "Project coordination, technical documentation, mobilisation planning and cross-border administration." },
    ],
  },
  services: {
    label: "Our services",
    title: "Technical services for industrial projects",
    lead: "Four service divisions for industrial projects: from electrical engineering and automation to technical supervision and quality control.",
    more: "All services",
    open: "Division details",
    division: "Division",
    activitiesTitle: "Our areas of expertise",
    sectorsTitle: "Industries we serve",
    projectsTitle: "Relevant projects",
    metaSuffix: "technical services | KTechnology",
    divisions: [
      {
        name: "Electrical engineering and automation",
        short: "Industrial electrical installations, cable containment, switchgear, I&C / E&I and automation technicians.",
        lead: "End-to-end electrical and technical installation services for industrial projects in Europe and Scandinavia.",
        activities: [
          "Industrial electrical installations",
          "Cable containment and cabling",
          "Switchgear and panel wiring",
          "I&C / E&I",
          "Industrial automation",
          "Commissioning support",
        ],
        sectors: ["Energy", "Automotive", "Chemicals", "Pharmaceuticals", "Food and beverage", "Data centres", "Industrial manufacturing"],
      },
      {
        name: "Welding and pipework",
        short: "TIG, MIG/MAG, pipework, prefabrication, isometric drawings and welder qualifications.",
        lead: "Welding and pipework for industrial projects in Europe and Scandinavia.",
        activities: [
          "TIG and MIG/MAG welding",
          "Pipework",
          "Pipe prefabrication",
          "Pipe installation from isometric drawings",
          "Welder qualifications",
        ],
        sectors: ["Energy", "Chemicals", "Pharmaceuticals", "Food and beverage", "Shipbuilding", "Industrial manufacturing"],
      },
      {
        name: "Mechanical installation and maintenance",
        short: "Industrial installation, mechanics, fitters, process equipment installation, shutdowns and servicing.",
        lead: "Mechanical installation, process equipment installation and maintenance for industrial projects in Europe and Scandinavia.",
        activities: [
          "Industrial installation",
          "Process equipment installation",
          "Mechanical and fitting work",
          "Shutdowns and planned maintenance",
          "Equipment servicing",
        ],
        sectors: ["Energy", "Chemicals", "Food and beverage", "Automotive", "Shipbuilding", "Industrial manufacturing"],
      },
      {
        name: "Technical supervision and quality control",
        short: "Technical project support, QA/QC, construction and installation supervision, NDT and project coordination.",
        lead: "Technical supervision, quality control and coordination of industrial projects in Europe and Scandinavia.",
        activities: [
          "Technical project support",
          "QA/QC",
          "Installation supervision",
          "Construction supervision",
          "NDT",
          "Project coordination",
        ],
        sectors: ["Energy", "Chemicals", "Pharmaceuticals", "Data centres", "Commercial buildings", "Industrial manufacturing"],
      },
    ],
  },
  included: {
    label: "Full service",
    title: "We handle everything around your team",
    lead: "You get productive people on site. Recruiting, paperwork, travel and support stay with us.",
    items: [
      "Sourcing & selection",
      "Practical skills tests",
      "Certificate & document checks",
      "Employment contracts",
      "A1 forms & work permits",
      "Insurance",
      "Personal protective equipment",
      "Travel & accommodation",
      "Dedicated project coordinator",
      "Fast replacement",
    ],
  },
  sectors: {
    label: "Industries",
    title: "Where we add value",
    lead: "Industries in which our teams support industrial projects.",
    more: "All industries",
    items: [
      "Energy",
      "Chemicals and petrochemicals",
      "Pharmaceuticals",
      "Food and beverage",
      "Automotive",
      "Shipbuilding",
      "Data centres",
      "Industrial manufacturing",
      "Commercial and office buildings",
    ],
  },
  projects: {
    label: "Projects and references",
    title: "Selected completed projects",
    lead: "Projects our electricians, welders, pipe fitters, installers and technicians have worked on.",
    empty: "We are still adding our completed projects to this overview. Get in touch and we will be happy to tell you about projects in your industry.",
    more: "All projects",
    open: "Project details",
    metaSuffix: "reference project | KTechnology",
    facts: { location: "Country", industry: "Industry", site: "Site", name: "Project", period: "Period", team: "Staff", status: "Status" },
    /** Roles of the companies on a project, shown once the owner approves the names. */
    parties: { client: "Client", endClient: "End client", partner: "Project partner", mainContractor: "Main contractor" } as Record<string, string>,
    status: { ongoing: "In progress", completed: "Completed" },
    /** Unit after the team size, by plural category of the language (Intl.PluralRules); "other" is the fallback. */
    people: { one: "specialist", other: "specialists" } as Record<string, string>,
    infoTitle: "Key facts",
    descriptionTitle: "Project description",
    scopeTitle: "Scope of work",
    galleryTitle: "Photos from the project",
    othersTitle: "More completed projects",
    back: "Back to all projects",
    /** Caption on the main photo while it is a stock photo, not one from the project. */
    illustrative: "Illustrative photo",
    stats: {
      label: "KTechnology in numbers",
      projects: "Completed projects",
      countries: "Countries",
      workers: "Verified specialists in our network",
    },
  },
  about: {
    label: "About us",
    title: "A reliable partner for industry in Europe and Scandinavia",
    body: [
      "We are a technically focused company that connects experienced specialists with industrial projects. We deliver technical work, project support and dependable capacity for demanding clients in Europe and Scandinavia.",
    ],
    more: "More about us",
  },
  process: {
    label: "How we work together",
    title: "From enquiry to delivery",
    steps: ["Project enquiry", "Technical assessment", "Proposal and agreement", "Project delivery", "Review and support"],
  },
  cta: {
    title: "Need extra capacity for your project?",
    body: "Get in touch and we will prepare a tailored solution for you.",
    button: "Send a project enquiry",
    /** Closing band of a division page and of a project page: the same button, a more specific question. */
    divisionTitle: "Planning a project?",
    projectTitle: "Have a similar project?",
    briefBody: "Send us your technical brief and we will propose how we can work together.",
  },
  faq: {
    label: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "How does staff leasing work?",
        a: "The workers are employed by KTechnology and leased to your company for the duration of the project. They work under your site management; we handle contracts, wages, insurance and all paperwork, and you receive one invoice.",
      },
      {
        q: "How quickly can workers start?",
        a: "Usually within about two weeks of your enquiry: a few days for selection and skills tests, then contracts, A1 forms and travel. For urgent shutdowns, tell us your date and we'll say honestly what is possible.",
      },
      {
        q: "Which countries do you work in?",
        a: "We deploy to Germany, Austria, Sweden, Norway, Finland, Denmark, the Benelux, France, Poland, Czechia, Slovakia and the UAE. Other countries on request.",
      },
      {
        q: "What paperwork do you take care of?",
        a: "Employment contracts, A1 forms or work permits, insurance, certificate checks, PPE, travel and accommodation. You don't need to arrange anything for the workers.",
      },
      {
        q: "What if a worker doesn't meet our expectations?",
        a: "Tell your project coordinator. We'll discuss the situation with you and, if needed, replace the person as quickly as possible.",
      },
      {
        q: "How is the service priced?",
        a: "We quote per worker, depending on the trade, location, length of assignment and shift pattern. Send us your enquiry and you'll get a quote within one business day.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Send us a project enquiry",
    body: "Send us your enquiry and a project coordinator will get back to you within one business day with worker availability and a quote.",
    emailLabel: "Or e-mail us directly",
    tipsTitle: "Helpful to include",
    tips: ["Site location (city) and working hours", "Required certificates, e.g.\u00a0welding process and standard", "Working language and required safety training or site passes"],
    form: {
      company: "Company",
      name: "Your name",
      email: "E-mail",
      phone: "Phone",
      country: "Project country",
      positions: "Positions needed (e.g.\u00a06×\u00a0TIG\u00a0welder)",
      duration: "Duration (e.g.\u00a06\u00a0weeks)",
      shift: "Shift pattern",
      shifts: {
        unsure: "Not sure yet",
        single: "1 shift",
        double: "2 shifts",
        triple: "3 shifts",
        rotation: "12\u00a0h shifts",
      },
      required: "* Required fields",
      start: "Expected start",
      message: "Project details",
      submit: "Send enquiry",
      sending: "Sending…",
      success: "Thank you. A project coordinator will get back to you within one business day with worker availability and a quote.",
      error: "Your enquiry could not be sent. Your entries are still in the form\u00a0– please e-\u2060mail them to us at:",
      invalid: "Please check the highlighted fields.",
      emailHint: "e.g. name@company.com",
      consent: "We process your personal data only to handle this enquiry and prepare a quote.",
    },
  },
  pages: {
    services: {
      meta: {
        title: "Services – technical services for industrial projects | KTechnology",
        description:
          "Four service divisions: electrical engineering and automation, welding and pipework, mechanical installation and maintenance, technical supervision and quality control.",
      },
    },
    sectors: {
      meta: {
        title: "Industries – KTechnology",
        description:
          "Energy, chemicals and petrochemicals, pharmaceuticals, food and beverage, automotive, shipbuilding, data centres, industrial manufacturing and commercial buildings.",
      },
    },
    projects: {
      meta: {
        title: "Projects and references – KTechnology",
        description: "Selected industrial projects KTechnology specialists have worked on in Europe and Scandinavia.",
      },
    },
    about: {
      meta: {
        title: "About us – KTechnology",
        description:
          "A technically focused company connecting experienced specialists with industrial projects in Europe and Scandinavia.",
      },
    },
    contact: {
      meta: {
        title: "Contact – project enquiry | KTechnology",
        description: "Send us a project enquiry or technical brief. We will get back to you within one business day.",
      },
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    home: "Back to the homepage",
  },
  footer: {
    company: "KTechnology s.r.o.",
    tagline: "Technical capacity and delivery of industrial projects in Europe and Scandinavia.",
    links: "Quick links",
    contact: "Contact",
    rights: "All rights reserved.",
    top: "Back to top",
  },
};

export default en;
