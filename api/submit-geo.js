// api/submit-geo.js
// Mirrors api/submit.js but for the US Geography Assessment.
// Writes one row to the "Responses_GEO" sheet in your Google Sheets workbook.

import { getSheet, appendRow } from '../lib/sheets.js';

const SHEET_NAME = 'Responses_GEO';

// Column order written to the sheet
const MC_KEYS = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10',
                 'q11','q12','q13','q14','q15','q16','q17','q18','q19','q20',
                 'q21','q22','q23'];
const VOCAB_KEYS = ['m24','m25','m26','m27','m28','m29','m30','m31','m32','m33'];
const CAP_KEYS   = ['c34','c35','c36','c37','c38','c39','c40','c41','c42','c43'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  const { name, date, pct, letter, total } = body;

  if (!name) return res.status(400).json({ error: 'Missing name' });

  // Check for duplicate submission
  try {
    const rows = await getSheet(SHEET_NAME);
    if (rows && rows.length > 1) {
      const headers = rows[0];
      const nameIdx = headers.indexOf('name');
      const existing = rows.slice(1).find(r => r[nameIdx] === name);
      if (existing) return res.status(400).json({ error: 'already_submitted' });
    }
  } catch (_) { /* if sheet doesn't exist yet, first submission will create it */ }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

  const row = {
    name,
    date: date || '',
    timestamp,
    pct: pct || '',
    letter: letter || '',
    total: total || '',
    emailSent: 'FALSE',
    // MC answers
    ...Object.fromEntries(MC_KEYS.map(k => [k, body[k] || ''])),
    // Vocab matching
    ...Object.fromEntries(VOCAB_KEYS.map(k => [k, body[k] || ''])),
    // State capitals
    ...Object.fromEntries(CAP_KEYS.map(k => [k, body[k] || ''])),
  };

  try {
    await appendRow(SHEET_NAME, row);
    return res.json({ ok: true });
  } catch (e) {
    console.error('[submit-geo]', e);
    return res.status(500).json({ error: e.message });
  }
}
