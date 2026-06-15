/**
 * Ketabi Studio — Drive upload web app (Google Apps Script).
 *
 * Lets the GitHub render workflow drop finished videos straight into YOUR
 * Google Drive, with NO OAuth client, refresh token, or "app not verified"
 * wall. The script runs AS YOU, so files are owned by you and count against
 * your normal Drive storage (unlike a service account).
 *
 * ── One-time setup (all phone-browser doable) ──────────────────────────────
 * 1. Go to https://script.google.com  → New project.
 * 2. Delete the sample code, paste THIS whole file, and Save.
 * 3. Edit the two values in CONFIG below:
 *      SECRET     — make up a long random password (you'll reuse it as a secret)
 *      FOLDER_ID  — (optional) a Drive folder id from its URL, or "" for root
 * 4. Deploy ▸ New deployment ▸ (gear) Web app
 *      - Description: Ketabi uploader
 *      - Execute as:  Me
 *      - Who has access:  Anyone
 *    Deploy ▸ Authorize access ▸ pick your account ▸ (if warned) Advanced ▸
 *    "Go to <project> (unsafe)" ▸ Allow.   ← this is YOUR script, always allowed
 * 5. Copy the Web app URL (ends in /exec).
 * 6. In GitHub: Settings ▸ Secrets and variables ▸ Actions, add:
 *      DRIVE_UPLOAD_URL    = the /exec URL
 *      DRIVE_UPLOAD_TOKEN  = the same SECRET you set below
 *
 * The render workflow auto-detects these and uploads after each render.
 * Re-running with the same title replaces the old file (no duplicates).
 * ───────────────────────────────────────────────────────────────────────────
 */

var CONFIG = {
  SECRET: "CHANGE-ME-to-a-long-random-string",
  FOLDER_ID: "", // optional Drive folder id; "" = My Drive root
};

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.token !== CONFIG.SECRET) {
      return _json({ ok: false, error: "unauthorized" });
    }
    var name = p.name || "video.mp4";
    var mimeType = p.mimeType || "video/mp4";
    var folderId = p.folderId || CONFIG.FOLDER_ID;

    if (!e.postData || !e.postData.contents) {
      return _json({ ok: false, error: "no file content" });
    }
    var bytes = Utilities.base64Decode(e.postData.contents);
    var blob = Utilities.newBlob(bytes, mimeType, name);

    var folder = folderId
      ? DriveApp.getFolderById(folderId)
      : DriveApp.getRootFolder();

    // Replace any existing file of the same name (keeps the folder tidy).
    var existing = folder.getFilesByName(name);
    while (existing.hasNext()) existing.next().setTrashed(true);

    var file = folder.createFile(blob);
    return _json({ ok: true, id: file.getId(), url: file.getUrl(), name: name });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

// A quick health check you can open in a browser to confirm it's deployed.
function doGet() {
  return _json({ ok: true, service: "ketabi-drive-uploader" });
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
