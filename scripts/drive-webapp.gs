/**
 * Ketabi Studio — Drive web app (Google Apps Script).
 *
 * Handles BOTH uploading finished videos into your Drive AND organizing them
 * after you post (archive to a "Posted ✅" folder, or delete to free space).
 * Runs AS YOU, so no OAuth client / verification wall.
 *
 * ── If you're UPDATING an existing deployment ──────────────────────────────
 * 1. Paste this whole file over the old code and Save.
 * 2. Deploy ▸ Manage deployments ▸ (pencil/edit) ▸ Version: "New version" ▸
 *    Deploy.  ← editing the SAME deployment keeps your /exec URL unchanged.
 *
 * ── First-time setup ───────────────────────────────────────────────────────
 *  - Set CONFIG.SECRET to a long random string (reused as DRIVE_UPLOAD_TOKEN).
 *  - Deploy ▸ New deployment ▸ Web app ▸ Execute as: Me, Who has access: Anyone.
 *  - Put the /exec URL in the GitHub secret DRIVE_UPLOAD_URL, the SECRET in
 *    DRIVE_UPLOAD_TOKEN.
 */

var CONFIG = {
  SECRET: "Ketabi-Drive-7Gq4x9Pm2Vn8",
  FOLDER_ID: "", // optional Drive folder id where videos land; "" = My Drive root
  ARCHIVE_FOLDER: "Posted ✅",
};

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.token !== CONFIG.SECRET) return _json({ ok: false, error: "unauthorized" });
    switch (p.action || "upload") {
      case "upload":
        return _upload(p, e);
      case "archive":
        return _archive(p);
      case "delete":
        return _delete(p);
      case "list":
        return _list();
      default:
        return _json({ ok: false, error: "unknown action: " + p.action });
    }
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _upload(p, e) {
  if (!e.postData || !e.postData.contents)
    return _json({ ok: false, error: "no file content" });
  var name = p.name || "video.mp4";
  var bytes = Utilities.base64Decode(e.postData.contents);
  var blob = Utilities.newBlob(bytes, p.mimeType || "video/mp4", name);
  var folder = _sourceFolder();
  var existing = folder.getFilesByName(name);
  while (existing.hasNext()) existing.next().setTrashed(true);
  var file = folder.createFile(blob);
  return _json({ ok: true, id: file.getId(), url: file.getUrl(), name: name });
}

function _archive(p) {
  if (!p.name) return _json({ ok: false, error: "missing name" });
  var posted = _child(_sourceFolder(), CONFIG.ARCHIVE_FOLDER);
  var files = DriveApp.getFilesByName(p.name);
  var moved = 0;
  while (files.hasNext()) {
    files.next().moveTo(posted);
    moved++;
  }
  return _json({ ok: true, action: "archive", name: p.name, moved: moved });
}

function _delete(p) {
  if (!p.name) return _json({ ok: false, error: "missing name" });
  var files = DriveApp.getFilesByName(p.name);
  var trashed = 0;
  while (files.hasNext()) {
    files.next().setTrashed(true);
    trashed++;
  }
  return _json({ ok: true, action: "delete", name: p.name, trashed: trashed });
}

function _list() {
  var it = _sourceFolder().getFiles();
  var names = [];
  while (it.hasNext()) names.push(it.next().getName());
  return _json({ ok: true, files: names });
}

function _sourceFolder() {
  return CONFIG.FOLDER_ID
    ? DriveApp.getFolderById(CONFIG.FOLDER_ID)
    : DriveApp.getRootFolder();
}

function _child(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function doGet() {
  return _json({ ok: true, service: "ketabi-drive-uploader" });
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
