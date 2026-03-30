// api/teacher-geo.js
const { getRows, updateCell, deleteRow, ensureSheetExists } = require("../lib/sheets");
const { TEACHER_PASSWORD, getEmails } = require("../lib/data");
const nodemailer = require("nodemailer");

const SHEET_NAME = "Responses_GEO";

const MC_KEYS    = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10",
                    "q11","q12","q13","q14","q15","q16","q17","q18","q19","q20",
                    "q21","q22","q23"];
const VOCAB_KEYS = ["m24","m25","m26","m27","m28","m29","m30","m31","m32","m33"];
const CAP_KEYS   = ["c34","c35","c36","c37","c38","c39","c40","c41","c42","c43"];
const ALL_ANS_KEYS = [...MC_KEYS, ...VOCAB_KEYS, ...CAP_KEYS];

const COL_EMAIL_SENT = 8; // 1-based column H

const MC_ANSWERS = {
  q1:"d", q2:"a", q3:"d", q4:"b", q5:"c", q6:"b", q7:"a", q8:"c",
  q9:"d", q10:"c", q11:"d", q12:"a", q13:"a", q14:"d", q15:"b",
  q16:"c", q17:"a", q18:"c", q19:"a", q20:"c", q21:"d", q22:"c", q23:"b"
};
const VOCAB_ANSWERS = {
  m24:"j", m25:"d", m26:"f", m27:"g", m28:"c",
  m29:"a", m30:"h", m31:"e", m32:"i", m33:"b"
};
const CAP_ANSWERS = {
  c34:"e", c35:"g", c36:"a", c37:"h", c38:"d",
  c39:"j", c40:"f", c41:"i", c42:"b", c43:"c"
};

function gradeSubmission(data) {
  let mc = 0, vocab = 0, caps = 0;
  for (const q in MC_ANSWERS)    if ((data[q]||"").toLowerCase().trim() === MC_ANSWERS[q])    mc++;
  for (const k in VOCAB_ANSWERS) if ((data[k]||"").toLowerCase().trim() === VOCAB_ANSWERS[k]) vocab++;
  for (const k in CAP_ANSWERS)   if ((data[k]||"").toLowerCase().trim() === CAP_ANSWERS[k])   caps++;
  const base = mc + vocab;
  const bonus = caps * 0.5;
  const total = Math.min(33, base + bonus);
  const pct   = Math.min(100, Math.round((base / 33) * 100));
  const letter = pct>=90?"A":pct>=80?"B":pct>=70?"C":pct>=60?"D":"F";
  return { mc, vocab, caps, base, bonus, total, pct, letter };
}

async function sendParentEmail(name, graded) {
  const emails = getEmails(name);
  if (!emails || emails.length === 0)
    throw new Error("No email on file for " + name);

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const divider = "=".repeat(54);
  const body =
`Dear Parent/Guardian,

${name} has completed the Geography of the United States unit assessment.

${divider}
RESULTS
${divider}
Base Score (Sections A & B)  : ${graded.base} / 33  (${graded.pct}%)
Bonus (State Capitals)       : +${graded.bonus.toFixed(1)} / 5
                               --------
Total                        : ${graded.total.toFixed(1)} / 33
${divider}

Please let me know if you have any questions.

Best regards,
Mrs. West`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    replyTo: "awest1@stratfordschools.com",
    to:      emails.join(","),
    subject: `US Geography Assessment Results — ${name}`,
    text:    body
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, password } = req.body || {};
  if (password !== TEACHER_PASSWORD)
    return res.status(403).json({ error: "Invalid password" });

  try {

    if (action === "getData") {
      await ensureSheetExists(SHEET_NAME);
      const rows = await getRows(SHEET_NAME);
      if (!rows || rows.length <= 1) return res.json([]);
      const headers = rows[0];
      const submissions = rows.slice(1).map((row, i) => {
        const data = {};
        ALL_ANS_KEYS.forEach(k => {
          const idx = headers.indexOf(k);
          data[k] = idx >= 0 ? (row[idx] || "") : "";
        });
        const name = row[headers.indexOf("name")] || "";
        return {
          name,
          team:      row[headers.indexOf("team")]      || "",
          timestamp: row[headers.indexOf("timestamp")] || "",
          date:      row[headers.indexOf("date")]      || "",
          emailSent: row[headers.indexOf("emailSent")] === "TRUE",
          emails:    getEmails(name),
          row:       i + 2,
          sheetName: SHEET_NAME,
          data,
          graded:    gradeSubmission(data)
        };
      }).filter(s => s.name);
      return res.json(submissions);
    }

    if (action === "sendEmail") {
      const { name, graded, rowIndex } = req.body;
      await sendParentEmail(name, graded);
      await updateCell(rowIndex, COL_EMAIL_SENT, "TRUE", SHEET_NAME);
      return res.json({ ok: true });
    }

    if (action === "deleteSubmission") {
      const { rowIndex } = req.body;
      await deleteRow(rowIndex - 1, SHEET_NAME);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });

  } catch (err) {
    console.error("[teacher-geo]", err);
    return res.status(500).json({ error: err.message });
  }
};
