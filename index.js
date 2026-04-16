const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔥 IA (Jarvis inteligente)
async function generarRespuesta(pregunta) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Eres Jarvis, un asistente elegante, serio y profesional. Respondes en español de forma clara y breve."
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
        return "Lo siento, ocurrió un problema al procesar su solicitud.";
    }
}

// 🔊 Endpoint Alexa
app.post("/api/alexa/webhook", async (req, res) => {

    const request = req.body.request;

    let pregunta = "";

    // 🟢 Si es intent (cuando preguntas algo)
    if (request && request.type === "IntentRequest") {
        const intent = request.intent;

        if (intent && intent.slots && intent.slots.query && intent.slots.query.value) {
            pregunta = intent.slots.query.value;
        } else {
            pregunta = "saludo";
        }

    } else {
        // 🔵 Si solo abres la skill
        pregunta = "saludo";
    }

    let respuestaIA = "";

    if (pregunta === "saludo") {
        respuestaIA = "Buenas noches. Soy Jarvis, su asistente personal. ¿En qué puedo ayudarle?";
    } else {
        respuestaIA = await generarRespuesta(pregunta);
    }

    const response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: `<speak>
                    <prosody rate="85%" pitch="-5%">
                        ${respuestaIA}
                    </prosody>
                </speak>`
            },
            shouldEndSession: false
        }
    };

    res.json(response);
});

// 🌐 Health check
app.get("/", (req, res) => {
    res.send("Jarvis IA activo 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});
