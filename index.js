const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔥 Función inteligente (Jarvis con IA)
async function generarRespuesta(pregunta) {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres Jarvis, un asistente elegante que responde en español de forma clara, breve y formal." },
                { role: "user", content: pregunta }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                "Content-Type": "application/json"
            }
        });

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Error IA:", error.message);
        return "Lo siento, ocurrió un problema al procesar su solicitud.";
    }
}

// 🔊 Endpoint para Alexa
app.post("/api/alexa/webhook", async (req, res) => {

    let pregunta = "su consulta";

    try {
        const intent = req.body.request.intent;
        if (intent && intent.slots && intent.slots.query) {
            pregunta = intent.slots.query.value;
        }
    } catch (e) {
        console.log("No se pudo leer la pregunta");
    }

    const respuestaIA = await generarRespuesta(pregunta);

    const response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: `<speak>
    <prosody rate="90%" pitch="-4%">
        Procesando su solicitud. <break time="300ms"/>
        ${respuestaIA}
    </prosody>
</speak>`
            },
            shouldEndSession: false
        }
    };

    res.json(response);
});

// 🌐 Ruta para verificar que funciona
app.get("/", (req, res) => {
    res.send("Jarvis inteligente activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));
