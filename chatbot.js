// Contexto del blog que el chatbot conoce
const SYSTEM_PROMPT = `
Eres un asistente virtual amigable del blog de viajes de Junior García (conocido como Morgan).
Solo respondes preguntas relacionadas con su blog, sus viajes y sobre él como persona.

Información que conoces:

SOBRE JUNIOR (MORGAN):
- Su nombre completo es Junior Concepción García Álvarez.
- Tiene 21 años.
- Estudia Ingeniería en Sistemas Computacionales en la UJAT.
- Le gustan las matemáticas, los videojuegos y el fútbol.
- Disfruta viajar con su familia.

LUGAR 1 — YUMKÁ:
- Parque natural en Tabasco.
- Visitado por Junior con su familia.
- Experiencia llena de animales salvajes y naturaleza.

LUGAR 2 — PALAPA SAN MIGUEL:
- Lugar turístico con agua y lanchas.
- Fue a celebrar el cumpleaños de su mamá.

Responde siempre en español, de forma amigable y breve.
`;

const historial = [];

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

  historial.push({ role: "user", content: texto });

  const typing = agregarMensaje("bot", "...");

  try {

    const respuesta = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...historial
        ]
      })
    });

    const data = await respuesta.json();

    typing.remove();

    const respuestaBot = data.choices[0].message.content;

    historial.push({
      role: "assistant",
      content: respuestaBot
    });

    agregarMensaje("bot", respuestaBot);

  } catch (error) {

    typing.remove();
    agregarMensaje("bot", "Ups, hubo un problema 😅");

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