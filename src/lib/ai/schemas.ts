import * as z from "zod/v4";

export const Signal = z.object({
  type: z.string().describe("e.g. job_ads, expansion, project_win, outage, labour_shortage, tender"),
  detail: z.string(),
  url: z.string().describe("Source URL, or empty string if unknown"),
});

export const Contact = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string().describe("Only if published publicly, else empty string"),
  phone: z.string().describe("Only if published publicly, else empty string"),
  linkedin: z.string().describe("Profile URL if found, else empty string"),
});

export const Qualification = z.object({
  score: z.number().int().min(0).max(100).describe("Fit and timing for KTechnology staff leasing, 0-100"),
  tier: z.enum(["A", "B", "C"]).describe("A = contact this week, B = nurture, C = weak fit"),
  qualification: z.string().describe("3-6 sentences: why they fit or not, what they likely need, risks"),
  recommended_roles: z.array(z.string()).describe("Trades/roles we should offer them"),
  outreach_language: z.string().describe("ISO 639-1 code of the language the outreach is written in"),
  outreach_subject: z.string(),
  outreach_body: z.string().describe("Short personalised first e-mail, plain text, signed by the KTechnology team"),
});

export const ProspectLead = z.object({
  company_name: z.string(),
  website: z.string(),
  country: z.string(),
  city: z.string(),
  industry: z.string(),
  company_size: z.string().describe("Employee range if known, else empty string"),
  description: z.string().describe("One or two sentences about what the company does"),
  signals: z.array(Signal),
  contacts: z.array(Contact),
  ...Qualification.shape,
});

export const ProspectBatch = z.object({ leads: z.array(ProspectLead) });

export const Enrichment = z.object({
  company_size: z.string(),
  description: z.string(),
  signals: z.array(Signal),
  contacts: z.array(Contact),
  ...Qualification.shape,
});

export const Outreach = z.object({
  outreach_language: z.string(),
  outreach_subject: z.string(),
  outreach_body: z.string(),
});

// A function, so each field is its own schema and the JSON schema has no $ref.
const url = () => z.string().describe("Source URL, or empty string if unknown");

export const OPPORTUNITY = ["vysoká", "stredná", "nízka"] as const;

/** A market analysis; every text in Slovak, company names and source titles as they are. */
export const MarketReport = z.object({
  summary: z.string().describe("4-6 sentences: the market for these trades in a nutshell, for KTechnology"),
  opportunity: z.enum(OPPORTUNITY).describe("How good the market is for KTechnology right now"),
  opportunity_reason: z.string().describe("1-3 sentences why"),
  demand_signals: z.array(z.object({ title: z.string(), detail: z.string(), url: url() })),
  regions: z.array(z.object({ name: z.string(), detail: z.string() })),
  industries: z.array(z.object({ name: z.string(), detail: z.string() })),
  companies: z
    .array(
      z.object({
        name: z.string(),
        website: z.string(),
        city: z.string(),
        industry: z.string(),
        signal: z.string().describe("The concrete hiring or project signal"),
        url: url(),
      }),
    )
    .describe("Up to about 15 real companies with a concrete hiring or project signal, only from the notes"),
  competitors: z.array(z.object({ name: z.string(), website: z.string(), detail: z.string() })),
  wages: z.array(
    z.object({
      role: z.string(),
      range: z.string().describe("e.g. 16–21 € / h hrubá mzda (03/2026); mark estimates as odhad"),
      detail: z.string(),
      url: url(),
    }),
  ),
  regulations: z.array(z.object({ title: z.string(), detail: z.string(), url: url() })),
  seasonality: z.string(),
  recommendations: z.array(z.string()).describe("Concrete next steps for KTechnology"),
  suggested_campaign: z.object({
    name: z.string().describe("Slovak campaign name"),
    countries: z.array(z.string()).describe("English country names, e.g. Germany"),
    industries: z.array(z.string()).describe("Short English search terms, e.g. automotive suppliers"),
    roles: z.array(z.string()).describe("Short English role names, e.g. MIG/MAG welder"),
  }),
  sources: z.array(z.object({ title: z.string(), url: url() })),
});

export type MarketReportData = z.infer<typeof MarketReport>;
