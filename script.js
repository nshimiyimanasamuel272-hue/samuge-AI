// Set this to the URL of your deployed backend, e.g. https://samugeai-api.onrender.com
// Never put your OpenAI API key in this frontend file.
const API_BASE_URL = "https://YOUR-BACKEND-URL";

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");
const languageSelect = document.getElementById("language");
const statusText = document.getElementById("status");
document.getElementById("year").textContent = new Date().getFullYear();

const ui = {
  rw: { placeholder: "Andika ikibazo cyawe hano...", send: "Ohereza ↑", status: "Wandika ikibazo cyawe hasi.", welcome: "Muraho! Ndi SamugeAI. Nakugirira akahe kamaro uyu munsi?", thinking: "SamugeAI iratekereza…", error: "Habaye ikibazo cyo kugera kuri AI. Reba URL ya backend wongere ugerageze.", empty: "Banza wandike ubutumwa." },
  en: { placeholder: "Type your question here...", send: "Send ↑", status: "Type your question below.", welcome: "Hello! I'm SamugeAI. How can I help you today?", thinking: "SamugeAI is thinking…", error: "Could not connect to the AI service. Check the backend URL and try again.", empty: "Please type a message first." }
};

function addMessage(text, role, label) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  const name = document.createElement("strong");
  name.textContent = label || (role === "user" ? "You" : "SamugeAI");
  const body = document.createElement("p");
  body.textContent = text;
  item.append(name, body);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  return item;
}

function updateLanguage() {
  const t = ui[languageSelect.value];
  input.placeholder = t.placeholder;
  sendButton.textContent = t.send;
  statusText.textContent = t.status;
}
languageSelect.addEventListener("change", updateLanguage);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  const lang = languageSelect.value;
  const t = ui[lang];
  if (!message) { statusText.textContent = t.empty; return; }
  if (API_BASE_URL.includes("YOUR-BACKEND-URL")) {
    addMessage("Backend URL has not been configured yet. Deploy the backend, then add its URL to script.js.", "error", "Setup needed");
    return;
  }

  addMessage(message, "user", lang === "rw" ? "Wowe" : "You");
  input.value = "";
  sendButton.disabled = true;
  statusText.textContent = t.thinking;
  const waiting = addMessage(t.thinking, "assistant");

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language: lang })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    waiting.querySelector("p").textContent = data.reply || "No response returned.";
  } catch (error) {
    waiting.remove();
    addMessage(`${t.error} (${error.message})`, "error");
  } finally {
    sendButton.disabled = false;
    statusText.textContent = t.status;
    input.focus();
  }
});
updateLanguage();
