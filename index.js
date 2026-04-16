const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔥 Función inteligente con IA
async function generarRespuesta(pregunta) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Eres Jarvis, un asistente elegante, serio y profesional que responde en español de forma clara y breve."
                    },
                    {
                        role: "user",
                        content: pregunta
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Error IA:", error.message);
        return "Lo siento, no pude procesar su solicitud en este momento.";
    }
}

// 🔊 Endpoint para Alexa
app.post("/api/alexa/webhook", async (req, res) => {

    let pregunta = "su consulta";

    try {
        const intent = req.body.request.intent;

        if (intent && intent.slots && intent.slots.query && intent.slots.query.value) {
            pregunta = intent.slots.query.value;
        }

    } catch (error) {
        console.log("No se pudo leer la pregunta");
    }

    const respuestaIA = await generarRespuesta(pregunta);

    const response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: `<speak>
                    <prosody rate="85%" pitch="-5%">
                        Procesando su solicitud. <break time="400ms"/>
                        ${respuestaIA}
                    </prosody>
                </speak>`
            },
            shouldEndSession: false
        }
    };

    res.json(response);
});

// 🌐 Ruta de prueba
app.get("/", (req, res) => {
    res.send("Jarvis inteligente activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});
