const $ = (id) => document.getElementById(id);
const NOTE_KEY = "crown2510-note";
const IDEA_KEY = "crown2510-ideas";
const safeRead = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
function setStatus(message) { $("noteStatus").textContent = message; }
$("noteInput").value = localStorage.getItem(NOTE_KEY) || "";
$("saveNote").addEventListener("click", () => { localStorage.setItem(NOTE_KEY, $("noteInput").value); setStatus("✓ မှတ်စုကို ဒီဖုန်းမှာ သိမ်းပြီးပါပြီ။"); });
$("clearNote").addEventListener("click", () => { $("noteInput").value = ""; localStorage.removeItem(NOTE_KEY); setStatus("မှတ်စုကို ရှင်းလိုက်ပါပြီ။"); });
let ideas = safeRead(IDEA_KEY, []);
function renderIdeas() {
  const list = $("ideaList"); list.replaceChildren();
  ideas.forEach((idea, index) => {
    const li = document.createElement("li"); li.append(document.createTextNode(idea + " "));
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "secondary"; remove.textContent = "ဖျက်"; remove.setAttribute("aria-label", idea + " ကို ဖျက်ရန်");
    remove.addEventListener("click", () => { ideas.splice(index, 1); localStorage.setItem(IDEA_KEY, JSON.stringify(ideas)); renderIdeas(); });
    li.append(remove); list.append(li);
  });
}
$("saveIdea").addEventListener("click", () => {
  const value = $("ideaInput").value.trim();
  if (!value) { $("ideaInput").focus(); return; }
  ideas.unshift(value); localStorage.setItem(IDEA_KEY, JSON.stringify(ideas)); $("ideaInput").value = ""; renderIdeas();
});
document.querySelectorAll("[data-target]").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.target;
  if (target === "top") { window.scrollTo({top: 0, behavior: "smooth"}); }
  else { const section = $(target); if (section) section.scrollIntoView({behavior:"smooth", block:"start"}); }
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.target === target));
}));
renderIdeas();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}