
const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const chat = document.getElementById("chat");
const sendButton = document.getElementById("send");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;

  return message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";
  sendButton.disabled = true;

  const loading = addMessage(
    "Samuge-AI iratekereza...",
    "bot"
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Habaye ikibazo.");
    }

    loading.textContent = data.reply;

  } catch (error) {
    loading.textContent =
      "Mbabarira, habaye ikibazo: " + error.message;

  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});
