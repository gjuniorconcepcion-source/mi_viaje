const API_KEY = "AIzaSyDUdMEEgbFRFjRVMuxF8kYIRDzojon0-ig";

// Contexto del blog
const SYSTEM_PROMPT = `
Eres un asistente virtual amigable del blog de viajes de Junior García (Morgan).
Solo respondes preguntas sobre su blog, sus viajes o sobre él.

Información:

SOBRE JUNIOR:
- Junior Concepción García Álvarez
- 21 años
- Estudia Ingeniería en Sistemas Computacionales en la UJAT
- Le gustan los videojuegos, matemáticas y fútbol

LUGARES VISITADOS:

YUMKÁ
- Parque natural en Tabasco
- Visitado con su familia
- Animales salvajes y naturaleza

PALAPA SAN MIGUEL
- Lugar turístico con lanchas
- Celebraron el cumpleaños de su mamá

Responde siempre en español, amigable y breve.
`;

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatBtn = document.getElementById("chat-send");
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");

chatToggle.addEventListener("click", () => {
  chatBox.classList.toggle("chat-abierto");
});

chatBtn.addEventListener("click", enviarMensaje);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

async function enviarMensaje() {

  const texto = chatInput.value.trim();
  if (!texto) return;

  agregarMensaje("user", texto);
  chatInput.value = "";

  const typing = agregarMensaje("bot", "...");

  try {

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: SYSTEM_PROMPT + "\nUsuario: " + texto
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    typing.remove();

    const respuesta =
      data.candidates[0].content.parts[0].text;

    agregarMensaje("bot", respuesta);

  } catch (error) {

    typing.remove();
    agregarMensaje("bot", "Hubo un error 😅");

    console.error(error);

  }

}

function agregarMensaje(tipo, texto) {

  const div = document.createElement("div");

  div.classList.add("chat-msg");
  div.classList.add(`chat-msg-${tipo}`);

  div.textContent = texto;

  chatMessages.appendChild(div);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return div;
}