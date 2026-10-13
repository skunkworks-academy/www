const assessments = {
  "member-profile": {
    name: "Member profile",
    focus: "the learner's current role, work context, prior learning, practical evidence and constraints"
  },
  "professional-preferences": {
    name: "Professional preferences",
    focus: "technology domains, project work, vendor ecosystem interests and possible specialisations"
  },
  "career-goals": {
    name: "Career goals",
    focus: "short-, medium- and long-term direction, target responsibilities, evidence and realistic milestones"
  },
  "learning-readiness": {
    name: "Learning readiness",
    focus: "available study time, learning format, current technical baseline, access needs and mentoring"
  }
};

const MAX_TURNS = 14;
const MAX_MESSAGE_LENGTH = 1800;
const MAX_TRANSCRIPT_LENGTH = 8000;

function cors(origin, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || "https://www.skunkworksacademy.com";
  return origin === allowedOrigin
    ? { "Access-Control-Allow-Origin": allowedOrigin, Vary: "Origin" }
    : {};
}

function json(data, status, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers }
  });
}

function parseTranscript(transcript) {
  if (!Array.isArray(transcript) || transcript.length > MAX_TURNS) return null;
  let length = 0;
  const cleaned = [];
  for (const turn of transcript) {
    if (!turn || !["user", "assistant"].includes(turn.role) || typeof turn.text !== "string") return null;
    const text = turn.text.trim().slice(0, MAX_MESSAGE_LENGTH);
    length += text.length;
    if (length > MAX_TRANSCRIPT_LENGTH) return null;
    cleaned.push({ role: turn.role === "assistant" ? "assistant" : "user", content: text });
  }
  return cleaned;
}

function instructions(config) {
  return `You are the Skunkworks Academy ${config.name} assessment guide.
Your purpose is to help a learner clarify ${config.focus}. This is educational guidance, not an employment, admission, performance, psychological, medical, legal or financial decision.
Ask one concise, neutral question at a time. Build on answers. Never infer protected characteristics, rank people, make eligibility decisions or request passwords, financial details, health data, government identifiers, confidential client data or other sensitive personal data.
At around 5 to 7 useful answers, provide a clearly labelled brief summary with: strengths or signals, assumptions or gaps, 2–4 practical next steps, and what a Skunkworks Academy adviser should validate. State that it is a draft recommendation and invite correction.
Use plain English. Do not claim that you stored, forwarded or emailed responses. Do not browse, use tools or make up programme availability.`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } });
    }
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, headers);
    if (!Object.keys(headers).length) return json({ error: "Origin not allowed." }, 403);
    if (!env.OPENAI_API_KEY) return json({ error: "Assessment service is not configured." }, 503, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400, headers); }
    const config = assessments[body.assessment];
    const transcript = parseTranscript(body.transcript);
    const start = body.start === true;
    const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
    if (!config || !transcript || (!start && !message)) return json({ error: "Invalid assessment request." }, 400, headers);

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5",
        store: false,
        instructions: instructions(config),
        input: start
          ? [{ role: "user", content: "Begin the assessment with a short welcome and your first question." }]
          : [...transcript, { role: "user", content: message }],
        max_output_tokens: 500
      })
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || typeof result.output_text !== "string") {
      console.error("OpenAI assessment request failed", upstream.status, result.error?.type || "unknown");
      return json({ error: "The assessment guide could not respond just now." }, 502, headers);
    }
    return json({ reply: result.output_text.trim() }, 200, headers);
  }
};
