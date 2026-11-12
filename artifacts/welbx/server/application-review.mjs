import { readFile } from "node:fs/promises";

export async function applicationReview() {
  const html = await readFile(new URL("./private/application-review.html", import.meta.url), "utf8");
  const controls = `<nav class="review-return" aria-label="Review navigation"><a href="/partner-room">← Partner Room</a><a href="/see-it-work">Public walkthrough</a><a href="/partner-room/response-workspace">Existing response workspace</a></nav>
<style>.review-return{padding:16px 5%;background:#102d39;display:flex;gap:24px;flex-wrap:wrap}.review-return a{color:white;min-height:44px;display:inline-flex;align-items:center;font:600 15px system-ui}.review-return a:focus-visible{outline:3px solid #fff;outline-offset:4px}</style>
<script>(()=>{let checking=false;const check=async()=>{if(checking)return;checking=true;try{const r=await fetch('/partner-session',{cache:'no-store',credentials:'same-origin'});if(!r.ok)lock()}catch{lock()}finally{checking=false}};const lock=()=>{document.body.replaceChildren();location.replace('/partner-access?reason=expired&returnTo=%2Fpartner-room%2Fapplication-review')};check();setInterval(check,15000);addEventListener('pageshow',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()})})();</script>`;
  return html.replace("<header>", controls + "<header>");
}
