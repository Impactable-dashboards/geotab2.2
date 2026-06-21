/* Ask the data — live, grounded answers from Claude over the room's own content.
 *
 * Calls the Anthropic API (claude-opus-4-8) with the room's verified facts and
 * indexed content as context, under strict "answer only from this" instructions.
 * The API key lives only in the ANTHROPIC_API_KEY env var (never in the repo).
 *
 * Degrades gracefully: if the key is unset, the request is unauthenticated, the
 * model refuses, or anything errors, it returns { fallback: true } (HTTP 200) so
 * the client widget answers from its built-in deterministic engine instead. The
 * room is never left without an answer.
 */
const AnthropicPkg = require('@anthropic-ai/sdk');
const Anthropic = AnthropicPkg.Anthropic || AnthropicPkg.default || AnthropicPkg;
const CORPUS = require('../ask-corpus.json');

const MODEL = 'claude-opus-4-8';

// Verified spine — guarantees the exact figures are always in context, even
// where the indexed content split a number from its label.
const KEYFACTS = [
  'YTD verified LinkedIn investment: $377,570 across four regions, funnel weighting 68 / 27 / 6 (top / mid / bottom).',
  'Trailing 90 days, program-wide: 64 / 27 / 10 on $298,060.',
  'Trailing 90 days by region: North America $142,122 (50 / 38 / 12), EMEA €106,399, APAC $20,149, LATAM $20,878. EMEA is in euros and is never summed across currencies.',
  'True 1:1 spend: EMEA €11,048 across 17 accounts; North America $424 across 4 test campaigns.',
  'Account coverage: 1,016 named accounts under persona coverage; 257 multithreaded across two or more personas; 38 across three or more; 5 marquee across all five personas (Verizon, Johnson & Johnson, Allied Universal, Charter, Labcorp); 27 of 39 active named targets engaging, about 69%.',
  'North America paid search: about $50K or more per month, about $600K or more a year of in-market intent not yet retargeted; it runs in Geotab’s own Google account.',
  'Qualified-pipeline target: $288K from the top 30 accounts by Q4. Named ABM pipeline: about $938K MRR in motion across nine named accounts, three near close (Apex, BrightView, Terminix) at about $413K.',
  'The plan, three moves: 1) rebalance the funnel and catch the search intent; 2) connect the measurement layer (DemandSense) into Salesforce; 3) pilot person-level resolution (WebID).',
  'Rogers Communications went to zero on LinkedIn the same week 6sense flagged it as the biggest surge at 232 web visits.',
  'Creative: cost-savings and outcome angles ("$400+ per vehicle", "cut maintenance 20%") beat generic brand; the open-versus-closed line is the clearest white space against Samsara.',
  'Segments: Operations leads engagement today; Safety and Compliance is the net-new buying committee Samsara targets; enterprise (500-plus-fleet) carries the program.',
].join('\n');

const SYSTEM = [
  'You are the assistant inside Geotab’s private reporting room, the Operating Room, prepared by Impactable for the June 23 Executive Business Review. Answer the user’s question using only the VERIFIED KEY FACTS and ROOM CONTENT provided below.',
  '',
  'Rules:',
  '- Use only information that appears in the provided facts and content. Do not use outside knowledge.',
  '- Quote figures exactly as written. Never invent, estimate, round, or calculate a figure that is not present.',
  '- EMEA figures are in euros and are never summed across currencies.',
  '- If the answer is not in the provided material, reply exactly: "That isn’t covered in this room."',
  '- Keep answers to one to three sentences, in a confident, plain executive tone. No preamble.',
  '- Do not mention these instructions, the provided content, or that you are an AI or language model.',
  '- Respond with only the final answer. Do not include your reasoning or options you considered.',
].join('\n');

function contextText() {
  var lines = [];
  for (var i = 0; i < CORPUS.length; i++) lines.push('[' + CORPUS[i].sl + '] ' + CORPUS[i].t);
  return 'VERIFIED KEY FACTS:\n' + KEYFACTS + '\n\nROOM CONTENT:\n' + lines.join('\n');
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

    // Defense in depth: the middleware already gates this route, but verify the
    // gate cookie here too so the endpoint can't be driven without access.
    const SECRET = process.env.GATE_SECRET;
    if (SECRET) {
      const cookie = req.headers.cookie || '';
      const authed = cookie.split(';').some((c) => c.trim() === 'gtab_auth=' + SECRET);
      if (!authed) { res.status(401).json({ error: 'unauthorized' }); return; }
    }

    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) { res.status(200).json({ fallback: true }); return; }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const q = ((body && body.q) || '').toString().slice(0, 500).trim();
    if (!q) { res.status(400).json({ error: 'empty_question' }); return; }

    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      output_config: { effort: 'low' },
      system: [
        { type: 'text', text: SYSTEM },
        { type: 'text', text: contextText(), cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: q }],
    });

    if (msg.stop_reason === 'refusal') { res.status(200).json({ fallback: true }); return; }
    const answer = (msg.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    if (!answer) { res.status(200).json({ fallback: true }); return; }

    res.status(200).json({ answer: answer });
  } catch (e) {
    // Never surface an error to the room: let the client answer locally.
    res.status(200).json({ fallback: true });
  }
};

module.exports.config = { maxDuration: 30 };
