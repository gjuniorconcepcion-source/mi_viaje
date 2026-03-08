const API_KEY = "AIzaSyDUdMEEgbFRFjRVMuxF8kYIRDzojon0-ig";

const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatSend = document.getElementById("chat-send");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatToggle.onclick = () => {
  chatBox.classList.toggle("chat-abierto");
};

chatSend.onclick = enviarMensaje;

chatInput.addEventListener("keypress", function(e){
  if(e.key === "Enter") enviarMensaje();
});

function agregarMensaje(texto, tipo){
  const msg = document.createElement("div");
  msg.className = "mensaje " + tipo;
  msg.textContent = texto;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function enviarMensaje(){

  const textoUsuario = chatInput.value.trim();

  if(!textoUsuario) return;

  agregarMensaje(textoUsuario,"usuario");

  chatInput.value="";

  agregarMensaje("Pensando...","bot");

  try{

    const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        contents:[
          {
            parts:[
              {text:textoUsuario}
            ]
          }
        ]
      })
    });

    const data = await respuesta.json();

    document.querySelector(".bot:last-child").remove();

    const textoIA = data.candidates[0].content.parts[0].text;

    agregarMensaje(textoIA,"bot");

  }catch(error){

    document.querySelector(".bot:last-child").remove();

    agregarMensaje("Error al conectar con el asistente.","bot");

    console.error(error);
  }
}