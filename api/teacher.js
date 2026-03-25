// api/teacher.js
const { TEACHER_PASSWORD, gradeData, buildEmailBody, buildEmailBody17, getEmails } = require("../lib/data");
const { getRows, deleteRow, updateCell, updateRow, DEFAULT_SHEET } = require("../lib/sheets");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const SCHOOLOGY_SHEET_ID = "16cyjzU8pg6XZdMlHSkmA2sf_ds-l0aegi47-ZXIDDZw";

const TEAM_BLUE = [
  "Aarohi Agrawal","Alisha Agrawal","Ananya Arvind","Elizabeth Cai","Eloisa Keojampa",
  "Eric Huang","Erin Yuen","Evan Chang","Jenny Montgomery","Jooha Park",
  "Leo Matsiev","Maya Benavidez","Nathan Streeter","Peyton Pereira","Rynshall Chen",
  "Samiha Java","Tate Yeung","Thea Angelidis-Smith","Vassilis Papadimitriou"
];

function getSheet17Name(studentName) {
  return TEAM_BLUE.includes(studentName) ? "Responses17A_Blue" : "Responses17A_Red";
}

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
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SCHOOLOGY_SHEET_ID,
      range: `${testTabName}!A:C`
    });
    const rows = res.data.values || [];
    let rowNum = null;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === studentName) { rowNum = i + 1; break; }
    }
    if (!rowNum) return;
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
      name:r[1], date:r[2], emails, data, graded, unitDeductions, psGrade,
      sheetName: DEFAULT_SHEET
    });
  }
  return results;
}

function parseRows17(rows, sheetName) {
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
    const graded = gradeData(data);
    const emails        = getEmails(r[1]);
    const unitDeductions  = parseFloat(r[66]||0)||0;
    const psGrade       = r[67]!==undefined&&r[67]!==""?parseFloat(r[67]):"";
    const sketchGrade   = r[68]!==undefined&&r[68]!==""?parseFloat(r[68]):"";
    const graphGrade    = r[69]!==undefined&&r[69]!==""?parseFloat(r[69]):"";
    const photosEmailed = r[70] || "";
    const team          = TEAM_BLUE.includes(r[1]) ? "TEAM BLUE" : "TEAM RED";
    results.push({
      row:i, timestamp:r[0]?r[0].toString():"",
      name:r[1], date:r[2], emails, data, graded,
      unitDeductions, psGrade, sketchGrade, graphGrade, photosEmailed,
      team, sheetName
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

  // For 17A, COL offsets same for both tabs
  const COL = is17
    ? { deduct:67, ps:68, sketch:69, graph:70 }
    : { deduct:44, ps:45 };

  try {
    if (action === "getData") {
      if (is17) {
        // Load both tabs and merge, tagging each row with its sheetName
        const [rowsBlue, rowsRed] = await Promise.all([
          getRows("Responses17A_Blue").catch(()=>[]),
          getRows("Responses17A_Red").catch(()=>[])
        ]);
        const blue = parseRows17(rowsBlue, "Responses17A_Blue");
        const red  = parseRows17(rowsRed,  "Responses17A_Red");
        return res.json([...blue, ...red]);
      } else {
        const rows = await getRows(DEFAULT_SHEET);
        return res.json(parseRows16(rows));
      }
    }

    // For all mutation actions on 17A, determine which sheet from the request
    // The frontend now passes sheetName for 17A actions
    const sheetName = is17
      ? (req.body.sheetName || "Responses17A_Blue")
      : DEFAULT_SHEET;

    if (action === "saveDeduction") {
      await updateCell(rowIndex+1, COL.deduct, deduction, sheetName);
      return res.json({ ok:true });
    }

    if (action === "savePsGrade") {
      const { psGrade } = req.body;
      await updateCell(rowIndex+1, COL.ps, psGrade, sheetName);
      if (is17) {
        const rows = await getRows(sheetName);
        const subs = parseRows17(rows, sheetName);
        const sub = subs.find(s => s.row === rowIndex);
        if (sub) {
          const schoologyTab = TEAM_BLUE.includes(sub.name) ? "Test17A_Blue" : "Test17A_Red";
          await updateSchoologyPowerUp(sub.name, sub.graded.factsScore, psGrade, schoologyTab);
        }
      }
      return res.json({ ok:true });
    }

    if (action === "saveSketchGrade") {
      await updateCell(rowIndex+1, COL.sketch, req.body.sketchGrade, sheetName);
      return res.json({ ok:true });
    }

    if (action === "saveGraphGrade") {
      await updateCell(rowIndex+1, COL.graph, req.body.graphGrade, sheetName);
      return res.json({ ok:true });
    }

    if (action === "sendEmail") {
      const { emailBody } = req.body;
      const rows = await getRows(sheetName);
      const subs = is17 ? parseRows17(rows, sheetName) : parseRows16(rows);
      const sub = subs.find(s => s.row === rowIndex);
      if (!sub) return res.status(404).json({ error: "Submission not found" });
      if (!sub.emails || sub.emails.length === 0)
        return res.status(400).json({ error: "No email on file for " + sub.name });

      let emailText, emailSubject;
      if (emailBody) {
        emailText = emailBody;
        emailSubject = is17
          ? `Saxon Math Test 17A Results — ${sub.name}`
          : `Saxon Math Test Results — ${sub.name}`;
      } else {
        const e = is17 ? buildEmailBody17(sub) : buildEmailBody(sub);
        emailText = e.body;
        emailSubject = e.subject;
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT||"587"),
        secure: process.env.SMTP_SECURE==="true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: sub.emails.join(","),
        subject: emailSubject,
        text: emailText
      });
      return res.json({ ok: true });
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

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

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

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SCHOOLOGY_SHEET_ID,
      range: `${testTabName}!A:C`
    });
    const rows = res.data.values || [];
    let rowNum = null;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === studentName) { rowNum = i + 1; break; }
    }
    if (!rowNum) return;

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

    // ── FIX: always recalculate grade from answers instead of using stale stored value ──
    const graded = gradeData(data);

    const emails        = getEmails(r[1]);
    const unitDeductions  = parseFloat(r[66]||0)||0;
    const psGrade       = r[67]!==undefined&&r[67]!==""?parseFloat(r[67]):"";
    const sketchGrade   = r[68]!==undefined&&r[68]!==""?parseFloat(r[68]):"";
    const graphGrade    = r[69]!==undefined&&r[69]!==""?parseFloat(r[69]):"";
    const photosEmailed = r[70] || "";
    results.push({
      row:i, timestamp:r[0]?r[0].toString():"",
      name:r[1], date:r[2], emails, data, graded,
      unitDeductions, psGrade, sketchGrade, graphGrade, photosEmailed
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

    if (action === "sendEmail") {
      // ── FIX: use emailBody from frontend if provided (it has the correct recalculated score) ──
      const { emailBody } = req.body;

      const rows = await getRows(sheetName);
      const subs = is17 ? parseRows17(rows) : parseRows16(rows);
      const sub = subs.find(s => s.row === rowIndex);
      if (!sub) return res.status(404).json({ error: "Submission not found" });

      if (!sub.emails || sub.emails.length === 0)
        return res.status(400).json({ error: "No email on file for " + sub.name });

      // Use the frontend-provided emailBody if available (correct score),
      // otherwise fall back to the server-side builder
      let emailText, emailSubject;
      if (emailBody) {
        emailText = emailBody;
        emailSubject = is17
          ? `Saxon Math Test 17A Results — ${sub.name}`
          : `Saxon Math Test Results — ${sub.name}`;
      } else {
        const e = is17 ? buildEmailBody17(sub) : buildEmailBody(sub);
        emailText = e.body;
        emailSubject = e.subject;
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT||"587"),
        secure: process.env.SMTP_SECURE==="true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: sub.emails.join(","),
        subject: emailSubject,
        text: emailText
      });
      return res.json({ ok: true });
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

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
