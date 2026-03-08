

// 🔑 REEMPLAZA con tu API Key de Groq (console.groq.com)
const GROQ_API_KEY = "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";

// Contexto del blog que el chatbot conoce
const SYSTEM_PROMPT = `
Eres un asistente virtual amigable del blog de viajes de Junior García (conocido como "Morgan").
Solo respondes preguntas relacionadas con su blog, sus viajes y sobre él como persona.
Si te preguntan algo que no tiene que ver con el blog o los viajes, dices amablemente que solo puedes hablar sobre el blog.

Información que conoces:

SOBRE JUNIOR (MORGAN):
- Su nombre completo es Junior Concepción García Álvarez, le dicen "Morgan".
- Tiene 21 años, estudia ISC en la UJAT de Tabasco, División DACYTI.
- Le apasionan las matemáticas, los videojuegos, el fútbol y estar con amigos.
- Le gusta viajar y disfrutar la vida con su familia.

LUGAR 1 — YUMKÁ (Tabasco, México):
- Parque de naturaleza y animales salvajes en Tabasco.
- Junior lo visitó a sus 20 años junto a su familia.
- Describe la experiencia como mágica: pudo ver animales tiernos, peligrosos y enormes.
- Fue su primera vez visitando ese lugar y la pasó de maravilla.

LUGAR 2 — PALAPA SAN MIGUEL (Tabasco, México):
- Lugar turístico junto al agua, con lanchas.
- Fueron a celebrar el cumpleaños de la mamá de Junior.
- Junior pudo subirse a una lancha y sentir la brisa del agua.
- También fue su primera vez en ese tipo de lugar y lo disfrutó mucho.

Responde siempre en español, de forma breve, amigable y con emojis ocasionales.
`;

// Historial de mensajes para mantener contexto
const historial = [];

// ---- DOM ----
const chatMessages = document.getElementById("chat-messages");
const chatInput    = document.getElementById("chat-input");
const chatBtn      = document.getElementById("chat-send");
const chatToggle   = document.getElementById("chat-toggle");
const chatBox      = document.getElementById("chat-box");

// Mostrar/ocultar chat
chatToggle.addEventListener("click", () => {
  chatBox.classList.toggle("chat-abierto");
  if (chatBox.classList.contains("chat-abierto") && chatMessages.children.length === 0) {
    agregarMensaje("bot", "¡Hola! 👋 Soy el asistente de Morgan. Puedes preguntarme sobre sus viajes a Yumká o Palapa San Miguel, o sobre él. ¿En qué te puedo ayudar?");
  }
});

// Enviar con botón
chatBtn.addEventListener("click", enviarMensaje);

// Enviar con Enter
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

async function enviarMensaje() {
  const texto = chatInput.value.trim();
  if (!texto) return;

  // Mostrar mensaje del usuario
  agregarMensaje("user", texto);
  chatInput.value = "";
  chatBtn.disabled = true;

  // Agregar al historial
  historial.push({ role: "user", content: texto });

  // Mostrar indicador de escritura
  const typing = agregarMensaje("bot", "...", true);

  try {
    const respuesta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...historial
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await respuesta.json();

    if (data.choices && data.choices[0]) {
      const respuestaBot = data.choices[0].message.content;
      historial.push({ role: "assistant", content: respuestaBot });
      typing.remove();
      agregarMensaje("bot", respuestaBot);
    } else {
      typing.remove();
      agregarMensaje("bot", "Ups, algo salió mal. Intenta de nuevo 😅");
    }

  } catch (error) {
    typing.remove();
    agregarMensaje("bot", "No pude conectarme. Revisa tu conexión 🌐");
    console.error("Groq error:", error);
  }

  chatBtn.disabled = false;
  chatInput.focus();
}

function agregarMensaje(tipo, texto, esTyping = false) {
  const div = document.createElement("div");
  div.classList.add("chat-msg", `chat-msg-${tipo}`);
  if (esTyping) div.classList.add("typing");
  div.textContent = texto;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}
