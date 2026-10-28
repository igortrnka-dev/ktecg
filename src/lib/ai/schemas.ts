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
