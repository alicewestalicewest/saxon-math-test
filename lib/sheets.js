// lib/sheets.js — Google Sheets read/write via Service Account
const { google } = require("googleapis");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "1y0eSeuB0ovkWd5H2l6IL2Tqg3WzzUVpPgXnJKy4KTLA";
const SHEET_NAME = "Responses";

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var not set");
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheet() {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId: SPREADSHEET_ID };
}

async function getRows() {
  const { sheets, spreadsheetId } = await getSheet();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:AR`,
  });
  return res.data.values || [];
}

async function appendRow(row) {
  const { sheets, spreadsheetId } = await getSheet();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

// Update a single cell. rowNum and colNum are 1-based.
async function updateCell(rowNum, colNum, value) {
  const { sheets, spreadsheetId } = await getSheet();
  // Convert col number to letter(s)
  let col = "";
  let n = colNum;
  while (n > 0) {
    const rem = (n - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    n = Math.floor((n - 1) / 26);
  }
  const range = `${SHEET_NAME}!${col}${rowNum}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] },
  });
}

async function deleteRow(rowIndex) {
  // rowIndex is 1-based data row (row 1 = header), sheet row = rowIndex + 1
  const { sheets, spreadsheetId } = await getSheet();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(s => s.properties.title === SHEET_NAME);
  if (!sheet) throw new Error("Sheet not found");
  const sheetId = sheet.properties.sheetId;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: rowIndex,   // 0-based; rowIndex 1 = first data row
            endIndex: rowIndex + 1,
          }
        }
      }]
    }
  });
}

// Update a range of cells in one API call. rowNum is 1-based, startCol is 1-based.
async function updateRow(rowNum, startCol, values) {
  const { sheets, spreadsheetId } = await getSheet();
  let col = "";
  let n = startCol;
  while (n > 0) {
    const rem = (n - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    n = Math.floor((n - 1) / 26);
  }
  const range = `${SHEET_NAME}!${col}${rowNum}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

module.exports = { getRows, appendRow, updateCell, updateRow, deleteRow, SHEET_NAME };
