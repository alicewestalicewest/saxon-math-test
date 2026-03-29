// api/submit-geo.js
const { getRows, appendRow, ensureSheetExists } = require("../lib/sheets");

const SHEET_NAME = "Responses_GEO";

const MC_KEYS   = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10",
                   "q11","q12","q13","q14","q15","q16","q17","q18","q19","q20",
                   "q21","q22","q23"];
const VOCAB_KEYS = ["m24","m25","m26","m27","m28","m29","m30","m31","m32","m33"];
const CAP_KEYS   = ["c34","c35","c36","c37","c38","c39","c40","c41","c42","c43"];

const HEADERS = ["name","team","date","timestamp","total","pct","letter","emailSent",
  ...MC_KEYS, ...VOCAB_KEYS, ...CAP_KEYS];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body;
  const { name, team, date, total, pct, letter } = body;
  if (!name) return res.status(400).json({ error: "Missing name" });

  try {
    await ensureSheetExists(SHEET_NAME);

    // Check for duplicate
    const rows = await getRows(SHEET_NAME);
    if (rows.length > 1) {
      const nameIdx = rows[0].indexOf("name");
      const dupe = rows.slice(1).find(r => r[nameIdx] === name);
      if (dupe) return res.status(400).json({ error: "already_submitted" });
    }

    // Write header row if sheet is brand new
    if (rows.length === 0) {
      await appendRow(HEADERS, SHEET_NAME);
    }

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    const row = [
      name,
      team || "",
      date || "",
      timestamp,
      total || "",
      pct || "",
      letter || "",
      "FALSE",
      ...MC_KEYS.map(k => body[k] || ""),
      ...VOCAB_KEYS.map(k => body[k] || ""),
      ...CAP_KEYS.map(k => body[k] || ""),
    ];

    await appendRow(row, SHEET_NAME);
    return res.json({ ok: true });

  } catch (e) {
    console.error("[submit-geo]", e);
    return res.status(500).json({ error: e.message });
  }
};
