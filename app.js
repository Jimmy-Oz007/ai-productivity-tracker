// WorkLog V3 — portfolio version
// This version runs locally using localStorage, so it is safe to upload to GitHub.

const STORAGE_KEY = "worklog-v3-entries";
const CHAT_KEY = "worklog-v3-chat";
const THEME_KEY = "worklog-v3-theme";

const state = {
  entries: loadJSON(STORAGE_KEY, []),
  chat: loadJSON(CHAT_KEY, [])
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
  localStorage.setItem(CHAT_KEY, JSON.stringify(state.chat.slice(-40)));
}

function extractEntries(text) {
  const message = text.toLowerCase();
  const entries = [];
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:on\s+|for\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+(?:for|on)\s+([a-z0-9\s-]{2,40}))?/gi,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[:\s]+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)(?:\s+(?:for|on)\s+([a-z0-9\s-]{2,40}))?/gi
  ];

  let match;
  while ((match = patterns[0].exec(message)) !== null) {
    entries.push({ hours: Number(match[1]), day: titleCase(match[2]), project: cleanProject(match[3]) });
  }
  while ((match = patterns[1].exec(message)) !== null) {
    entries.push({ day: titleCase(match[1]), hours: Number(match[2]), project: cleanProject(match[3]) });
  }

  return entries.filter(entry => entry.hours > 0 && entry.hours <= 16);
}

function cleanProject(project) {
  if (!project) return "General";
  return titleCase(project.replace(/\b(hours?|hrs?|worked|log|logged)\b/g, "").trim()) || "General";
}

function validateInput(text) {
  const clean = text.trim();
  if (clean.length < 3) return "Please enter a work-hour message.";
  if (clean.length > 500) return "Please keep the message under 500 characters.";
  if (/summary|report|total|breakdown|overtime|show|what/i.test(clean)) return "";
  if (extractEntries(clean).length === 0) return 'Try: "I worked 6 hours on Monday for LLM App"';
  return "";
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  const error = validateInput(text);
  if (error) {
    input.placeholder = error;
    input.value = "";
    setTimeout(() => input.placeholder = 'e.g. "I worked 6 hours on Monday for LLM App"', 2600);
    return;
  }

  input.value = "";
  addMessage(text, "user", true);

  const extracted = extractEntries(text);
  let reply = "";

  if (extracted.length) {
    extracted.forEach(entry => upsertEntry(entry, text));
    reply = extracted.map(entry => `Logged ${formatHours(entry.hours)} hours for ${entry.day} under ${entry.project}.`).join(" ");
  } else {
    reply = generateSummaryReply(text);
  }

  addMessage(reply, "assistant", true);
  saveState();
  renderAll();
}

function upsertEntry(entry, rawMessage) {
  const existing = state.entries.find(item => item.day === entry.day && item.project.toLowerCase() === entry.project.toLowerCase());
  if (existing) {
    existing.hours = entry.hours;
    existing.rawMessage = rawMessage;
    existing.updatedAt = new Date().toISOString();
  } else {
    state.entries.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      day: entry.day,
      hours: entry.hours,
      project: entry.project,
      rawMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

function generateSummaryReply(text) {
  const total = getTotalHours();
  const projectTotals = groupByProject();
  const dayTotals = groupByDay();

  if (/overtime/i.test(text)) {
    return total > 38 ? `You logged ${formatHours(total)} hours. That is above a standard 38-hour work week.` : `You logged ${formatHours(total)} hours. That is within a standard 38-hour work week.`;
  }

  if (/project|breakdown/i.test(text)) {
    const top = Object.entries(projectTotals).sort((a, b) => b[1] - a[1])[0];
    return top ? `Your largest project is ${top[0]} with ${formatHours(top[1])} hours.` : "No project data has been logged yet.";
  }

  if (/week|summary|total|show|what/i.test(text)) {
    const busiest = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    return busiest ? `You have logged ${formatHours(total)} hours total. Your busiest day is ${busiest[0]} with ${formatHours(busiest[1])} hours.` : "No work hours have been logged yet.";
  }

  return 'I can log work hours or show summaries. Try: "I worked 5 hours on Monday for Website Project".';
}

function renderAll() {
  renderMetrics();
  renderEntries();
  renderReports();
}

function renderMetrics() {
  const total = getTotalHours();
  const projects = groupByProject();
  const topProject = Object.entries(projects).sort((a, b) => b[1] - a[1])[0];

  document.getElementById("total-hours").textContent = formatHours(total);
  document.getElementById("total-entries").textContent = state.entries.length;
  document.getElementById("top-project").textContent = topProject ? topProject[0] : "None";
  document.getElementById("overtime-status").textContent = total > 38 ? "Overtime" : "Normal";
}

function renderEntries() {
  const list = document.getElementById("entry-list");
  if (!state.entries.length) {
    list.innerHTML = '<p class="empty">No entries yet.</p>';
    return;
  }

  const sorted = [...state.entries].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
  list.innerHTML = sorted.map(entry => `
    <div class="entry">
      <strong>${escapeHtml(entry.day)} — ${formatHours(entry.hours)}h</strong>
      <small>${escapeHtml(entry.project)}</small>
    </div>
  `).join("");
}

function renderReports() {
  renderBarReport("weekly-report", groupByDay(), days);
  renderBarReport("project-report", groupByProject());
}

function renderBarReport(elementId, data, preferredOrder) {
  const container = document.getElementById(elementId);
  const entries = Object.entries(data);
  if (!entries.length) {
    container.textContent = elementId === "weekly-report" ? "No report yet." : "No project data yet.";
    return;
  }

  const ordered = preferredOrder ? preferredOrder.filter(key => data[key]).map(key => [key, data[key]]) : entries.sort((a, b) => b[1] - a[1]);
  const max = Math.max(...ordered.map(([, value]) => value), 1);

  container.innerHTML = ordered.map(([label, value]) => `
    <div class="bar-row">
      <span>${escapeHtml(label)}</span>
      <div class="bar"><span style="width:${Math.max(4, (value / max) * 100)}%"></span></div>
      <strong>${formatHours(value)}h</strong>
    </div>
  `).join("");
}

function addMessage(text, sender, persist = false) {
  const chatBox = document.getElementById("chat-box");
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;
  wrapper.innerHTML = `<div class="meta">${sender === "user" ? "You" : "WorkLog AI"}</div><div class="bubble"></div>`;
  wrapper.querySelector(".bubble").textContent = text;
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (persist) state.chat.push({ sender, text });
}

function restoreChat() {
  if (!state.chat.length) return;
  state.chat.slice(-30).forEach(item => addMessage(item.text, item.sender, false));
}

function groupByDay() {
  return state.entries.reduce((acc, entry) => {
    acc[entry.day] = (acc[entry.day] || 0) + Number(entry.hours || 0);
    return acc;
  }, {});
}

function groupByProject() {
  return state.entries.reduce((acc, entry) => {
    acc[entry.project] = (acc[entry.project] || 0) + Number(entry.hours || 0);
    return acc;
  }, {});
}

function getTotalHours() {
  return state.entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
}

function exportCSV() {
  if (!state.entries.length) {
    alert("No entries to export.");
    return;
  }

  const rows = [["Day", "Project", "Hours", "Created At", "Updated At"]];
  state.entries.forEach(entry => rows.push([entry.day, entry.project, entry.hours, entry.createdAt, entry.updatedAt]));
  const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "worklog-export.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm("Delete all entries and chat history?")) return;
  state.entries = [];
  state.chat = [];
  saveState();
  document.getElementById("chat-box").innerHTML = '<div class="message assistant"><div class="meta">WorkLog AI</div><div class="bubble">All data cleared. You can start fresh.</div></div>';
  renderAll();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem(THEME_KEY, document.body.classList.contains("light") ? "light" : "dark");
}

function titleCase(value) {
  return String(value).trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

function formatHours(value) {
  return Number(value || 0).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(THEME_KEY) === "light") document.body.classList.add("light");
  restoreChat();
  renderAll();
  document.getElementById("input-form").addEventListener("submit", handleSubmit);
  document.getElementById("export-btn").addEventListener("click", exportCSV);
  document.getElementById("clear-btn").addEventListener("click", clearAll);
  document.getElementById("theme-btn").addEventListener("click", toggleTheme);
});
