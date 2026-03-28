// api/teacher-geo.js
// Mirrors the pattern of api/teacher.js but for the US Geography Assessment.
// Sheet name: "Responses_GEO"  (single sheet, no team split for this test)

import { getSheet, appendRow, updateRow, deleteRow } from '../lib/sheets.js';
import nodemailer from 'nodemailer';

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD;
const SHEET_NAME = 'Responses_GEO';

// ── Answer key (server-side copy for email reports) ───────────────────────────
const MC_ANSWERS = {
  q1:'d', q2:'a', q3:'d', q4:'b', q5:'c', q6:'b', q7:'a', q8:'c',
  q9:'d', q10:'c', q11:'d', q12:'a', q13:'a', q14:'d', q15:'b',
  q16:'c', q17:'a', q18:'c', q19:'a', q20:'c', q21:'d', q22:'c', q23:'b'
};
const VOCAB_ANSWERS = {
  m24:'j', m25:'d', m26:'f', m27:'g', m28:'c', m29:'a', m30:'h', m31:'e', m32:'i', m33:'b'
};
const CAP_ANSWERS = {
  c34:'e', c35:'g', c36:'a', c37:'h', c38:'d', c39:'j', c40:'f', c41:'i', c42:'b', c43:'c'
};

function gradeSubmission(data) {
  let mc = 0, vocab = 0, caps = 0;
  for (const q in MC_ANSWERS) if ((data[q]||'').toLowerCase().trim() === MC_ANSWERS[q]) mc++;
  for (const k in VOCAB_ANSWERS) if ((data[k]||'').toLowerCase().trim() === VOCAB_ANSWERS[k]) vocab++;
  for (const k in CAP_ANSWERS) if ((data[k]||'').toLowerCase().trim() === CAP_ANSWERS[k]) caps++;
  const total = mc + vocab + caps;
  const pct = Math.round((total / 43) * 100);
  const letter = pct>=90?'A':pct>=80?'B':pct>=70?'C':pct>=60?'D':'F';
  return { mc, vocab, caps, total, pct, letter };
}

// ── Email helper ──────────────────────────────────────────────────────────────
async function sendParentEmail(name, graded) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
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
            <td style="padding:12px;text-align:center;border:1px solid #bfdbfe;font-size:1.15rem;">${graded.total} / 43 &nbsp;·&nbsp; ${graded.pct}% &nbsp;·&nbsp; ${graded.letter}</td>
          </tr>
        </table>
        <p>Please contact your child's teacher if you have any questions.</p>
        <p style="margin-top:20px;color:#6b7280;font-size:.85rem;">— Mrs. West, Stratford Schools</p>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"Alice West" <${process.env.GMAIL_USER}>`,
    replyTo: 'awest1@stratfordschools.com',
    to: process.env.PARENT_EMAIL_LIST || process.env.GMAIL_USER,
    subject: `Geography Assessment Results — ${name}`,
    html
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, password, testId } = req.body;

  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  try {
    // ── getData ───────────────────────────────────────────────────────────────
    if (action === 'getData') {
      const rows = await getSheet(SHEET_NAME);
      if (!rows || rows.length <= 1) return res.json([]);

      const headers = rows[0];
      const submissions = rows.slice(1).map((row, i) => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx] || ''; });

        // Reconstruct answer data from columns
        const data = {};
        Object.keys({ ...MC_ANSWERS, ...VOCAB_ANSWERS, ...CAP_ANSWERS }).forEach(k => {
          data[k] = obj[k] || '';
        });

        return {
          name: obj.name || obj.Name || '',
          timestamp: obj.timestamp || obj.Timestamp || '',
          date: obj.date || obj.Date || '',
          emailSent: obj.emailSent === 'TRUE' || obj.emailSent === true,
          row: i + 2, // 1-indexed, skip header row
          sheetName: SHEET_NAME,
          data
        };
      }).filter(s => s.name);

      return res.json(submissions);
    }

    // ── sendEmail ─────────────────────────────────────────────────────────────
    if (action === 'sendEmail') {
      const { name, graded, rowIndex, sheetName } = req.body;
      await sendParentEmail(name, graded);
      // Mark emailSent in sheet
      try { await updateRow(sheetName || SHEET_NAME, rowIndex, { emailSent: 'TRUE' }); } catch(_) {}
      return res.json({ ok: true });
    }

    // ── deleteRow ─────────────────────────────────────────────────────────────
    if (action === 'deleteRow') {
      const { rowIndex, sheetName } = req.body;
      await deleteRow(sheetName || SHEET_NAME, rowIndex);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action' });

  } catch (e) {
    console.error('[teacher-geo]', e);
    return res.status(500).json({ error: e.message });
  }
}
