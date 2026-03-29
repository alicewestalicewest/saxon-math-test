// api/teacher-geo.js
const { getRows, updateCell, deleteRow, ensureSheetExists } = require("../lib/sheets");
const nodemailer = require("nodemailer");

const SHEET_NAME = "Responses_GEO";
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD;

// Column positions (0-indexed) matching the header row written by submit-geo.js
// name, team, date, timestamp, total, pct, letter, emailSent, q1..q23, m24..m33, c34..c43
const COL = {
  name: 0, team: 1, date: 2, timestamp: 3,
  total: 4, pct: 5, letter: 6, emailSent: 7
};
// Answer columns start at index 8
const MC_KEYS    = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10",
                    "q11","q12","q13","q14","q15","q16","q17","q18","q19","q20",
                    "q21","q22","q23"];
const VOCAB_KEYS = ["m24","m25","m26","m27","m28","m29","m30","m31","m32","m33"];
const CAP_KEYS   = ["c34","c35","c36","c37","c38","c39","c40","c41","c42","c43"];
const ALL_ANS_KEYS = [...MC_KEYS, ...VOCAB_KEYS, ...CAP_KEYS];

// ── Email ─────────────────────────────────────────────────────────────────────
async function sendParentEmail(name, graded) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#2563eb;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;">US Geography Assessment Results</h2>
        <p style="margin:6px 0 0;opacity:.8;">Stratford Schools — Social Studies</p>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <p>Dear Parent/Guardian,</p>
        <p><strong>${name}</strong> has completed the <em>Geography of the United States</em> assessment.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:.95rem;">
          <tr style="background:#f1f5f9;">
            <th style="padding:10px;text-align:left;border:1px solid #e2e8f0;">Section</th>
            <th style="padding:10px;text-align:center;border:1px solid #e2e8f0;">Score</th>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #e2e8f0;">A. Multiple Choice</td>
            <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${graded.mc} / 23</td>
          </tr>
          <tr style="background:#f8fafc;">
            <td style="padding:10px;border:1px solid #e2e8f0;">B. Vocabulary Matching</td>
            <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${graded.vocab} / 10</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #e2e8f0;">C. State Capitals (Bonus)</td>
            <td style="padding:10px;text-align:center;border:1px solid #e2e8f0;">${graded.caps} / 10</td>
          </tr>
          <tr style="background:#eff6ff;font-weight:700;">
            <td style="padding:12px;border:1px solid #bfdbfe;">Total</td>
            <td style="padding:12px;text-align:center;border:1px solid #bfdbfe;font-size:1.15rem;">
              ${graded.total} / 43 &nbsp;·&nbsp; ${graded.pct}% &nbsp;·&nbsp; ${graded.letter}
            </td>
          </tr>
        </table>
        <p>Please contact your child's teacher if you have any questions.</p>
        <p style="margin-top:20px;color:#6b7280;font-size:.85rem;">— Mrs. West, Stratford Schools</p>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"Alice West" <${process.env.GMAIL_USER}>`,
    replyTo: "awest1@stratfordschools.com",
    to: process.env.PARENT_EMAIL_LIST || process.env.GMAIL_USER,
    subject: `Geography Assessment Results — ${name}`,
    html,
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, password } = req.body;
  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  try {

    // ── getData ───────────────────────────────────────────────────────────────
    if (action === "getData") {
      await ensureSheetExists(SHEET_NAME);
      const rows = await getRows(SHEET_NAME);
      if (!rows || rows.length <= 1) return res.json([]);

      const headers = rows[0];

      const submissions = rows.slice(1).map((row, i) => {
        // Map each answer key to its value using the header row
        const data = {};
        ALL_ANS_KEYS.forEach(k => {
          const idx = headers.indexOf(k);
          data[k] = idx >= 0 ? (row[idx] || "") : "";
        });

        return {
          name:       row[headers.indexOf("name")]      || "",
          team:       row[headers.indexOf("team")]      || "",
          timestamp:  row[headers.indexOf("timestamp")] || "",
          date:       row[headers.indexOf("date")]      || "",
          emailSent:  row[headers.indexOf("emailSent")] === "TRUE",
          row:        i + 2,   // 1-indexed sheet row (row 1 = headers)
          sheetName:  SHEET_NAME,
          data,
        };
      }).filter(s => s.name);

      return res.json(submissions);
    }

    // ── sendEmail ─────────────────────────────────────────────────────────────
    if (action === "sendEmail") {
      const { name, graded, rowIndex } = req.body;
      await sendParentEmail(name, graded);
      // Mark emailSent = TRUE in the sheet
      // emailSent is column index 8 (COL.emailSent + 1 for 1-based)
      await updateCell(rowIndex, COL.emailSent + 1, "TRUE", SHEET_NAME);
      return res.json({ ok: true });
    }

    // ── deleteRow ─────────────────────────────────────────────────────────────
    if (action === "deleteRow") {
      const { rowIndex } = req.body;
      // deleteRow in sheets.js takes a 0-based startIndex
      // rowIndex here is the 1-based sheet row, so subtract 1
      await deleteRow(rowIndex - 1, SHEET_NAME);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });

  } catch (e) {
    console.error("[teacher-geo]", e);
    return res.status(500).json({ error: e.message });
  }
};
