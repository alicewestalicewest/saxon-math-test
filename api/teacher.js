// api/teacher.js
const { TEACHER_PASSWORD, gradeData, getEmails, buildEmailBody } = require("../lib/data");
const { getRows, deleteRow, updateCell } = require("../lib/sheets");
const nodemailer = require("nodemailer");

// Column indices (0-based) matching the header written by submit.js
// 0:Timestamp 1:Name 2:Date 3:Score 4:Percent 5:Letter
// 6:Q1 7:Q2 8:Q3 9:Q4 10:Q5 11:Q6
// 12:Q7ax 13:Q7ay 14:Q7bx 15:Q7by 16:Q7cx 17:Q7cy
// 18:Q8 19:Q9
// 20:Q10a 21:Q10b 22:Q10c 23:Q10d
// 24:Q11a 25:Q11b 26:Q11c 27:Q11d
// 28:Q12 29:Q13 30:Q14 31:Q15 32:Q16 33:Q17 34:Q18 35:Q19 36:Q20
// 37:FactsScore 38:FactsAnswers
// 39:PU_Understand 40:PU_Plan 41:PU_Solve 42:PU_Check
// 43:UnitDeductions

function parseRows(rows) {
  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue; // skip empty rows

    let facts = {};
    try { facts = JSON.parse(r[38] || "{}"); } catch(e) {}

    const data = {
      name: r[1], date: r[2],
      q1:r[6],  q2:r[7],  q3:r[8],  q4:r[9],  q5:r[10], q6:r[11],
      q7ax:r[12], q7ay:r[13], q7bx:r[14], q7by:r[15], q7cx:r[16], q7cy:r[17],
      q8:r[18], q9:r[19],
      q10a:r[20], q10b:r[21], q10c:r[22], q10d:r[23],
      q11a:r[24], q11b:r[25], q11c:r[26], q11d:r[27],
      q12:r[28], q13:r[29], q14:r[30], q15:r[31], q16:r[32],
      q17:r[33], q18:r[34], q19:r[35], q20:r[36],
      facts,
      pu_understand: r[39] || "",
      pu_plan:       r[40] || "",
      pu_solve:      r[41] || "",
      pu_check:      r[42] || ""
    };

    const graded = gradeData(data);
    const emails = getEmails(r[1]);
    const unitDeductions = parseFloat(r[43] || 0) || 0;
    const psGrade = r[44] !== undefined && r[44] !== "" ? parseFloat(r[44]) : "";

    results.push({
      row: i,
      timestamp: r[0] ? r[0].toString() : "",
      name: r[1],
      date: r[2],
      emails,
      data,
      graded,
      unitDeductions,
      psGrade
    });
  }
  return results;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, password, rowIndex, deduction } = req.body || {};
  if (password !== TEACHER_PASSWORD) return res.status(403).json({ error: "Invalid password" });

  try {
    if (action === "getData") {
      const rows = await getRows();
      return res.json(parseRows(rows));
    }

    if (action === "saveDeduction") {
      // Update column 44 (index 43, col AR) for the given row (+1 for header row)
      await updateCell(rowIndex + 1, 44, deduction);
      return res.json({ ok: true });
    }

    if (action === "savePsGrade") {
      const { psGrade } = req.body;
      // Update column 45 (index 44, col AS) for the given row
      await updateCell(rowIndex + 1, 45, psGrade);
      return res.json({ ok: true });
    }

    if (action === "getEmailPreview") {
      const rows = await getRows();
      const subs = parseRows(rows);
      const sub = subs.find(s => s.row === rowIndex);
      if (!sub) return res.status(404).json({ error: "Not found" });
      return res.json(buildEmailBody(sub));
    }

    if (action === "sendEmail") {
      const rows = await getRows();
      const subs = parseRows(rows);
      const sub = subs.find(s => s.row === rowIndex);
      if (!sub) return res.status(404).json({ error: "Submission not found" });

      // psGrade may have been updated in the same session — use what's in the sheet
      const e = buildEmailBody(sub);
      if (!e.to || e.to.length === 0)
        return res.status(400).json({ error: "No email on file for " + sub.name });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: e.to.join(","),
        subject: e.subject,
        text: e.body
      });
      return res.json({ ok: true });
    }

    if (action === "updateAnswers") {
      const { data } = req.body;
      const newGraded = gradeData(data);
      // Build a single row from col D (index 4) onwards and write in one call
      const rowValues = [
        newGraded.total, newGraded.pct + "%", newGraded.letter,
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6,
        data.q7ax, data.q7ay, data.q7bx, data.q7by, data.q7cx, data.q7cy,
        data.q8, data.q9,
        data.q10a, data.q10b, data.q10c, data.q10d,
        data.q11a, data.q11b, data.q11c, data.q11d,
        data.q12, data.q13, data.q14, data.q15, data.q16, data.q17, data.q18, data.q19, data.q20,
        newGraded.factsScore, JSON.stringify(data.facts || {})
      ];
      const { sheets, spreadsheetId } = await require("../lib/sheets").getSheet();
      const sheetRow = rowIndex + 1; // +1 because row 1 = header
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Responses!D${sheetRow}`,
        valueInputOption: "RAW",
        requestBody: { values: [rowValues] }
      });
      return res.json({ ok: true, graded: newGraded });
    }

    if (action === "deleteSubmission") {
      await deleteRow(rowIndex);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
