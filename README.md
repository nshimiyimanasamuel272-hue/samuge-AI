
<!DOCTYPE html>
<html lang="rw">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Chatbot</title>
<style>
body {
  font-family: Arial;
  background: #e9eef5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.chat {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px #aaa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
header {
  background: #075bea;
  color: white;
  padding: 18px;
  text-align: center;
  font-size: 20px;
}
#messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}
.msg {
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  max-width: 80%;
}
.user {
  background: #075bea;
  color: white;
  margin-left: auto;
}
.bot {
  background: #eee;
  color: black;
}
form {
  display: flex;
  padding: 10px;
  gap: 5px;
}
input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
}
button {
  background: #075bea;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 20px;
  cursor: pointer;
}
</style>
</head>
<body>

<div class="chat">
  <header>🤖 My Chatbot</header>
  <div id="messages">
    <div class="msg bot">
      Muraho! Ndi chatbot yawe. Nakugirira iki?
    </div>
  </div>

  <form id="chatForm">
    <input id="question"
      placeholder="Andika ubutumwa..."
      autocomplete="off" required>
    <button type="submit">Ohereza</button>
  </form>
</div>

<script>
const form = document.getElementById("chatForm");
const input = document.getElementById("question");
const messages = document.getElementById("messages");

function reply(text) {
  let q = text.toLowerCase();

  if (q.includes("muraho")) {
    return "Muraho neza! Amakuru yawe?";
  }
  if (q.includes("witwa nde")) {
    return "Nitwa My Chatbot.";
  }
  if (q.includes("amakuru")) {
    return "Ni meza cyane! Wowe se?";
  }
  if (q.includes("urakoze")) {
    return "Murakoze nawe! Nishimiye kugufasha.";
  }
  if (q.includes("amakuru yawe")) {
    return "Meze neza cyane!";
  }

  return "Mbabarira, sindasobanukirwa neza. Gerageza kubaza ukundi.";
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(reply(text), "bot");
  }, 500);
});
</script>

</body>
</html>
