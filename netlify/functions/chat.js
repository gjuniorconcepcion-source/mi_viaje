export async function handler(event) {

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  try {

    const { messages } = JSON.parse(event.body);

    const respuesta = await fetch("https://api.groq.com/openai/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },

      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })

    });

    const data = await respuesta.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };

  }
}
