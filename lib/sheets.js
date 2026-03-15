// lib/sheets.js — Google Sheets read/write via Service Account
const { google } = require("googleapis");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "1y0eSeuB0ovkWd5H2l6IL2Tqg3WzzUVpPgXnJKy4KTLA";
const DEFAULT_SHEET = "Responses";

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

async function ensureSheetExists(sheetName) {
  const { sheets, spreadsheetId } = await getSheet();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets.some(s => s.properties.title === sheetName);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }]
      }
    });
  }
}

async function getRows(sheetName = DEFAULT_SHEET) {
  const { sheets, spreadsheetId } = await getSheet();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:BZ`,
  });
  return res.data.values || [];
}

async function appendRow(row, sheetName = DEFAULT_SHEET) {
  const { sheets, spreadsheetId } = await getSheet();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

async function updateCell(rowNum, colNum, value, sheetName = DEFAULT_SHEET) {
  const { sheets, spreadsheetId } = await getSheet();
  let col = "";
  let n = colNum;
  while (n > 0) {
    const rem = (n - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    n = Math.floor((n - 1) / 26);
  }
  const range = `${sheetName}!${col}${rowNum}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] },
  });
}

async function deleteRow(rowIndex, sheetName = DEFAULT_SHEET) {
  const { sheets, spreadsheetId } = await getSheet();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  const sheetId = sheet.properties.sheetId;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: rowIndex,
            endIndex: rowIndex + 1,
          }
        }
      }]
    }
  });
}

async function updateRow(rowNum, startCol, values, sheetName = DEFAULT_SHEET) {
  const { sheets, spreadsheetId } = await getSheet();
  let col = "";
  let n = startCol;
  while (n > 0) {
    const rem = (n - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    n = Math.floor((n - 1) / 26);
  }
  const range = `${sheetName}!${col}${rowNum}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

module.exports = { getRows, appendRow, updateCell, updateRow, deleteRow, ensureSheetExists, DEFAULT_SHEET };
