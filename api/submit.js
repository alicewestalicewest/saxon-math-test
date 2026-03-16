// api/submit.js
const { gradeData } = require("../lib/data");
const { getRows, appendRow, ensureSheetExists, DEFAULT_SHEET } = require("../lib/sheets");
const { google } = require("googleapis");
const { Readable } = require("stream");

const DRIVE_FOLDER_ID = "1sxkX6Ns-QMWf7libhtZBpUrdCgs9wwxw";
const SCHOOLOGY_SHEET_ID = "16cyjzU8pg6XZdMlHSkmA2sf_ds-l0aegi47-ZXIDDZw";

const FACTS_KEYS_17 = [
  "f1d","f1f","f2d","f2f","f3d","f3f","f4d","f4f","f5d","f5f","f6d","f6f",
  "f7d","f7f","f8d","f8f","f9d","f9f","f10d","f10f","f11d","f11f","f12d","f12f"
];

const FACTS_LABELS_17 = [
  "10%_dec","10%_frac","90%_dec","90%_frac","5%_dec","5%_frac",
  "12.5%_dec","12.5%_frac","50%_dec","50%_frac","25%_dec","25%_frac",
  "33.3%_dec","33.3%_frac","20%_dec","20%_frac","75%_dec","75%_frac",
  "66.7%_dec","66.7%_frac","1%_dec","1%_frac","250%_dec","250%_frac"
];

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var not set");
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive"
    ],
  });
}

async function uploadPhotoToDrive(base64DataUrl, studentName, testId, photoNum) {
  try {
    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });
    const matches = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid photo data");
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `${studentName}_Test${testId}_${photoNum}.${ext}`;
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    const file = await drive.files.create({
      requestBody: { name: fileName, parents: [DRIVE_FOLDER_ID], mimeType },
      media: { mimeType, body: stream },
      fields: "id,webViewLink",
    });
    return file.data.webViewLink || "";
  } catch (err) {
    console.error(`Photo ${photoNum} upload failed:`, err.message);
    return "";
  }
}

async function updateSchoologyGrades(studentName, pct, factsScore, testTabName) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SCHOOLOGY_SHEET_ID });
    const tabExists = meta.data.sheets.some(s => s.properties.title === testTabName);
    if (!tabExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SCHOOLOGY_SHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: testTabName } } }] }
      });
      await sheets.spreadsheets.values.append({
        spreadsheetId: SCHOOLOGY_SHEET_ID,
        range: `${testTabName}!A1`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [["Name", "Total %", "Power Up Grade"]] }
      });
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId: SCHOOLOGY_SHEET_ID,
      range: `${testTabName}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [[studentName, pct + "%", "Pending"]] }
    });
  } catch (err) {
    console.error("Schoology grade update failed:", err.message);
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;
    const testId = data.testId || "16A";
    const sheetName = testId === "17A" ? "Responses17A" : DEFAULT_SHEET;

    await ensureSheetExists(sheetName);

    const rows = await getRows(sheetName);
    if (rows.length > 1) {
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][1] === data.name) {
          return res.status(409).json({ error: "already_submitted" });
        }
      }
    }

    const graded = testId === "17A"
      ? (data.graded || { total: data.total || 0, pct: data.pct || 0, letter: data.letter || "?", factsScore: data.factsScore || 0 })
      : gradeData(data);

    // Upload up to 6 photos to Drive
    let photoLinks = [];
    if (testId === "17A" && data.photos && data.photos.length > 0) {
      const uploads = data.photos.slice(0, 6).map((p, i) =>
        uploadPhotoToDrive(p, data.name, testId, i + 1)
      );
      photoLinks = await Promise.all(uploads);
      photoLinks = photoLinks.filter(Boolean);
    }

    if (testId === "17A") {
      if (rows.length === 0) {
        await appendRow([
          "Timestamp","Name","Date","Score","Percent","Letter",
          "Q1","Q2a","Q2b","Q2c","Q2d",
          "Q3","Q4","Q5","Q6","Q7","Q8",
          "Q9a","Q9b","Q10_volume","Q11",
          "Q12a","Q12b","Q12c","Q12d",
          "Q13_coeff","Q13_exp",
          "Q14_name","Q14_perim","Q15",
          "Q16","Q17","Q18","Q19",
          "Q20a","Q20b","Q20c",
          "FactsScore",
          ...FACTS_LABELS_17,
          "PU_Understand","PU_Plan","PU_Solve","PU_Check",
          "UnitDeductions","PsGrade","SketchGrade","GraphGrade","PhotoLinks"
        ], sheetName);
      }

      const factsRow = FACTS_KEYS_17.map(k => (data.facts||{})[k]||"");

      await appendRow([
        new Date().toLocaleString(), data.name, data.date,
        graded.total, graded.pct+"%", graded.letter,
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
        graded.factsScore,
        ...factsRow,
        data.pu_understand||"", data.pu_plan||"", data.pu_solve||"", data.pu_check||"",
        0, "", "", "",
        JSON.stringify(photoLinks)
      ], sheetName);

      await updateSchoologyGrades(data.name, graded.pct, graded.factsScore, "Test17A");

    } else {
      if (rows.length === 0) {
        await appendRow([
          "Timestamp","Name","Date","Score","Percent","Letter",
          "Q1","Q2","Q3","Q4","Q5","Q6",
          "Q7ax","Q7ay","Q7bx","Q7by","Q7cx","Q7cy",
          "Q8","Q9",
          "Q10a","Q10b","Q10c","Q10d",
          "Q11a","Q11b","Q11c","Q11d",
          "Q12","Q13","Q14","Q15","Q16","Q17","Q18","Q19","Q20",
          "FactsScore","FactsAnswers",
          "PU_Understand","PU_Plan","PU_Solve","PU_Check",
          "UnitDeductions","PsGrade"
        ], sheetName);
      }
      await appendRow([
        new Date().toLocaleString(), data.name, data.date,
        graded.total, graded.pct+"%", graded.letter,
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6,
        data.q7ax, data.q7ay, data.q7bx, data.q7by, data.q7cx, data.q7cy,
        data.q8, data.q9,
        data.q10a, data.q10b, data.q10c, data.q10d,
        data.q11a, data.q11b, data.q11c, data.q11d,
        data.q12, data.q13, data.q14, data.q15, data.q16, data.q17, data.q18, data.q19, data.q20,
        graded.factsScore, JSON.stringify(data.facts||{}),
        data.pu_understand||"", data.pu_plan||"", data.pu_solve||"", data.pu_check||"",
        0, ""
      ], sheetName);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
