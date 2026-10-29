import type Anthropic from "@anthropic-ai/sdk";
import type * as z from "zod/v4";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { anthropic, FALLBACK, MODEL, textOf } from "./client";

export type Usage = { input_tokens: number; output_tokens: number; web_searches: number };

function addUsage(total: Usage, u: Anthropic.Beta.BetaUsage) {
  total.input_tokens += u.input_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
  total.output_tokens += u.output_tokens;
  total.web_searches += u.server_tool_use?.web_search_requests ?? 0;
}

/**
 * Runs a web-research turn with Claude's server-side web search and returns the written findings
 * (with source URLs). Resumes `pause_turn` stops so long searches finish.
 */
export async function webResearch(opts: {
  system: string;
  prompt: string;
  maxSearches: number;
  usage: Usage;
}): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: opts.prompt }];

  for (let attempt = 0; attempt < 4; attempt++) {
    const stream = anthropic().beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      ...FALLBACK,
      output_config: { effort: "high" },
      system: opts.system,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: opts.maxSearches }],
      messages,
    });
    const message = await stream.finalMessage();
    addUsage(opts.usage, message.usage);

    if (message.stop_reason === "refusal") throw new Error("Claude declined this research request.");
    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content });
      continue;
    }
    // Earlier paused turns may hold part of the written findings.
    const earlier = messages
      .filter((m) => m.role === "assistant")
      .map((m) => textOf(m.content as Anthropic.Beta.BetaContentBlock[]))
      .join("\n");
    return `${earlier}\n${textOf(message.content)}`.trim();
  }
  throw new Error("Web research did not finish.");
}

/**
 * Turns free text into data matching a Zod schema using structured outputs. Streamed, because a
 * batch of up to 30 leads plus thinking needs a large max_tokens.
 */
export async function extract<T extends z.ZodType>(opts: {
  system: string;
  prompt: string;
  schema: T;
  usage: Usage;
}): Promise<z.infer<T>> {
  // Sent without the helper's parse() so the stream does not throw on a cut-off answer
  // before the stop reason can be checked; the answer is parsed below instead.
  const { parse, ...format } = betaZodOutputFormat(opts.schema);
  const stream = anthropic().beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    ...FALLBACK,
    output_config: { effort: "medium", format },
    system: opts.system,
    messages: [{ role: "user", content: opts.prompt }],
  });
  const message = await stream.finalMessage();
  addUsage(opts.usage, message.usage);
  if (message.stop_reason === "refusal") throw new Error("Claude declined this request.");
  if (message.stop_reason === "max_tokens") throw new Error("Claude's answer hit the output limit before it was complete.");
  // After a mid-stream fallback the answer continues in a second text block, so join them.
  const text = message.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  if (!text) throw new Error(`Claude returned no answer (stop_reason: ${message.stop_reason}).`);
  return parse(text) as z.infer<T>;
}
