import { plural } from "../plural";

/** Slovak texts of the prospecting run log and lead history, shared by the real run, the demo run and the seed. */
export const runLog = {
  researching: (campaign: string) => `Hľadám firmy pre kampaň ${campaign}`,
  researched: (searches: number) =>
    `Prieskum na webe hotový (${searches} ${plural(searches, "vyhľadávanie", "vyhľadávania", "vyhľadávaní")}). Hodnotím firmy…`,
  saved: (created: number, found: number) => `Nájdené firmy: ${found}, nové leady: ${created}.`,
  skipped: (company: string, reason: string) => `Neuložené: ${company} (${reason}).`,
  failed: (reason: string) => `Chyba: ${reason}`,
  foundEvent: (campaign: string | null, score: number, tier: string) =>
    `Nájdené AI vyhľadávaním${campaign ? ` (kampaň ${campaign})` : ""}. Skóre ${score}, tier ${tier}.`,
  /** Stored as the run error by closeStaleRuns. */
  interrupted: "Beh sa prerušil (napr. reštart servera). Spustite hľadanie znova.",
};
