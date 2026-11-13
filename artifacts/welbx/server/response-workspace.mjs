import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Keep the approved bundle byte-for-byte intact on disk. Hosting controls are
// appended outside it, and receive CSP hashes from the response server.
export async function responseWorkspace() {
  const html = await readFile(new URL("./private/response-workspace.html", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("./private/response-workspace.json", import.meta.url), "utf8"));
  if (createHash("sha256").update(html).digest("hex") !== manifest.sha256) throw new Error("Workspace package integrity mismatch");
  const controls = `<nav class="partner-return" aria-label="Partner Room return"><a href="/partner-room">← Return to Partner Room</a> · <a href="/partner-room/application-review">Application review</a> · <a href="/see-it-work">Public walkthrough</a></nav>
<style>.partner-return{padding:12px 20px;background:#102d39}.partner-return a{display:inline-flex;align-items:center;min-height:44px;color:#fff;font:600 16px system-ui}.partner-return a:focus-visible{outline:3px solid #fff;outline-offset:4px}</style>
<script>
(() => {
  let checking = false;
  const lock = () => {
    document.body.replaceChildren();
    location.replace('/partner-access?reason=expired&returnTo=%2Fpartner-room%2Fresponse-workspace');
  };
  const check = async () => {
    if (checking) return;
    checking = true;
    try {
      const result = await fetch('/partner-session', {cache:'no-store', credentials:'same-origin'});
      if (!result.ok) lock();
    } catch { lock(); }
    finally { checking = false; }
  };
  check();
  setInterval(check, 15000);
  addEventListener('pageshow', check);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
})();
</script>`;
  return html.replace(/<body([^>]*)>/i, (_, attrs) => `<body${attrs}>${controls}`);
}
