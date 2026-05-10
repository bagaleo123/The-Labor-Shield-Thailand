import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are an expert Thai labor law consultant specializing in the Thai Labor Protection Act B.E. 2541 (as amended through 2026). You assist both Thai nationals and foreign (expat) workers.

KEY LAWS YOU KNOW:
- Section 17: Minimum 1 pay-cycle notice before termination (or pay in lieu)
- Section 30: Minimum 6 days annual leave after 1 year service
- Section 32: 30 fully paid sick days per year; sick leave CANNOT substitute annual leave
- Section 61: Overtime 1.5x on regular days, 3x on holidays
- Section 76: Permitted salary deductions (taxes, SSO, union, court orders only)
- Section 118: Statutory severance based on years of service:
  - 120 days–1 year: 30 days pay
  - 1–3 years: 90 days pay
  - 3–6 years: 180 days pay
  - 6–10 years: 240 days pay
  - 10–20 years: 300 days pay
  - 20+ years: 400 days pay
- Section 119: Termination for misconduct forfeits severance
- Termination due to illness is ILLEGAL
- SSO ceiling 2026: ฿17,500 salary, max contribution ฿875/month (5%)
- Minimum wage 2026: ฿400/day Bangkok, ฿361/day regional
- Work permit costs are employer's responsibility (not employee)

RESPONSE RULES:
1. Always cite specific sections when relevant
2. Be direct and actionable
3. When the situation involves illegal employer conduct, clearly state it is illegal and advise filing with DLPW (1546)
4. If responding to Thai users (detected from language), use polite Thai particles (ครับ/ค่ะ)
5. Keep responses under 400 words
6. Cross-verify facts before stating them
7. End with the most important next action step`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { query, language } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Invalid query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langNote = language === "th"
      ? "The user is communicating in Thai. Respond in Thai using polite formal particles (ครับ/ค่ะ)."
      : language === "ru"
      ? "The user is communicating in Russian. Respond in Russian."
      : "The user is communicating in English. Respond in English.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        system: SYSTEM_PROMPT + "\n\n" + langNote,
        messages: [{ role: "user", content: query }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: "AI service error", detail: err }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text ?? "No response";

    // Store anonymized query in Supabase for learning loop
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseKey) {
      const sb = createClient(supabaseUrl, supabaseKey);
      await sb.from("ai_chat_queries").insert({
        query: query.slice(0, 500),
        response: answer.slice(0, 1000),
        language: language ?? "en",
      });
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
