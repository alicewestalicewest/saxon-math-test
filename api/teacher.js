// api/teacher.js
const { TEACHER_PASSWORD, gradeData, getEmails, buildEmailBody } = require("../lib/data");
const { getRows, deleteRow, updateCell, updateRow, DEFAULT_SHEET } = require("../lib/sheets");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const SCHOOLOGY_SHEET_ID = "16cyjzU8pg6XZdMlHSkmA2sf_ds-l0aegi47-ZXIDDZw";

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var not set");
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function updateSchoologyPowerUp(studentName, factsScore, psGrade, testTabName) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const puTotal = Math.round((parseFloat(factsScore) + parseFloat(psGrade)) * 100) / 100;

    // Find the student's row in the Schoology sheet
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SCHOOLOGY_SHEET_ID,
      range: `${testTabName}!A:C`
    });
    const rows = res.data.values || [];
    let rowNum = null;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === studentName) { rowNum = i + 1; break; }
    }
    if (!rowNum) return; // student not found

    await sheets.spreadsheets.values.update({
      spreadsheetId: SCHOOLOGY_SHEET_ID,
      range: `${testTabName}!C${rowNum}`,
      valueInputOption: "RAW",
      requestBody: { values: [[puTotal + "/10"]] }
    });
  } catch (err) {
    console.error("Schoology PU update failed:", err.message);
  }
}

// ── TEST 17A column layout (0-based) ─────────────────────────
// 0:Timestamp 1:Name 2:Date 3:Score 4:Percent 5:Letter
// 6:Q1
// 7:Q2a 8:Q2b 9:Q2c 10:Q2d
// 11:Q3 12:Q4 13:Q5 14:Q6 15:Q7 16:Q8
// 17:Q9a 18:Q9b
// 19:Q10_volume 20:Q11
// 21:Q12a 22:Q12b 23:Q12c 24:Q12d
// 25:Q13_coeff 26:Q13_exp
// 27:Q14_name 28:Q14_perim 29:Q15
// 30:Q16 31:Q17 32:Q18 33:Q19
// 34:Q20a 35:Q20b 36:Q20c
// 37:FactsScore 38-61:24 facts cols
// 62:PU_Understand 63:PU_Plan 64:PU_Solve 65:PU_Check
// 66:UnitDeductions 67:PsGrade 68:SketchGrade 69:GraphGrade

const FACTS_KEYS_17 = [
  "f1d","f1f","f2d","f2f","f3d","f3f","f4d","f4f","f5d","f5f","f6d","f6f",
  "f7d","f7f","f8d","f8f","f9d","f9f","f10d","f10f","f11d","f11f","f12d","f12f"
];

function parseRows16(rows) {
  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue;
    let facts = {};
    try { facts = JSON.parse(r[38] || "{}"); } catch(e) {}
    const data = {
      name: r[1], date: r[2],
      q1:r[6], q2:r[7], q3:r[8], q4:r[9], q5:r[10], q6:r[11],
      q7ax:r[12], q7ay:r[13], q7bx:r[14], q7by:r[15], q7cx:r[16], q7cy:r[17],
      q8:r[18], q9:r[19],
      q10a:r[20], q10b:r[21], q10c:r[22], q10d:r[23],
      q11a:r[24], q11b:r[25], q11c:r[26], q11d:r[27],
      q12:r[28], q13:r[29], q14:r[30], q15:r[31], q16:r[32],
      q17:r[33], q18:r[34], q19:r[35], q20:r[36],
      facts,
      pu_understand: r[39]||"", pu_plan: r[40]||"",
      pu_solve: r[41]||"", pu_check: r[42]||""
    };
    const graded = gradeData(data);
    const emails = getEmails(r[1]);
    const unitDeductions = parseFloat(r[43]||0)||0;
    const psGrade = r[44]!==undefined&&r[44]!==""?parseFloat(r[44]):"";
    results.push({
      row:i, timestamp:r[0]?r[0].toString():"",
      name:r[1], date:r[2], emails, data, graded, unitDeductions, psGrade
    });
  }
  return results;
}

function parseRows17(rows) {
  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[1]) continue;
    const facts = {};
    FACTS_KEYS_17.forEach((k, idx) => { facts[k] = r[38 + idx] || ""; });
    const data = {
      name: r[1], date: r[2],
      q1: r[6],
      q2a:r[7], q2b:r[8], q2c:r[9], q2d:r[10],
      q3:r[11], q4:r[12], q5:r[13], q6:r[14], q7:r[15], q8:r[16],
      q9a:r[17], q9b:r[18],
      q10:r[19], q11:r[20],
      q12a:r[21], q12b:r[22], q12c:r[23], q12d:r[24],
      q13c:r[25], q13e:r[26],
      q14:r[27], q14p:r[28], q15:r[29],
      q16:r[30], q17:r[31], q18:r[32], q19:r[33],
      q20a:r[34], q20b:r[35], q20c:r[36],
      facts,
      pu_understand:r[62]||"", pu_plan:r[63]||"",
      pu_solve:r[64]||"", pu_check:r[65]||""
    };
    // Return stored score from sheet — grading happens on frontend
    const storedTotal = parseFloat(r[3]||0)||0;
    const storedPct   = parseInt((r[4]||"0").replace("%",""))||0;
    const storedLetter= r[5]||"?";
    const storedFacts = parseFloat(r[37]||0)||0;
    // Build a minimal graded object from stored values — frontend will re-grade fully
    const graded = {
      total: storedTotal, pct: storedPct, letter: storedLetter,
      factsScore: storedFacts, factsCorrect: 0, results: {}, factsResults: {},
      pu_understand: data.pu_understand, pu_plan: data.pu_plan,
      pu_solve: data.pu_solve, pu_check: data.pu_check
    };
    const emails = getEmails(r[1]);
    const unitDeductions = parseFloat(r[66]||0)||0;
    const psGrade     = r[67]!==undefined&&r[67]!==""?parseFloat(r[67]):"";
    const sketchGrade = r[68]!==undefined&&r[68]!==""?parseFloat(r[68]):"";
    const graphGrade  = r[69]!==undefined&&r[69]!==""?parseFloat(r[69]):"";
    const photo       = r[70] || "";
    let photos = [];
    try { photos = JSON.parse(photo); if(!Array.isArray(photos)) photos = photo ? [photo] : []; } catch(e){ photos = photo ? [photo] : []; }
    results.push({
      row:i, timestamp:r[0]?r[0].toString():"",
      name:r[1], date:r[2], emails, data, graded,
      unitDeductions, psGrade, sketchGrade, graphGrade, photos
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

  const { action, password, rowIndex, deduction, testId } = req.body || {};
  if (password !== TEACHER_PASSWORD) return res.status(403).json({ error: "Invalid password" });

  const is17 = testId === "17A";
  const sheetName = is17 ? "Responses17A" : DEFAULT_SHEET;
  const COL = is17
    ? { deduct:67, ps:68, sketch:69, graph:70 }
    : { deduct:44, ps:45 };

  try {
    if (action === "getData") {
      const rows = await getRows(sheetName);
      return res.json(is17 ? parseRows17(rows) : parseRows16(rows));
    }

    if (action === "saveDeduction") {
      await updateCell(rowIndex+1, COL.deduct, deduction, sheetName);
      return res.json({ ok:true });
    }

    if (action === "savePsGrade") {
      const { psGrade } = req.body;
      await updateCell(rowIndex+1, COL.ps, psGrade, sheetName);
      // Update Schoology Grades sheet with final Power Up
      if (is17) {
        const rows = await getRows(sheetName);
        const subs = parseRows17(rows);
        const sub = subs.find(s => s.row === rowIndex);
        if (sub) {
          await updateSchoologyPowerUp(sub.name, sub.graded.factsScore, psGrade, "Test17A");
        }
      }
      return res.json({ ok:true });
    }

    if (action === "saveSketchGrade") {
      const { sketchGrade } = req.body;
      await updateCell(rowIndex+1, COL.sketch, sketchGrade, sheetName);
      return res.json({ ok:true });
    }

    if (action === "saveGraphGrade") {
      const { graphGrade } = req.body;
      await updateCell(rowIndex+1, COL.graph, graphGrade, sheetName);
      return res.json({ ok:true });
    }

    if (action === "sendPhotosEmail") {
      const { photos, name, emails } = req.body;
      if (!emails || emails.length === 0)
        return res.status(400).json({ error: "No email on file for " + name });
      const photoLines = photos.map((link, i) => `Photo ${i+1}: ${link}`).join("\n");
      const body = `Dear Parent/Guardian,\n\nPlease find the photo(s) of ${name}'s Saxon Math Test 17A paper below:\n\n${photoLines}\n\nBest regards,\nMrs. West`;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: emails.join(","),
        subject: `Saxon Math Test 17A — ${name}'s Paper Photos`,
        text: body
      });
      return res.json({ ok: true });
    }

    if (action === "sendEmail") {
      const rows = await getRows(sheetName);
      const subs = is17 ? parseRows17(rows) : parseRows16(rows);
      const sub = subs.find(s => s.row === rowIndex);
      if (!sub) return res.status(404).json({ error:"Submission not found" });
      const e = buildEmailBody(sub);
      if (!e.to||e.to.length===0)
        return res.status(400).json({ error:"No email on file for "+sub.name });
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT||"587"),
        secure: process.env.SMTP_SECURE==="true",
        auth: { user:process.env.SMTP_USER, pass:process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM||process.env.SMTP_USER,
        to: e.to.join(","),
        subject: e.subject,
        text: e.body
      });
      return res.json({ ok:true });
    }

    if (action === "updateAnswers") {
      const { data } = req.body;
      const newGraded = gradeData(data);
      if (is17) {
        const factsRow = FACTS_KEYS_17.map(k => (data.facts||{})[k]||"");
        const rowValues = [
          newGraded.total, newGraded.pct+"%", newGraded.letter,
          data.q1,
          data.q2a, data.q2b, data.q2c, data.q2d,
          data.q3, data.q4, data.q5, data.q6, data.q7, data.q8,
          data.q9a, data.q9b,
          data.q10, data.q11,
          data.q12a, data.q12b, data.q12c, data.q12d,
          data.q13c, data.q13e,
          data.q14, data.q14p, data.q15,
          data.q16, data.q17, data.q18, data.q19,
          data.q20a, data.q20b, data.q20c,
          newGraded.factsScore, ...factsRow
        ];
        await updateRow(rowIndex+1, 4, rowValues, sheetName);
      } else {
        const rowValues = [
          newGraded.total, newGraded.pct+"%", newGraded.letter,
          data.q1, data.q2, data.q3, data.q4, data.q5, data.q6,
          data.q7ax, data.q7ay, data.q7bx, data.q7by, data.q7cx, data.q7cy,
          data.q8, data.q9,
          data.q10a, data.q10b, data.q10c, data.q10d,
          data.q11a, data.q11b, data.q11c, data.q11d,
          data.q12, data.q13, data.q14, data.q15, data.q16, data.q17, data.q18, data.q19, data.q20,
          newGraded.factsScore, JSON.stringify(data.facts||{})
        ];
        await updateRow(rowIndex+1, 4, rowValues, sheetName);
      }
      return res.json({ ok:true, graded:newGraded });
    }

    if (action === "deleteSubmission") {
      await deleteRow(rowIndex, sheetName);
      return res.json({ ok:true });
    }

    return res.status(400).json({ error:"Unknown action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error:err.message });
  }
};
