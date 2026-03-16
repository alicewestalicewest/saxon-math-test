// api/upload-photo.js
const { google } = require("googleapis");
const { Readable } = require("stream");

const DRIVE_FOLDER_ID = "1sxkX6Ns-QMWf7libhtZBpUrdCgs9wwxw";

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var not set");
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { photo, studentName, testId, photoNum } = req.body;
    if (!photo) return res.status(400).json({ error: "No photo data" });

    const matches = photo.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: "Invalid photo format" });

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `${studentName}_Test${testId}_${photoNum}.${ext}`;

    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const file = await drive.files.create({
      requestBody: { name: fileName, parents: [DRIVE_FOLDER_ID], mimeType },
      media: { mimeType, body: stream },
      fields: "id,webViewLink",
    });

    return res.json({ ok: true, link: file.data.webViewLink || "" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
